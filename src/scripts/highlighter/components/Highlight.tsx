import { withAuth } from '@/backend/auth/withAuth';
import { updateNote } from '@/backend/notes/updateNote';
import { createReaction } from '@/backend/reactions/createReaction';
import { deleteReaction } from '@/backend/reactions/deleteReaction';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import useStateCallback from '@/lib/hooks/useStateCallback';
import { AuthContext } from '@/scripts/auth/context/AuthModalContext';
import { NotesModal } from '@/scripts/highlighter/components/NotesModal';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import {
	createElementFallbackOrder,
	createHighlight,
} from '@/scripts/highlighter/utils/createHighlight/createHighlight';
import { Reaction } from '@/utils/supabase/typeAliases';
import React, { useContext, useEffect, useState } from 'react';
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

interface HighlightProps {
	highlightData: HighlightData;
	setHighlightData: (highlightData: HighlightData) => void;
	notesOpen?: boolean;
	onDelete: () => void;
	highlightColor?: string; // Add this prop
}

export const Highlight = ({
	highlightData,
	// setHighlightData,
	notesOpen = false,
	onDelete,
	highlightColor = 'bg-yellow-400', // Default color
}: HighlightProps) => {
	const [isPopoverOpen, setIsPopoverOpen] = useStateCallback(notesOpen);
	const [rating, setRating] = useState(highlightData.rating);
	const [highlightContainers, setHighlightContainers] = useState<
		HighlightContainer[]
	>([]);
	const [reactions, setReactions] = useState<Reaction[]>(
		highlightData.reactions || []
	);
	const authModalContext = useContext(AuthContext);
	const [userAuthenticated, setUserAuthenticated] = useState(false);

	const authContext = useContext(AuthContext);

	// wrapped version of setIsPopoverOpen
	const setIsPopoverOpenAuth = (open: boolean, callback?: () => void) => {
		withAuth(() => {
			setIsPopoverOpen(open, callback);
		}, authContext)();
	};

	useEffect(() => {
		setReactions(highlightData.reactions || []);
	}, [highlightData.reactions]);

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

	// Add auth check effect
	useEffect(() => {
		const checkAuthStatus = async () => {
			const authStatus = authModalContext.session;
			setUserAuthenticated(!!authStatus);
		};

		checkAuthStatus();
	}, [authModalContext.session]);

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

	const getHoverColor = (baseColor: string) => {
		return baseColor.replace(/-(300|400|500)/, '-200');
	};

	const handleMouseEnter = () => {
		const elements = document.querySelectorAll(
			`[highlight-id="highlight-${highlightData.uuid}"]`
		);
		elements.forEach((el) => {
			(el as HTMLElement).classList.add(getHoverColor(highlightColor));
			(el as HTMLElement).classList.remove(highlightColor);
		});
	};

	const handleMouseLeave = () => {
		const elements = document.querySelectorAll(
			`[highlight-id="highlight-${highlightData.uuid}"]`
		);
		elements.forEach((el) => {
			(el as HTMLElement).classList.add(highlightColor);
			(el as HTMLElement).classList.remove(getHoverColor(highlightColor));
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
			<div className='absolute -top-4 -right-4 flex gap-1 rounded-full px-2 py-0.5 text-2xl'>
				{reaction.emoji}
			</div>
		);
	};

	const handleHighlightClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!userAuthenticated) {
			authModalContext?.setIsOpen(true);
			return;
		}

		setIsPopoverOpen(true);
	};

	return (
		<>
			{highlightContainers.map(({ container, content }, index) =>
				createPortal(
					<Popover
						key={index}
						open={isPopoverOpen}
						onOpenChange={(open) => {
							if (!open) {
								handleModalClose();
							}
							setIsPopoverOpenAuth(open);
						}}
					>
						{index === 0 && (
							<>
								<NotesModal
									initialNotes={highlightData.notes || []}
									highlight={highlightData}
									onClose={() => setIsPopoverOpenAuth(false)}
									isPopoverOpen={isPopoverOpen}
									setIsPopoverOpen={setIsPopoverOpenAuth}
									rating={rating}
									setRating={setRating}
									onDelete={onDelete}
									reactions={reactions}
									onAddReaction={handleAddReaction}
									onDeleteReaction={handleDeleteReaction}
								/>
								{/* <div className='bg-popover text-slate-400 ll-gap-3 gap-2 w-fit justify-center items-center flex flex-row rounded-md border p-2 text-sm z-infinite '>
									<RatingsBar onRate={() => {}} />
									<button
										className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
										onClick={() => {}}
									>
										<X className='w-full h-full' />
									</button>
								</div> */}
							</>
						)}
						<PopoverTrigger asChild>
							<>
								<span
									highlight-id={`highlight-${highlightData.uuid}`}
									className={`relative cursor-pointer bytebelli-highlight text-black ${highlightColor}`}
									onClick={handleHighlightClick}
									onMouseEnter={handleMouseEnter}
									onMouseLeave={handleMouseLeave}
								>
									{Array.from(content.childNodes).map(
										(node, i) => nodeToReact(node, i)
									)}
								</span>
								<span className='relative'>
									{index === highlightContainers.length - 1 &&
										renderReactionsBadge(reactions)}
								</span>
							</>
						</PopoverTrigger>
					</Popover>,
					container
				)
			)}
		</>
	);
};
