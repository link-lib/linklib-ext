import { createNote } from '@/backend/notes/createNote';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AuthContext } from '@/scripts/auth/context/AuthModalContext';
import Comment, {
	VoiceComment,
} from '@/scripts/highlighter/components/Comment/Comment';
import ThreadContainer from '@/scripts/highlighter/components/Comment/ThreadContainer';
// import { StarRating } from '@/scripts/highlighter/components/Stars';
import { deleteNote } from '@/backend/notes/deleteNote';
import { updateNote } from '@/backend/notes/updateNote';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { NoteWithUserMeta, Reaction } from '@/utils/supabase/typeAliases';
import { SmilePlus, Trash2, X } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { HighlightData } from '../types/HighlightData';
import { EmojiPicker } from './Reactions/EmojiPicker';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

type NotesModalProps = {
	initialNotes: NoteWithUserMeta[];
	reactions: Reaction[];
	onAddReaction: (emoji: string) => Promise<void>;
	onDeleteReaction: (reactionId: string) => Promise<void>;
	onClose: () => void;
	rating: number;
	setRating: (rating: number) => void;
	onDelete: () => void;
	isPopoverOpen: boolean;
	setIsPopoverOpen: (popover: boolean) => void;
	highlight: HighlightData;
};

export const NotesModal = ({
	initialNotes,
	onClose,
	// rating,
	// setRating,
	onDelete,
	reactions,
	onAddReaction,
	onDeleteReaction,
	isPopoverOpen,
	setIsPopoverOpen,
	highlight,
}: NotesModalProps) => {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);
	const { user } = useContext(AuthContext);
	const [notes, setNotes] = useState<NoteWithUserMeta[]>(initialNotes);
	const [newNote, setNewNote] = useState('');
	const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
	const [manuallyClosed, setManuallyClosed] = useState(true);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	// Reset manuallyClosed when popover is opened
	useEffect(() => {
		if (isPopoverOpen) {
			setManuallyClosed(false);
		}
	}, [isPopoverOpen]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const emojiPicker = document.querySelector('.emoji-picker');
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node) &&
				(!emojiPicker || !emojiPicker.contains(event.target as Node))
			) {
				onClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [onClose]);

	// If manually closed and has notes, show the circular button
	if (manuallyClosed && notes.length > 0) {
		return (
			<ThreadContainer ref={modalRef}>
				<div className='relative pr-3'>
					<button
						onClick={() => {
							setManuallyClosed(false);
							setIsPopoverOpen(true);
						}}
						className='	relative -translate-x-full rounded-full bg-popover hover:bg-popover/90 transition-colors group text-primary group-hover:text-primary/90 '
					>
						<Avatar className='w-8 h-8 hover:opacity-90 transition-opacity'>
							<AvatarImage src={notes[0]?.user_meta?.picture} />
							<AvatarFallback>
								{notes[0]?.user_meta?.name?.substring(0, 2) ||
									'U'}
							</AvatarFallback>
						</Avatar>
						<span className='absolute -top-2 -right-2 bg-popover text-xs rounded-full w-5 h-5 flex items-center justify-center transition-colors group-hover:bg-popover/90'>
							{notes.length}
						</span>
					</button>
				</div>
				<div className='w-72'></div>
			</ThreadContainer>
		);
	}

	// If popover is closed and there are no notes, don't render anything
	if (manuallyClosed || (!isPopoverOpen && notes.length === 0)) {
		return null;
	}

	const handleClose = () => {
		setManuallyClosed(true);
		onClose();
	};

	const handleDelete = () => {
		if (notes.length > 0) {
			setShowDeleteDialog(true);
		} else {
			onClose();
			onDelete();
		}
	};

	const handleConfirmDelete = () => {
		setShowDeleteDialog(false);
		onClose();
		onDelete();
	};

	// Group reactions by emoji and track user ownership
	const groupedReactions = reactions.reduce((acc, reaction) => {
		if (!acc[reaction.emoji]) {
			acc[reaction.emoji] = {
				count: 0,
				userReactionId: null,
			};
		}
		acc[reaction.emoji].count++;

		if (reaction.user_id === user?.id) {
			acc[reaction.emoji].userReactionId = reaction.id;
		}

		return acc;
	}, {} as Record<string, { count: number; userReactionId: string | null }>);

	const handleReactionClick = async (emoji: string) => {
		const reactionInfo = groupedReactions[emoji];
		if (reactionInfo?.userReactionId) {
			// User has already reacted - delete the reaction
			await onDeleteReaction(reactionInfo.userReactionId);
		} else {
			// User hasn't reacted - add new reaction
			await onAddReaction(emoji);
		}
	};

	const handleAddNote = async () => {
		if (!newNote.trim()) return;

		try {
			await createNote({
				noteValue: newNote,
				itemId: highlight.uuid,
			});

			// Optimistically update the local state
			const optimisticNote: NoteWithUserMeta = {
				id: Date.now(), // temporary ID
				value: newNote,
				user_id: user?.id,
				item_id: highlight.uuid,
				created_at: new Date().toISOString(),
				user_meta: {
					name: user?.user_metadata?.name,
					picture: user?.user_metadata?.picture,
				},
			};

			setNotes([...notes, optimisticNote]);
			setNewNote(''); // Clear the input
		} catch (error) {
			console.error('Failed to create note:', error);
			// Optionally add error handling UI here
		}
	};

	const handleEditNote = async (
		note: NoteWithUserMeta,
		editValue: string
	) => {
		try {
			await updateNote({
				noteId: note.id,
				noteValue: editValue,
			});
			setEditingNoteId(null);
			setNotes(
				notes.map((n) =>
					n.id === note.id ? { ...n, value: editValue } : n
				)
			);
		} catch (error) {
			console.error('Error updating note:', error);
			toast({ title: 'Error updating note' });
		}
	};

	const handleDeleteNote = async (note: NoteWithUserMeta) => {
		try {
			await deleteNote({ noteId: note.id });
			setNotes(notes.filter((n) => n.id !== note.id));
		} catch (error) {
			console.error('Error deleting note:', error);
			toast({ title: 'Error deleting note' });
		}
	};

	return (
		<ThreadContainer ref={modalRef}>
			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent className='z-infinite+1'>
					<DialogHeader>
						<DialogTitle>Delete Highlight</DialogTitle>
						<DialogDescription>
							This highlight has {notes.length}{' '}
							{notes.length === 1 ? 'note' : 'notes'}. Are you
							sure you want to delete it? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setShowDeleteDialog(false)}
						>
							Cancel
						</Button>
						<Button
							variant='destructive'
							onClick={handleConfirmDelete}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div
				className={` rounded-lg ml-3 w-72 p-3 border cursor-pointer hover:bg-popover-hover relative text-start
					${
						isPopoverOpen
							? 'border-2 shadow-xl z-infinite+1 bg-popover-hover'
							: 'z-infinite bg-popover'
					}`}
				onClick={() => setIsPopoverOpen(true)}
			>
				<div className=' flex gap-2 justify-between items-center flex-row pt-0 text-sm border-b border-lining p-2'>
					<div className='flex flex-row gap-1'>
						{Object.entries(groupedReactions).map(
							([emoji, { count, userReactionId }]) => (
								<button
									key={emoji}
									onClick={(e) => {
										e.stopPropagation();
										handleReactionClick(emoji);
									}}
									className={`flex items-center h-6 w-6 gap-1 justify-center text-sm rounded-full border border-muted-foreground transition-colors
							${userReactionId ? 'bg-gray-400 hover:bg-gray-500' : 'hover:bg-gray-50'}`}
								>
									<span>{emoji}</span>
									{count > 1 && (
										<span className='text-xs text-gray-600'>
											{count}
										</span>
									)}
								</button>
							)
						)}
						<EmojiPicker
							onEmojiSelect={onAddReaction}
							trigger={
								<button className='hover:text-white flex justify-center items-center hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
									<SmilePlus className='w-4 h-4' />
								</button>
							}
						/>
					</div>
					<div className='flex flex-row items-center text-muted-foreground'>
						{/* <StarRating onRating={setRating} initialRating={rating} /> */}
						{highlight.user_id === user.id && (
							<button
								className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
								onClick={(e) => {
									e.stopPropagation();
									handleDelete();
								}}
							>
								<Trash2 className='w-full h-full' />
							</button>
						)}
						<button
							className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
							onClick={(e) => {
								e.stopPropagation();
								handleClose();
							}}
						>
							<X className='w-full h-full' />
						</button>
					</div>
				</div>
				{/* Render all notes */}
				<div className='flex flex-col justify-start'>
					<VoiceComment highlightId={highlight.uuid} />
					{/* Show either all comments or just the first two */}
					{(isPopoverOpen ? notes : notes.slice(0, 2)).map((note) => (
						<Comment
							key={note.id}
							note={note}
							onDelete={handleDeleteNote}
							onEdit={handleEditNote}
							isEditing={editingNoteId === note.id}
							setIsEditing={(isEditing) =>
								setEditingNoteId(isEditing ? note.id : null)
							}
						/>
					))}

					{/* Show "show more" button if there are more than 2 comments */}
					{!isPopoverOpen && notes.length > 2 && (
						<Button
							variant='link'
							onClick={() => {}}
							className='p-3 w-fit text-sm text-muted-foreground hover:text-primary transition-colors mt-1'
						>
							Show {notes.length - 2} more{' '}
							{notes.length - 2 === 1 ? 'comment' : 'comments'}
						</Button>
					)}
				</div>

				{/* Comments */}
				{isPopoverOpen && (
					<>
						<Textarea
							ref={inputRef}
							autoFocus={true}
							onFocus={(e) => {
								const length = e.currentTarget.value.length;
								e.currentTarget.setSelectionRange(
									length,
									length
								);
							}}
							className='text-primary min-h-[60px] max-h-[200px] resize-none'
							placeholder='thoughts?'
							value={newNote}
							onChange={(e) => {
								setNewNote(e.target.value);
								// Auto-adjust height
								e.target.style.height = 'auto';
								e.target.style.height = `${e.target.scrollHeight}px`;
							}}
							onKeyDown={(e) => {
								if (
									e.key === 'Enter' &&
									(e.metaKey || e.ctrlKey)
								) {
									e.preventDefault();
									handleAddNote();
								}
							}}
						/>

						<div className='flex pt-2 justify-end'>
							<Button
								onClick={() => handleAddNote()}
								// variant=''
								// size='icon'
							>
								Add
							</Button>
						</div>
					</>
				)}
			</div>
		</ThreadContainer>
	);
};
