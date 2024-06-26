import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ImageDrop = () => {
	const [isDragging, setIsDragging] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

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
			console.log('is a file');
			const dT = new DataTransfer();
			dT.items.add(e.dataTransfer.files[0]);
			// Backend: Upload file to linklib
			// This is to put it into an input
			// fileInput.files = dT.files;
			// debugger;
		} else {
			// Try dataTransfer url second
			const dataTransferUrl = e.dataTransfer?.getData('url');
			if (dataTransferUrl) {
				console.log('is a url');
				console.log(dataTransferUrl);

				// debugger;

				// Backend: Save link to linklib
				// This may be more complicated, because the URL domain might have to
				// If we need to fetch the image.
				// const urlArray = Array.from(url);
				// urlArray.splice(4, 0, 's');
				// const urlFinal = urlArray.join('');
				// fetch(dataTransferUrl)
				// 	.then(async (res) => {
				// 		const contentType = await res.headers.get(
				// 			'Content-Type'
				// 		);
				// 		const blob = await response.blob();
				// 		debugger;
				// 		const file = new File([blob], 'image.jpeg', {
				// 			contentType,
				// 		});
				// 	})
				// 	.catch((e) => {
				// 		console.log(e);
				// 		debugger;
				// 	});
			}
		}
	};

	useEffect(() => {
		window.addEventListener('dragenter', handleDragEnter, false);
		window.addEventListener('dragleave', handleDragLeave, false);
		window.addEventListener('drop', handleDrop, false);

		return () => {
			window.removeEventListener('dragenter', handleDragEnter);
			window.removeEventListener('dragleave', handleDragLeave);
			window.removeEventListener('drop', handleDrop);
		};
	}, []);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			console.log('Selected file:', file);
			// Handle the file upload to the backend here
		}
	};

	return (
		<div
			id='dropContainer'
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
							<Button onClick={handleButtonClick}>
								Upload Image
							</Button>
							<input
								type='file'
								accept='image/*'
								ref={fileInputRef}
								style={{ display: 'none' }}
								onChange={handleFileChange}
							/>
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
