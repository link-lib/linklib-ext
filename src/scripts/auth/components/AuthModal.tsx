import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthModalContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { logIn, signInWithGoogle, signUp } from '../../../backend/auth/actions';
import { useToast } from '@/components/ui/use-toast';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Session } from '@supabase/supabase-js';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import onboardingExample from '@/assets/onboardingExample2.png';
import pinExtension from '@/assets/pinExtension.png';

export const AuthModal = () => {
	const { isOpen, setIsOpen, setSession, setUser } = useContext(
		AuthContext
	) ?? {
		isOpen: false,
		setIsOpen: () => null,
	};
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
	const { toast } = useToast();
	const [showWelcome, setShowWelcome] = useState(false);
	const [welcomeStep, setWelcomeStep] = useState(1);

	useEffect(() => {
		setEmail('');
		setPassword('');
		setFirstName('');
		setIsSignUp(false);
	}, [isOpen]);

	const successToast = () =>
		toast({
			title: 'Signed in successfully!',
			description: `Time to peruse ;)`,
		});

	const handleLogin = async () => {
		const formData = new FormData();
		formData.append('email', email);
		formData.append('password', password);
		logIn(formData)
			.then((data) => {
				successToast();
				console.log('Logged in Successfully');
				setIsOpen(false);
				setSession(data.session);
				setUser(data.user);
			})
			.catch((e) => {
				toast({
					title: 'Failed to log in :(',
					description: e.message,
				});
				console.log('Failed to log in');
				setIsOpen(false);
			});
	};

	const handleSignUp = async () => {
		const formData = new FormData();
		formData.append('firstName', firstName);
		formData.append('email', email);
		formData.append('password', password);
		signUp(formData)
			.then(() => {
				successToast();
				console.log('Signed up Successfully');
				setIsOpen(false);
				setShowWelcome(true); // Show welcome dialog for new users
			})
			.catch((e) => {
				toast({
					title: 'Error in signing up :(',
					description: e.message,
				});
				console.log('Failed sign up');
			});
	};

	const handleGoogleLogin = async () => {
		signInWithGoogle()
			.then((response: unknown) => {
				const session = response as Session;
				successToast();
				setIsOpen(false);
				setSession(session);
				setUser(session.user);
				const createdAt = new Date(session.user.created_at);
				const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
				if (createdAt > fiveMinutesAgo) {
					setShowWelcome(true); // Show welcome dialog for new Google users
				}
			})
			.catch(() => {
				toast({
					title: 'Error in authenticating with Google',
				});
			});
	};

	const handleWelcomeChange = (open: boolean) => {
		if (!open && welcomeStep === 2) {
			setShowWelcome(false);
			setWelcomeStep(1);
		}
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='w-[500px] heehee p-4'>
					<DialogHeader>
						<DialogTitle className='text-primary text-center p-4'>
							{isSignUp ? 'Sign Up' : 'Log In'}
						</DialogTitle>
					</DialogHeader>
					<div className='grid gap-4 p-4'>
						{isSignUp && (
							<Input
								type='text'
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								placeholder='First Name'
								className='w-full text-primary'
							/>
						)}
						<Input
							type='text'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='Email'
							className='w-full text-primary'
						/>
						<Input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='Password'
							className='w-full text-primary'
						/>

						<Button
							variant='default'
							onClick={isSignUp ? handleSignUp : handleLogin}
							className='w-full'
						>
							{isSignUp ? 'Sign Up' : 'Log In'}
						</Button>

						<div className='relative py-4'>
							<div className='absolute inset-0 flex items-center'>
								<span className='w-full border-t' />
							</div>
							<div className='relative flex justify-center uppercase'>
								<span className='bg-background px-2 text-muted-foreground text-xs'>
									Or continue with
								</span>
							</div>
						</div>
						<Button
							variant='outline'
							type='button'
							onClick={handleGoogleLogin}
						>
							Google
						</Button>
						<p
							onClick={() => setIsSignUp(!isSignUp)}
							className='text-sm text-center cursor-pointer hover:underline mt-4 text-muted-foreground'
						>
							{isSignUp
								? 'Already have an account?'
								: "Don't have an account?"}
						</p>
					</div>
				</DialogContent>
			</Dialog>

			<AlertDialog open={showWelcome} onOpenChange={handleWelcomeChange}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{welcomeStep === 1
								? 'Welcome to The Social Pen Extension!'
								: 'One Last Thing!'}
						</AlertDialogTitle>
						<AlertDialogDescription className='space-y-4'>
							{welcomeStep === 1 ? (
								<>
									<p>
										Simply select any text on any website to
										make a highlight, reaction, or comment
										:) Here's what it looks a highlighted
										page looks like!
									</p>
									<img
										src={chrome.runtime.getURL(
											onboardingExample
										)}
										alt='Example of highlighting text'
										className='rounded-lg border shadow-sm'
									/>
								</>
							) : (
								<>
									<p>
										Pin the extension to your Chrome toolbar
										for easy access! We'll be adding a feed
										and notifications so you don't miss
										people's responses there.
									</p>
									<img
										src={chrome.runtime.getURL(
											pinExtension
										)}
										alt='How to pin the extension'
										className='rounded-lg border shadow-sm'
									/>
									<p>
										Please give us feedback on how to make
										this more useful and amazing for you, we
										really do care.
									</p>
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							onClick={() => {
								if (welcomeStep === 1) {
									setWelcomeStep(2);
								} else {
									setShowWelcome(false);
									setWelcomeStep(1);
								}
							}}
						>
							{welcomeStep === 1 ? 'Next' : "Let's dive in!"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
