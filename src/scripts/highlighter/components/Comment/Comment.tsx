import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import ThreadContainer from '@/scripts/highlighter/components/Comment/ThreadContainer';
import React, { useRef } from 'react';

interface CommentProps {
	uuid: string;
	note: string;
}

const Comment: React.FC<CommentProps> = ({ note }) => {
	return (
		<ThreadContainer>
			<Card className='bg-popover'>
				<CardHeader>
					<CardDescription>{note}</CardDescription>
				</CardHeader>
			</Card>
		</ThreadContainer>
	);
};

export default Comment;
