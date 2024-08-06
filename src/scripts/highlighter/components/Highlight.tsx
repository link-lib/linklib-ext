import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import useStateCallback from '@/lib/hooks/useStateCallback';
import NotesModal from '@/scripts/highlighter/components/NotesModal';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import {
	createElementFallbackOrder,
	createHighlight,
} from '@/scripts/highlighter/utils/createHighlight/createHighlight';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type HighlightContainer = {
	container: HTMLElement;
	content: DocumentFragment;
};

// Add this function outside of your component
function nodeToReact(node: Node, index: number): React.ReactNode {
	if (node.nodeType === Node.TEXT_NODE) {
		return node.textContent;
	} else if (node.nodeType === Node.ELEMENT_NODE) {
		const element = node as Element;
		return React.createElement(
			element.tagName.toLowerCase(),
			{
				key: index,
				...Array.from(element.attributes).reduce(
					(acc, attr) => ({ ...acc, [attr.name]: attr.value }),
					{}
				),
			},
			Array.from(element.childNodes).map((child, i) =>
				nodeToReact(child, i)
			)
		);
	}
	return null;
}

export const Highlight = ({
	highlightData,
	setHighlightData,
	notesOpen = false,
	onDelete,
}: {
	highlightData: HighlightData;
	setHighlightData: (highlightData: HighlightData) => void;
	notesOpen?: boolean;
	onDelete: () => void;
}) => {
	const [note, setNote] = useState(highlightData.note);
	const [isPopoverOpen, setIsPopoverOpen] = useStateCallback(notesOpen);
	const [rating, setRating] = useState(highlightData.rating);
	const [highlightContainers, setHighlightContainers] = useState<
		HighlightContainer[]
	>([]);
	const [shouldFocusInput, setShouldFocusInput] = useState(notesOpen);

	useEffect(() => {
		for (const strategy of createElementFallbackOrder) {
			let ranges: Range[] = [];
			try {
				ranges =
					createHighlight[strategy as keyof typeof createHighlight](
						highlightData
					);

				const validRanges = ranges.filter(
					(range) =>
						range.startContainer.nodeType === Node.TEXT_NODE &&
						range.endContainer.nodeType === Node.TEXT_NODE
				);

				if (
					validRanges.length < ranges.length ||
					validRanges.length === 0 ||
					validRanges.length > 100
				) {
					continue;
				}

				const containers = ranges.map((range) => {
					const container = document.createElement('span');
					container.className = 'linklib-ext';
					const content = range.extractContents();
					range.startContainer.parentNode?.normalize();
					range.insertNode(container);
					container.parentNode?.normalize();
					return { container, content };
				});

				setHighlightContainers(containers);

				return () => {
					containers.forEach(({ container, content }) => {
						const parentNode = container.parentNode;
						if (parentNode) {
							parentNode.replaceChild(content, container);
							parentNode?.normalize();
						}
					});
				};
			} catch (e) {
				console.error(`Error with ${strategy} strategy:`, e);
			}
		}
	}, [highlightData.matching]);

	useEffect(() => {
		if (notesOpen) {
			setIsPopoverOpen(true, () => {
				setShouldFocusInput(true);
			});
		}
	}, [notesOpen, setIsPopoverOpen]);

	useEffect(() => {
		if (note !== highlightData.note && !isPopoverOpen) {
			setHighlightData({ ...highlightData, note });
		}
	}, [isPopoverOpen, note, highlightData, setHighlightData]);

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
		<>
			{highlightContainers.map(({ container, content }, index) =>
				createPortal(
					<Popover
						key={index}
						open={isPopoverOpen}
						onOpenChange={setIsPopoverOpen}
					>
						<PopoverTrigger asChild>
							<span
								highlight-id={`highlight-${highlightData.uuid}`}
								className='bg-yellow-400 cursor-pointer'
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									setIsPopoverOpen(true);
								}}
								onMouseEnter={handleMouseEnter}
								onMouseLeave={handleMouseLeave}
							>
								{Array.from(content.childNodes).map((node, i) =>
									nodeToReact(node, i)
								)}
							</span>
						</PopoverTrigger>
						{index === 0 && (
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
									onInputFocused={() =>
										setShouldFocusInput(false)
									}
								/>
							</PopoverContent>
						)}
					</Popover>,
					container
				)
			)}
		</>
	);
};
