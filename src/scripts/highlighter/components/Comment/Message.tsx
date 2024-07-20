import React from 'react';

import { cn } from '@/lib/utils';

interface MessageProps {
	text: string;
	timestamp?: string;
	user: number;
	className?: string;
}

const userColour = [
	'bg-blue-500',
	'bg-gray-500',
	'bg-green-500',
	'bg-yellow-500',
	'bg-purple-500',
	'bg-pink-500',
];
const Message: React.FC<MessageProps> = ({
	text,
	timestamp,
	user,
	className,
}) => {
	return (
		<div
			className={cn('flex', user === 0 ? 'justify-end' : 'justify-start')}
		>
			<div
				className={cn(
					'text-sm font-apple max-w-[90%] text-white py-1 px-3 rounded-[20px]',
					userColour[user],
					className
				)}
			>
				<p>{text}</p>
			</div>
		</div>
	);
};

export default Message;
