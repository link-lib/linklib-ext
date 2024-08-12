import { useContext, useEffect, useState } from 'react';
import { AuthModalContext } from '../context/AuthModalContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { logIn, signUp } from '../actions';
import { useToast } from '@/components/ui/use-toast';

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
		isOpen && (
			<div
				style={{
					height: '300px',
					top: '150px',
					position: 'fixed',
					boxShadow: '0px 12px 48px rgba(29, 5, 64, 0.32)',
					left: '50%',
				}}
				className='-translate-x-1/2 -translate-y-1/2 rounded-md border-none bg-secondary flex flex-col justify-between p-4 align-middle items-center z-1000 '
			>
				<div className='w-full flex flex-row justify-end'>
					<button
						onClick={() => setIsOpen(false)}
						className=' text-white cursor-pointer'
					>
						X
					</button>
				</div>
				<p className='text-primary mb-4'>
					Please log in or sign up to continue.
				</p>
				{isSignUp && (
					<Input
						type='text'
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						placeholder='First Name'
						className='w-full mb-4 text-primary'
					/>
				)}
				<Input
					type='text'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder='Email'
					className='w-full mb-4 text-primary'
				/>
				<Input
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder='Password'
					className='w-full mb-4 text-primary'
				/>
				<Button
					variant={'ghost'}
					onClick={isSignUp ? handleSignUp : handleLogin}
					className='w-full text-white py-2 rounded-md'
				>
					{isSignUp ? 'Sign Up' : 'Log In'}
				</Button>

				<p
					onClick={() => setIsSignUp(!isSignUp)}
					className=' text-white cursor-pointer hover:underline text-xs'
				>
					{isSignUp
						? 'Already have an account?'
						: "Don't have an account?"}
				</p>
			</div>
		)
	);
};
