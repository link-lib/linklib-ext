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

// What if we had one highlight per highlightData, but it rendered multiple portals and just calculatde the containers on render? I think that would work.

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
			debugger;
			const container = document.createElement('span');
			range.setStart(range.startContainer, rangeData.startOffset);
			range.setEnd(range.endContainer, rangeData.endOffset);
			// const content = range.toString();

			// Store the parent node and its original content before any changes
			const parentNode =
				range.commonAncestorContainer.nodeType === Node.TEXT_NODE
					? range.commonAncestorContainer.parentNode
					: range.commonAncestorContainer;
			// const originalContent = parentNode?.textContent;
			const startingContainerContent = range.startContainer.textContent;

			const content = range.extractContents();
			range.insertNode(container);
			const prefix = range.startContainer.textContent;

			setHighlightContainer({ container, content });

			return () => {
				debugger;
				if (parentNode) {
					if (container.parentNode) {
						container.parentNode.removeChild(container);
					}

					if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
						range.startContainer.appendChild(content);
					} else {
						const textNode = document.createTextNode(
							startingContainerContent || ''
						);
						range.startContainer.parentNode?.replaceChild(
							textNode,
							range.startContainer
						);
						range.setStart(textNode, rangeData.startOffset);
						range.setEnd(textNode, rangeData.endOffset);
						range.insertNode(content);
					}

					parentNode.normalize();
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
