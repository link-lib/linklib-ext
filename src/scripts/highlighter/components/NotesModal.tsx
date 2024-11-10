import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { CirclePlus } from 'lucide-react';
import { Note, Reaction } from '@/utils/supabase/typeAliases';
import { useContext, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { AuthContext } from '@/scripts/auth/context/AuthModalContext';

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
};

export const NotesModal = ({
	notes,
	onNoteChange,
	reactions,
	onAddReaction,
	onDeleteReaction,
	shouldFocusInput,
	onInputFocused,
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

	// const handleDelete = () => {
	// 	// setNote('');
	// 	onClose();
	// 	onDelete();
	// };

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
		<div className='space-y-4'>
			{/* Reactions Section */}
			<div className='flex items-center gap-2 p-2 border-b'>
				<div className='flex flex-wrap gap-1'>
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
			</div>

			{/* Notes Section */}
			<div className='space-y-2'>
				{notes.map((note) => (
					<Textarea
						key={note.id}
						value={note.value || ''}
						onChange={(e) => onNoteChange(note.id, e.target.value)}
						className='w-full min-h-[100px] p-2 border rounded'
						placeholder='Add a note...'
					/>
				))}
			</div>
		</div>
	);
};
