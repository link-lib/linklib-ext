import { createNote } from '@/backend/notes/createNote';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AuthContext } from '@/scripts/auth/context/AuthModalContext';
import Comment, {
	VoiceComment,
} from '@/scripts/highlighter/components/Comment/Comment';
import ThreadContainer from '@/scripts/highlighter/components/Comment/ThreadContainer';
// import { StarRating } from '@/scripts/highlighter/components/Stars';
import { NoteWithUserMeta, Reaction } from '@/utils/supabase/typeAliases';
import { SmilePlus, Trash2, X } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { EmojiPicker } from './Reactions/EmojiPicker';
import { toast } from '@/components/ui/use-toast';
import { updateNote } from '@/backend/notes/updateNote';
import { deleteNote } from '@/backend/notes/deleteNote';
import { HighlightData } from '../types/HighlightData';

type NotesModalProps = {
	initialNotes: NoteWithUserMeta[];
	reactions: Reaction[];
	onAddReaction: (emoji: string) => Promise<void>;
	onDeleteReaction: (reactionId: string) => Promise<void>;
	onClose: () => void;
	rating: number;
	setRating: (rating: number) => void;
	onDelete: () => void;
	shouldFocusInput: boolean;
	onInputFocused: () => void;
	isPopoverOpened: boolean;
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
	// shouldFocusInput,
	// onInputFocused,
	isPopoverOpened,
	highlight,
}: NotesModalProps) => {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);
	const { user } = useContext(AuthContext);
	const [notes, setNotes] = useState<NoteWithUserMeta[]>(initialNotes);
	const [newNote, setNewNote] = useState('');
	const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [onClose]);

	// If popover is closed and there are no notes, don't render anything
	if (!isPopoverOpened && notes.length === 0) {
		return null;
	}

	const handleDelete = () => {
		// setNote('');
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
			<div className='z-infinite bytebelli-internal flex gap-2 justify-between items-center flex-row pt-0 p-2 text-sm border-b border-lining'>
				<div className='flex flex-row gap-1'>
					{Object.entries(groupedReactions).map(
						([emoji, { count, userReactionId }]) => (
							<button
								key={emoji}
								onClick={() => handleReactionClick(emoji)}
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
							onClick={handleDelete}
						>
							<Trash2 className='w-full h-full' />
						</button>
					)}
					<button
						className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
						onClick={onClose}
					>
						<X className='w-full h-full' />
					</button>
				</div>
			</div>
			{/* Render all notes */}
			<div className='flex flex-col'>
				<VoiceComment highlightId={highlight.uuid} />
				{notes.map((note) => (
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
			</div>

			{/* Comments */}
			{!editingNoteId && (
				<>
					<Textarea
						ref={inputRef}
						className='text-primary'
						placeholder='thoughts?'
						value={newNote}
						onChange={(e) => setNewNote(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
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
		</ThreadContainer>
	);
};
