import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const ImageDrop = () => {
	const [isDragging, setIsDragging] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const handleDragEnter = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		console.log('enter');
		setIsDragging(true);
	};

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		console.log('leave');
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

		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			const file = files[0];
			// Handle the file (e.g., upload or display the image)
			console.log(file);
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
						<CardDescription>
							<div className='flex flex-col items-center gap-2'>
								<div>Drag & Drop Images here</div>
								<Button>Upload Image</Button>
							</div>
						</CardDescription>
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
