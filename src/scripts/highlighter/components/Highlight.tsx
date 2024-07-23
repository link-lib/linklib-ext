import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import useStateCallback from '@/lib/hooks/useStateCallback';
import NotesModal from '@/scripts/highlighter/components/NotesModal';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const Highlight = ({
	rangeData,
	range,
	highlightData,
	setHighlightData,
	notesOpen = false,
	onDelete,
}: {
	rangeData: {
		startContainer: Node;
		startOffset: number;
		endContainer: Node;
		endOffset: number;
	};
	range: Range;
	highlightData: HighlightData;
	setHighlightData: (highlightData: HighlightData) => void;
	notesOpen?: boolean;
	onDelete: () => void;
}) => {
	const [note, setNote] = useState<string>(highlightData.note);
	const [isPopoverOpen, setIsPopoverOpen] =
		useStateCallback<boolean>(notesOpen);
	const [rating, setRating] = useState<number>(highlightData.rating);
	const [highlightContainer, setHighlightContainer] = useState<{
		container: HTMLElement;
		content: string;
	} | null>(null);
	const [shouldFocusInput, setShouldFocusInput] = useState(notesOpen);

	useEffect(() => {
		if (notesOpen) {
			setIsPopoverOpen(true, () => {
				setShouldFocusInput(true);
			});
		}
	}, [notesOpen]);

	useEffect(() => {
		try {
			const container = document.createElement('span');
			range.setStart(rangeData.startContainer, rangeData.startOffset);
			range.setEnd(rangeData.endContainer, rangeData.endOffset);
			const content = range.toString();

			// Store the parent node and its original content before any changes
			const parentNode =
				range.commonAncestorContainer.nodeType === Node.TEXT_NODE
					? range.commonAncestorContainer.parentNode
					: range.commonAncestorContainer;
			// const originalContent = parentNode?.textContent;
			const startingContainerContent = range.startContainer.textContent;

			range.deleteContents();
			range.insertNode(container);
			const prefix = range.startContainer.textContent;

			setHighlightContainer({ container, content });

			return () => {
				if (parentNode) {
					if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
						range.startContainer.textContent =
							startingContainerContent;
						parentNode.normalize();
					} else {
						range.startContainer.textContent = prefix + content;
						parentNode.removeChild(container);
						parentNode.normalize();
					}
				}
			};
		} catch {
			console.log('uhoh ');
		}
	}, [range, highlightData.uuid]);

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

	if (!highlightContainer) return null;

	return createPortal(
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
					{highlightContainer.content}
				</span>
			</PopoverTrigger>
			<PopoverContent className='w-[550px]'>
				<NotesModal
					note={note}
					setNote={setNote}
					onClose={() => {
						setIsPopoverOpen(false);
					}}
					rating={rating}
					setRating={setRating}
					onDelete={onDelete}
					shouldFocusInput={shouldFocusInput}
					onInputFocused={() => setShouldFocusInput(false)}
				/>
			</PopoverContent>
		</Popover>,
		highlightContainer.container
	);
};
