import { useContext, useState } from 'react';
import { AuthModalContext } from '../context/AuthModalContext';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { logIn, signUp } from '../actions';

export const AuthModal = () => {
	const { isOpen, setIsOpen } = useContext(AuthModalContext) ?? {
		isOpen: false,
		setIsOpen: () => null,
	};
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);

	const handleLogin = async () => {
		const formData = new FormData();
		formData.append('email', email);
		formData.append('password', password);
		logIn(formData)
			.then(() => {
				console.log('Logged in Successfully');
			})
			.catch(() => console.log('Failed to log in'));
	};

	const handleSignUp = async () => {
		const formData = new FormData();
		formData.append('firstName', firstName);
		formData.append('email', email);
		formData.append('password', password);
		signUp(formData)
			.then(() => {
				console.log('Signed up Successfully');
			})
			.catch(() => console.log('Failed sign up'));
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button>Open Login/Signup</button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Login or Sign Up</DialogTitle>
				<DialogDescription>
					Please log in or sign up to continue.
				</DialogDescription>
				<Input
					type='text'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder='Email'
				/>
				<Input
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder='Password'
				/>
				<Button onClick={isSignUp ? handleSignUp : handleLogin}>
					{isSignUp ? 'Sign Up' : 'Log In'}
				</Button>
				{isSignUp && (
					<Input
						type='text'
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						placeholder='First Name'
					/>
				)}
				<p onClick={() => setIsSignUp(!isSignUp)}>
					{isSignUp
						? 'Already have an account?'
						: "Don't have an account?"}
				</p>
				<DialogClose asChild>
					<button>Close</button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
};
