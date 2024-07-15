import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import NotesModal from '@/scripts/highlighter/components/NotesModal';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { useState } from 'react';

export const Highlight = ({
	children,
	highlightData,
	setHighlightData,
	notesOpen = false,
	highlightElement,
	initialRating = 0,
	highlightId,
}: {
	children: React.ReactNode;
	highlightData: HighlightData;
	setHighlightData: (highlightData: HighlightData) => void;
	notesOpen?: boolean;
	highlightElement: HTMLElement | null;
	initialRating?: number;
	highlightId: string;
}) => {
	const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(notesOpen);
	const [rating, setRating] = useState<number>(initialRating);

	const handleMouseEnter = () => {
		const elements = document.querySelectorAll(
			`[highlight-id="highlight-${highlightId}"]`
		);
		elements.forEach((el) => {
			(el as HTMLElement).classList.add('bg-yellow-200');
			(el as HTMLElement).classList.remove('bg-yellow-400');
		});
	};

	const handleMouseLeave = () => {
		const elements = document.querySelectorAll(
			`[highlight-id="highlight-${highlightId}"]`
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
					highlight-id={`highlight-${highlightId}`}
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
					note={highlightData.note}
					setNote={(note) =>
						setHighlightData({ ...highlightData, note })
					}
					onClose={() => setIsPopoverOpen(false)}
					highlightElement={highlightElement}
					rating={rating}
					setRating={setRating}
				/>
			</PopoverContent>
		</Popover>
	);
};
