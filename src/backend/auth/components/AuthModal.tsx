import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../scripts/auth/context/AuthModalContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { logIn, signInWithGoogle, signUp } from '../actions';
import { useToast } from '@/components/ui/use-toast';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

export const AuthModal = () => {
	const { isOpen, setIsOpen } = useContext(AuthContext) ?? {
		isOpen: false,
		setIsOpen: () => null,
	};
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
	const { toast } = useToast();

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
			.then(() => {
				successToast();
				console.log('Logged in Successfully');
				setIsOpen(false);
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
			.then(() => {
				successToast();
				setIsOpen(false);
			})
			.catch(() => {
				toast({
					title: 'Error in authenticating with Google',
				});
			});
	};

	return (
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
	);
};
