import iconImage from '@/assets/icon.png';
import iconEating from '@/assets/iconEating.png';
import { saveImage } from '@/backend/saveImage';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { useContext } from 'react';
import {
	getArticleMetadata,
	getLinkIcon,
} from '@/scripts/ImageDrop/saveWebsite';
import { ArrowLeftFromLine, Heart, ImageUp } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { EnterIcon, ExitIcon } from '@radix-ui/react-icons';
import { removeLocalStorage } from '../../../utils/supabase/client';
import { signOut } from '@/backend/auth/actions';
import { getValidSession } from '@/backend/auth/authUtils';
import { withAuth } from '@/backend/auth/withAuth';
import { AuthModalContext } from '../auth/context/AuthModalContext';

const ImageDrop = () => {
	const [isDragging, setIsDragging] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isSelectingFile, setIsSelectingFile] = useState(false);
	const [isIconUp, setIsIconUp] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const authModalContext = useContext(AuthModalContext);
	const { toast } = useToast();

	const handleDragEnter = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (
			!e.relatedTarget ||
			!(e.relatedTarget as HTMLElement).closest('.image-drop')
		) {
			setIsDragging(false);
		}
	};

	useEffect(() => {
		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			if (e.dataTransfer?.files[0]) {
				const file = e.dataTransfer.files[0];
				console.log('is a file');
				const dT = new DataTransfer();
				dT.items.add(file);
				saveImage(dT.files[0])
					.then(() =>
						toast({
							title: 'Image saved',
							description: `File: ${file.name}`,
							duration: 1500,
						})
					)
					.catch(() =>
						toast({
							title: 'Failed to save image',
							description: `File: ${file.name}`,
							duration: 1500,
						})
					);
			} else {
				// Try dataTransfer url second
				const dataTransferUrl = e.dataTransfer?.getData('url');
				if (dataTransferUrl) {
					console.log('is a url');
					console.log(dataTransferUrl);
					// TODO (backend) save link of image
					toast({
						title: 'Image URL saved',
						description: dataTransferUrl,
						duration: 1500,
					});
				}
			}
		};

		window.addEventListener('drop', handleDrop, false);

		return () => {
			window.removeEventListener('drop', handleDrop);
		};
	}, [toast]);

	const [userAuthenticated, setUserAuthenticated] = useState(false);

	const handleSignOut = async () => {
		try {
			await signOut();
			setUserAuthenticated(false);
			toast({
				title: 'Successfully signed out.',
				description: "We'll see you again soon!",
				action: (
					<Button onClick={() => authModalContext?.setIsOpen(true)}>
						Sign In
					</Button>
				),
			});
		} catch {
			toast({
				title: 'Failed to sign out',
				description: 'Try again later',
			});
		}
	};

	useEffect(() => {
		const checkAuthStatus = async () => {
			const authStatus = await getValidSession();
			setUserAuthenticated(!!authStatus);
			if (!authStatus) {
				await removeLocalStorage('session');
			}
		};

		checkAuthStatus();
	}, [isHovered, isSelectingFile]);

	useEffect(() => {
		window.addEventListener('dragenter', handleDragEnter, false);
		window.addEventListener('dragleave', handleDragLeave, false);

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.shiftKey && e.key === '4') {
				setIsIconUp((prev) => !prev);
			}
		};
		window.addEventListener('keydown', handleKeyDown);

		const handleMessage = (message: any) => {
			if (message.action === 'toggleIconPosition') {
				setIsIconUp((prev) => !prev);
			}
		};
		chrome.runtime.onMessage.addListener(handleMessage);

		return () => {
			window.removeEventListener('dragenter', handleDragEnter);
			window.removeEventListener('dragleave', handleDragLeave);
			window.removeEventListener('keydown', handleKeyDown);
			chrome.runtime.onMessage.removeListener(handleMessage);
		};
	}, []);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	const handleButtonClick = () => {
		setIsHovered(false);
		setIsDragging(false);
		fileInputRef.current?.click();
	};

	const handleFileChange: FormEventHandler = (e) => {
		e.preventDefault();
		const file = fileInputRef.current?.files?.[0];
		if (file) {
			console.log('Selected file:', file);
			withAuth(
				() =>
					saveImage(file)
						.then(() =>
							toast({
								title: 'Image uploaded',
								description: `File: ${file.name}`,
							})
						)
						.catch(() =>
							toast({
								title: 'Error uploading image',
								description: `File: ${file.name}`,
							})
						),
				authModalContext
			);
		}
		setIsSelectingFile(false);
		setIsDragging(false); // Reset isDragging state
	};

	const handleSaveLink = () => {
		// Get the current page URL
		const url = window.location.href;

		// Get the page title
		const title = document.title;

		// Get the favicon URL
		const favicon = getLinkIcon();

		// Get the author and publish date
		const { author, publishDate } = getArticleMetadata();
		const savedDate = new Date().toString();
		// Log the collected data (replace with your save logic)
		console.log('Saving link:', {
			url,
			title,
			favicon,
			author,
			publishDate,
			savedDate,
		});

		// const obj = {
		// 	url,
		// 	title,
		// 	favicon,
		// 	author,
		// 	publishDate,
		// 	savedDate,
		// };
		// TODO: Implement your logic to save this data
		// saveLink({ url, title, favicon, author, publishDate });

		toast({
			title: 'Link saved',
			description: title,
			duration: 1500,
		});
	};

	const handleOpenDrawer = () => {};

	return (
		<div
			id='dropContainer'
			className={`fixed right-1 z-50 image-drop w-fit transition-all duration-300 ${
				isIconUp ? 'bottom-20' : 'bottom-1'
			}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onDragOver={(e) => e.preventDefault()}
		>
			{isDragging ? (
				<div className='rounded-full w-10 h-10 flex items-center justify-center bg-popover'>
					<img
						src={chrome.runtime.getURL(iconEating)}
						alt='Linklib Icon'
						className='w-full h-full p-1 object-cover rounded-full'
					/>
				</div>
			) : isHovered || isSelectingFile ? (
				<div className='bg-popover p-2 rounded-lg flex items-center gap-2'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Button
									onClick={
										userAuthenticated
											? handleSignOut
											: () =>
													authModalContext?.setIsOpen(
														true
													)
									}
									variant='outline'
								>
									{userAuthenticated ? (
										<ExitIcon className='w-4 h-4' />
									) : (
										<EnterIcon className='w-4 h-4' />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									{userAuthenticated ? 'Sign out' : 'Sign In'}
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Button
									onClick={handleButtonClick}
									variant='outline'
								>
									<ImageUp className='w-4 h-4' />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									Drag and drop any image directly on bytey to
									save to ByteBelli!
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Button
									onClick={handleSaveLink}
									variant='outline'
								>
									{/* TODO: Fill heart if link is already saved */}
									<Heart className='w-4 h-4' />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Click to save the link to this site!</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Button
									onClick={handleOpenDrawer}
									variant='outline'
									disabled
								>
									<ArrowLeftFromLine className='w-4 h-4' />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>See all highlights on this page!</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<form onSubmit={handleFileChange} className='hidden'>
						<input type='file' ref={fileInputRef} />
						<input type='submit' role='button' />
					</form>
				</div>
			) : (
				<div className='rounded-full w-10 h-10 flex items-center justify-center bg-popover'>
					<img
						src={chrome.runtime.getURL(iconImage)}
						alt='Linklib Icon'
						className='w-full h-full p-1 object-cover rounded-full'
					/>
				</div>
			)}
		</div>
	);
};

export default ImageDrop;
