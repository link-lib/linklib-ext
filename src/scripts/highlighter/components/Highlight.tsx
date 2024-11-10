import { updateNote } from '@/backend/notes/updateNote';
import { createReaction } from '@/backend/reactions/createReaction';
import { deleteReaction } from '@/backend/reactions/deleteReaction';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import useStateCallback from '@/lib/hooks/useStateCallback';
import { NotesModal } from '@/scripts/highlighter/components/NotesModal';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import {
	createElementFallbackOrder,
	createHighlight,
} from '@/scripts/highlighter/utils/createHighlight/createHighlight';
import { Note, Reaction } from '@/utils/supabase/typeAliases';
import { isEqual } from 'lodash';
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
	const [notes, setNotes] = useState<Note[]>(highlightData.notes || []);
	const [isPopoverOpen, setIsPopoverOpen] = useStateCallback(notesOpen);
	const [rating, setRating] = useState(highlightData.rating);
	const [highlightContainers, setHighlightContainers] = useState<
		HighlightContainer[]
	>([]);
	const [shouldFocusInput, setShouldFocusInput] = useState(notesOpen);
	const [reactions, setReactions] = useState<Reaction[]>(
		highlightData.reactions || []
	);

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
					container.className = `linklib-ext highlight-${strategy}`;
					// container.textContent = 'heehee';
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
		if (!isEqual(notes, highlightData.notes) && !isPopoverOpen) {
			setHighlightData({ ...highlightData, notes });
		}
	}, [isPopoverOpen, notes, highlightData, setHighlightData]);

	const handleNoteChange = (noteId: number, newValue: string) => {
		const updatedNotes = notes.map((note) =>
			note.id === noteId ? { ...note, value: newValue } : note
		);
		setNotes(updatedNotes);
		// save note
	};

	const handleModalClose = async () => {
		try {
			// Save all modified notes when modal closes
			await Promise.all(
				notes.map((note) =>
					updateNote({
						noteId: note.id,
						noteValue: note.value || '',
					})
				)
			);
		} catch (error) {
			console.error('Failed to update notes:', error);
		}
	};

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

	const handleAddReaction = async (emoji: string) => {
		try {
			const newReaction: Reaction = await createReaction({
				emoji,
				itemId: highlightData.uuid,
			});
			setReactions([...reactions, newReaction]);
		} catch (error) {
			console.error('Failed to add reaction:', error);
			// Optionally add toast notification here
		}
	};

	const handleDeleteReaction = async (reactionId: string) => {
		try {
			await deleteReaction({ reactionId });
			setReactions(
				reactions.filter((reaction) => reaction.id !== reactionId)
			);
		} catch (error) {
			console.error('Failed to delete reaction:', error);
		}
	};

	console.log('notes');
	console.log(highlightData.notes);

	return (
		<>
			{/* {highlightContainers[0] &&
				// highlightData.note &&
				createPortal(
					<div className='relative inline'>
						<Comment uuid={highlightData.uuid} note={'hiihi'} />
					</div>,
					highlightContainers[0].container
				)} */}
			{highlightContainers.map(({ container, content }, index) =>
				createPortal(
					<Popover
						key={index}
						open={true}
						onOpenChange={(open) => {
							if (!open) {
								// When popover is closing
								handleModalClose();
							}
							setIsPopoverOpen(open);
						}}
					>
						<PopoverTrigger asChild>
							<span
								highlight-id={`highlight-${highlightData.uuid}`}
								className='bg-yellow-400 cursor-pointer bytebelli-highlight'
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
							<>
								<NotesModal
									notes={notes}
									setNotes={setNotes}
									onNoteChange={handleNoteChange}
									onClose={() => setIsPopoverOpen(false)}
									isPopoverOpen={isPopoverOpen}
									rating={rating}
									setRating={setRating}
									onDelete={onDelete}
									shouldFocusInput={shouldFocusInput}
									onInputFocused={() =>
										setShouldFocusInput(false)
									}
									reactions={reactions}
									onAddReaction={handleAddReaction}
									onDeleteReaction={handleDeleteReaction}
								/>
								{/* // Use this when there's not enough space to render it on the side.
									// <PopoverContent className='w-[550px]'>
									// <NotesModal
									// 	notes={notes}
									// 	setNotes={setNotes}
									// 	onNoteChange={handleNoteChange}
									// 	onClose={() =>
									// 		setIsPopoverOpen(false)
									// 	}
									// 	rating={rating}
									// 	setRating={setRating}
									// 	onDelete={onDelete}
									// 	shouldFocusInput={shouldFocusInput}
									// 	onInputFocused={() =>
									// 		setShouldFocusInput(false)
									// 	}
									// 	reactions={reactions}
									// 	onAddReaction={handleAddReaction}
									// 	onDeleteReaction={
									// 		handleDeleteReaction
									// 	}
									// />
									// </PopoverContent> */}
							</>
						)}
					</Popover>,
					container
				)
			)}
		</>
	);
};
