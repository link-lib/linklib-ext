import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import NotesModal from '@/scripts/highlighter/components/NotesModal';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { useEffect, useState } from 'react';

export const Highlight = ({
	children,
	highlightData,
	setHighlightData,
	notesOpen = false,
	highlightElement,
	initialRating = 0,
}: {
	children: React.ReactNode;
	highlightData: HighlightData;
	setHighlightData: (highlightData: HighlightData) => void;
	notesOpen?: boolean;
	highlightElement: HTMLElement | null;
	initialRating?: number;
}) => {
	const [note, setNote] = useState<string>('');
	const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(notesOpen);
	const [rating, setRating] = useState<number>(initialRating);

	useEffect(() => {
		if (note !== highlightData.note) {
			if (!isPopoverOpen) {
				setHighlightData({ ...highlightData, note });
			} else {
				setNote(highlightData.note);
			}
		}
	}, [isPopoverOpen, highlightData]);

	const handleMouseEnter = () => {
		const elements = document.querySelectorAll(
			`[highlight-id="highlight-${highlightData.uuid}"]`
		);
		elements.forEach((el) => {
			(el as HTMLElement).classList.add('bg-yellow-200');
			(el as HTMLElement).classList.remove('bg-yellow-400');
		});
	};

	const handleMouseLeave = () => {
		const elements = document.querySelectorAll(
			`[highlight-id="highlight-${highlightData.uuid}"]`
		);
		elements.forEach((el) => {
			(el as HTMLElement).classList.add('bg-yellow-400');
			(el as HTMLElement).classList.remove('bg-yellow-200');
		});
	};

	return (
		<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
			<PopoverTrigger asChild>
				<span
					highlight-id={`highlight-${highlightData.uuid}`}
					className='bg-yellow-400 cursor-pointer '
					style={{}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsPopoverOpen(true);
					}}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
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
