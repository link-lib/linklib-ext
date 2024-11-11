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
import { Reaction } from '@/utils/supabase/typeAliases';
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
	// setHighlightData,
	notesOpen = false,
	onDelete,
}: {
	highlightData: HighlightData;
	setHighlightData: (highlightData: HighlightData) => void;
	notesOpen?: boolean;
	onDelete: () => void;
}) => {
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

	const handleModalClose = async () => {
		try {
			// Save all modified notes when modal closes
			await Promise.all(
				highlightData.notes.map((note) =>
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

	const renderReactionsBadge = (reactions: Reaction[]) => {
		if (reactions.length === 0) return null;

		const reaction = reactions[0];

		return (
			<div className='absolute -top-4 -right-4 flex gap-1 rounded-full px-2 py-0.5'>
				<span className='flex items-center gap-0.5 text-2xl'>
					<span>{reaction.emoji}</span>
				</span>
			</div>
		);
	};

	return (
		<>
			{highlightContainers.map(({ container, content }, index) =>
				createPortal(
					<Popover
						key={index}
						open={true}
						onOpenChange={(open) => {
							if (!open) {
								handleModalClose();
							}
							setIsPopoverOpen(open);
						}}
					>
						<PopoverTrigger asChild>
							<span
								highlight-id={`highlight-${highlightData.uuid}`}
								className='relative bg-yellow-400 cursor-pointer bytebelli-highlight'
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									setIsPopoverOpen(true);
								}}
								onMouseEnter={handleMouseEnter}
								onMouseLeave={handleMouseLeave}
							>
								{index === 0 && renderReactionsBadge(reactions)}
								{Array.from(content.childNodes).map((node, i) =>
									nodeToReact(node, i)
								)}
							</span>
						</PopoverTrigger>
						{index === 0 && (
							<>
								<NotesModal
									initialNotes={highlightData.notes || []}
									highlightId={highlightData.uuid} // Add this line
									onClose={() => setIsPopoverOpen(false)}
									isPopoverOpened={isPopoverOpen}
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
							</>
						)}
					</Popover>,
					container
				)
			)}
		</>
	);
};
