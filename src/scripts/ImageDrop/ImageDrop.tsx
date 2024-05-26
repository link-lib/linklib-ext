import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const ImageDrop = () => {
	const [isDragging, setIsDragging] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

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

		console.log(e);
		// Image drop only works if it's like a google image where you're dragging an actual file from your computer
		const files = e.dataTransfer?.files;
		// The links don't actually work? Never shows up in that data structure at least
		const items = e.dataTransfer?.items;

		// Backend
		if (files && files.length > 0) {
			const file = files[0];
			// Handle the file (e.g., upload or display the image)
			console.log('File dropped:', file);
		} else if (items) {
			for (let i = 0; i < items.length; i++) {
				const item = items[i].getAsString((url) => {
					if (url) {
						// Handle the URL (e.g., save the link)
						console.log('Link dropped:', item);
					}
				});
			}
		}
	};

	useEffect(() => {
		document.addEventListener('dragenter', handleDragEnter);
		document.addEventListener('dragleave', handleDragLeave);
		document.addEventListener('drop', handleDrop);

		return () => {
			document.removeEventListener('dragenter', handleDragEnter);
			document.removeEventListener('dragleave', handleDragLeave);
			document.removeEventListener('drop', handleDrop);
		};
	}, []);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	return (
		<div
			className='fixed bottom-1 right-1 z-50 image-drop'
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onDragOver={(e) => e.preventDefault()}
		>
			{isDragging ? (
				<div className='rounded-full w-10 h-10 flex items-center justify-center bg-popover'>
					<PlusCircle className='w-full h-full text-yellow-500' />
				</div>
			) : isHovered ? (
				<Card>
					<CardHeader>
						<div className='flex flex-col items-center gap-2'>
							<p>
								Drag & Drop Images onto the plus to save it in
								Linklib
							</p>
							<Button>Upload Image</Button>
						</div>
					</CardHeader>
				</Card>
			) : (
				<div className='rounded-full w-10 h-10 flex items-center justify-center bg-popover'>
					<PlusCircle className='w-full h-full text-white' />
				</div>
			)}
		</div>
	);
};

export default ImageDrop;
