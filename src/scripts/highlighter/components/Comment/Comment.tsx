import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import React, { useEffect, useRef, useState } from 'react';

interface CommentProps {
	uuid: string;
	note: string;
}

const Comment: React.FC<CommentProps> = ({ uuid, note }) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const [noteOffset, setOffset] = useState(0);

	useEffect(() => {
		const adjustPosition = () => {
			if (cardRef.current) {
				const card = cardRef.current;
				const windowWidth = window.innerWidth;
				const cardRect = card.getBoundingClientRect();

				const offset = windowWidth - 50 - cardRect.right;
				setOffset(offset);
				// card.style.left = `${offset}px`;
				// card.style.transform = 'none'; // Remove the transform
			}
		};

		adjustPosition();

		window.addEventListener('resize', adjustPosition);
		return () => window.removeEventListener('resize', adjustPosition);
	}, []);

	return (
		<div
			ref={cardRef}
			key={uuid}
			className='absolute top-0 w-72' // Removed -right-5 since we're using absolute positioning
			style={{ left: `${noteOffset}px` }}
		>
			<Card>
				<CardHeader>
					<CardDescription>{note}</CardDescription>
				</CardHeader>
			</Card>
		</div>
	);
};

export default Comment;
