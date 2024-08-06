import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import React from 'react';

interface CommentProps {
	uuid: string;
	note: string;
	top: number;
}

const Comment: React.FC<CommentProps> = ({ uuid, note, top }) => {
	return (
		<div
			key={uuid}
			className='bb-absolute bb-right-5 bb-w-72'
			style={{ top: `${top}px` }}
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
