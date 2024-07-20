import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import useStateCallback from '@/lib/hooks/useStateCallback';
import NotesModal from '@/scripts/highlighter/components/NotesModal';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { useEffect, useState } from 'react';

export const Highlight = ({
	children,
	highlightData,
	setHighlightData,
	notesOpen = false,
	highlightElement,
	onDelete,
}: {
	children: React.ReactNode;
	highlightData: HighlightData;
	setHighlightData: (highlightData: HighlightData) => void;
	notesOpen?: boolean;
	highlightElement: HTMLElement | null;
	onDelete: () => void;
}) => {
	const [note, setNote] = useState<string>(highlightData.note);
	const [isPopoverOpen, setIsPopoverOpen] =
		useStateCallback<boolean>(notesOpen);
	const [rating, setRating] = useState<number>(highlightData.rating);

	useEffect(() => {
		const highlightContainer = document.createElement('span');
		// highlightContainer.className = 'highlight';
		// highlightContainer.dataset.highlightId = `highlight-${highlightData.uuid}`;
		// highlightContainer.innerHTML = range.toString(); // Set the innerHTML directly
		range.deleteContents(); // Remove the original contents of the range
		range.insertNode(highlightContainer); // Insert the new element with the correct HTML
	}, []);


	useEffect(() => {
		if (note !== highlightData.note) {
			if (!isPopoverOpen) {
				setHighlightData({ ...highlightData, note });
			} else {
				setNote(highlightData.note);
			}
		}
	}, [isPopoverOpen]);

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

	// const handleDelete = () => {
	// 	setIsPopoverOpen(false, () => {
	// 		debugger;
	// 		onDelete();
	// 	});
	// };

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
					onClose={() => {
						setIsPopoverOpen(false);
					}}
					highlightElement={highlightElement}
					rating={rating}
					setRating={setRating}
				/>
			</PopoverContent>
		</Popover>
	);
};
