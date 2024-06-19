import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import NotesModal from '@/scripts/highlighter/components/NotesModal';
import { useState } from 'react';

export const Highlight = ({
	children,
	notesOpen = false,
	highlightElement,
	initialRating = 0,
}: {
	children: React.ReactNode;
	notesOpen?: boolean;
	highlightElement: HTMLElement | null;
	initialRating?: number;
}) => {
	const [note, setNote] = useState<string>('');
	const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(notesOpen);
	const [rating, setRating] = useState<number>(initialRating);

	return (
		<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
			<PopoverTrigger asChild>
				<span
					className='bg-yellow-400 cursor-pointer hover:bg-yellow-300'
					style={{}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsPopoverOpen(true);
					}}
				>
					{children}
				</span>
			</PopoverTrigger>
			<PopoverContent className='w-[550px]'>
				<NotesModal
					note={note}
					setNote={setNote}
					onClose={() => setIsPopoverOpen(false)}
					highlightElement={highlightElement}
					rating={rating}
					setRating={setRating}
				/>
			</PopoverContent>
		</Popover>
	);
};