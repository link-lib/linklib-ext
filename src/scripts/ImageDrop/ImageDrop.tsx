import iconImage from '@/assets/icon.png';
import iconEating from '@/assets/iconEating.png';
import { saveImage } from '@/backend/saveImage';
import { Button } from '@/components/ui/button';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeftFromLine, Heart, ImageUp } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

const ImageDrop = () => {
	const [isDragging, setIsDragging] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isSelectingFile, setIsSelectingFile] = useState(false);
	const [isIconUp, setIsIconUp] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
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
					})
				)
				.catch(() =>
					toast({
						title: 'Failed to save image',
						description: `File: ${file.name}`,
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
				});
			}
		}
	};

	useEffect(() => {
		window.addEventListener('dragenter', handleDragEnter, false);
		window.addEventListener('dragleave', handleDragLeave, false);
		window.addEventListener('drop', handleDrop, false);

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
			window.removeEventListener('drop', handleDrop);
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
		setIsSelectingFile(true);
		setIsDragging(false); // Ensure isDragging is false when opening file input
		fileInputRef.current?.click();
	};

	const handleFileChange: FormEventHandler = (e) => {
		e.preventDefault();
		const file = fileInputRef.current?.files?.[0];
		if (file) {
			console.log('Selected file:', file);
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
				);
		}
		setIsSelectingFile(false);
		setIsDragging(false); // Reset isDragging state
	};

	const handleSaveLink = () => {
		// Implement the logic to save the current page link
		console.log('Saving current page link');
		// You might want to call a function from your backend here
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
					<HoverCard>
						<HoverCardTrigger>
							<Button onClick={handleButtonClick}>
								<ImageUp className='w-4 h-4' />
							</Button>
						</HoverCardTrigger>
						<HoverCardContent>
							Drag and drop onto the image to the Bytebelli
							monster to save to linklib!
						</HoverCardContent>
					</HoverCard>

					<Button onClick={handleSaveLink} variant='outline'>
						<Heart className='w-4 h-4' />
					</Button>
					<Button onClick={handleOpenDrawer} variant='outline'>
						<ArrowLeftFromLine className='w-4 h-4' />
					</Button>
					<form
						onSubmit={handleFileChange}
						className='hidden'
						onAbort={() => {
							setIsDragging(false);
						}}
					>
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
