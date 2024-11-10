import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { AuthContext } from '@/scripts/auth/context/AuthModalContext';
import Comment from '@/scripts/highlighter/components/Comment/Comment';
import ThreadContainer from '@/scripts/highlighter/components/Comment/ThreadContainer';
import { StarRating } from '@/scripts/highlighter/components/Stars';
import { Note, Reaction } from '@/utils/supabase/typeAliases';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { CirclePlus, Trash2, X } from 'lucide-react';
import { useContext, useEffect, useRef } from 'react';

type NotesModalProps = {
	notes: Note[];
	setNotes: (notes: Note[]) => void;
	onNoteChange: (noteId: number, value: string) => void;
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
};

export const NotesModal = ({
	notes,
	onNoteChange,
	onClose,
	rating,
	setRating,
	onDelete,
	reactions,
	onAddReaction,
	onDeleteReaction,
	shouldFocusInput,
	onInputFocused,
	isPopoverOpened,
}: NotesModalProps) => {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (shouldFocusInput && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.setSelectionRange(
				notes[0].value.length,
				notes[0].value.length
			);
			onInputFocused();
		}
	}, [shouldFocusInput, onInputFocused, notes]);

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

	return (
		<ThreadContainer>
			<div className='flex gap-2 justify-between items-center flex-row rounded-md pt-0 p-2 text-sm'>
				<div className='flex flex-row'>
					{Object.entries(groupedReactions).map(
						([emoji, { count, userReactionId }]) => (
							<button
								key={emoji}
								onClick={() => handleReactionClick(emoji)}
								className={`flex items-center gap-1 px-2 py-1 text-sm rounded-full border border-gray-200 transition-colors
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
					<Popover>
						<PopoverTrigger asChild>
							<button className='p-1 hover:bg-gray-100 rounded-full'>
								<CirclePlus className='w-5 h-5' />
							</button>
						</PopoverTrigger>
						<PopoverContent
							className='p-0 border-none shadow-lg w-[352px]'
							side='top'
						>
							<Picker
								data={data}
								onEmojiSelect={(emoji: any) => {
									onAddReaction(emoji.native);
								}}
								theme='light'
								previewPosition='none'
								skinTonePosition='none'
							/>
						</PopoverContent>
					</Popover>
				</div>
				<div className='flex flex-row items-center'>
					<StarRating onRating={setRating} initialRating={rating} />
					<button
						className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
						onClick={handleDelete}
					>
						<Trash2 className='w-full h-full' />
					</button>
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
				{notes.map((note) => (
					<Comment note={note} />
				))}
			</div>

			{/* Comments */}
			<Textarea
				ref={inputRef}
				className='text-primary'
				placeholder='thoughts?'
				value={notes.length > 0 ? notes[0].value : ''}
				// fix: notes can't be edited now, can you fix that?
				onChange={(e) => onNoteChange(notes[0].id, e.target.value)}
			/>
		</ThreadContainer>
	);
};
