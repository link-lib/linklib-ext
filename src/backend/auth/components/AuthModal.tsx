import { useContext, useEffect, useState } from 'react';
import { AuthModalContext } from '../context/AuthModalContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { logIn, signUp } from '../actions';
import { useToast } from '@/components/ui/use-toast';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';

export const AuthModal = () => {
	const { isOpen, setIsOpen } = useContext(AuthModalContext) ?? {
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

	const handleLogin = async () => {
		const formData = new FormData();
		formData.append('email', email);
		formData.append('password', password);
		logIn(formData)
			.then(() => {
				toast({
					title: 'Logged in successfully!',
					description: `Time to peruse ;)`,
				});
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
				toast({
					title: 'Signed up successfully!',
					description: `Time to peruse ;)`,
				});
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

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className='w-[500px] heehee'>
				<DialogHeader>
					<DialogTitle className='text-primary'>
						{isSignUp ? 'Sign Up' : 'Log In'}
					</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
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
				</div>
				<DialogFooter>
					<Button
						variant='default'
						onClick={isSignUp ? handleSignUp : handleLogin}
						className='w-full'
					>
						{isSignUp ? 'Sign Up' : 'Log In'}
					</Button>
				</DialogFooter>
				<p
					onClick={() => setIsSignUp(!isSignUp)}
					className='text-sm text-center cursor-pointer hover:underline mt-4 text-primary'
				>
					{isSignUp
						? 'Already have an account?'
						: "Don't have an account?"}
				</p>
			</DialogContent>
		</Dialog>
	);
};
