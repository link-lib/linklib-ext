import { Note } from '@/utils/supabase/typeAliases';
import React from 'react';

interface CommentProps {
	// uuid: string;
	note: Note;
	// onAddReaction?: (noteId: number, emoji: string) => Promise<void>;
	// onRemoveReaction?: (reactionId: string) => Promise<void>;
	// currentUserId?: string;
}

const Comment: React.FC<CommentProps> = ({
	note,
	// onAddReaction,
	// onRemoveReaction,
	// currentUserId,
}) => {
	// const handleReactionClick = async (reaction: Reaction) => {
	// 	if (!onAddReaction || !onRemoveReaction) return;

	// 	if (reaction.user_id === currentUserId) {
	// 		await onRemoveReaction(reaction.id);
	// 	} else {
	// 		await onAddReaction(note.id, reaction.emoji);
	// 	}
	// };

	return (
		<div className='p-4'>
			<div className='w-full bg-popover'>
				<div className='pb-2'>
					<div className='flex items-center gap-2'>
						<div className='text-sm font-medium text-muted-foreground'>
							{/* notes */}
							{note.user_id || 'Anonymous'}
						</div>
					</div>
				</div>

				<div className='space-y-4'>
					<div className='text-sm'>{note.value}</div>

					{/* <div className='flex gap-2 flex-wrap'>
						{note.reactions?.map((reaction) => (
							<button
								key={reaction.id}
								onClick={() => handleReactionClick(reaction)}
								className={`
									flex items-center gap-1 px-2 py-1 text-xs rounded-full 
									border border-gray-200 transition-colors
									${
										reaction.user_id === currentUserId
											? 'bg-gray-100 hover:bg-gray-200'
											: 'hover:bg-gray-50'
									}
								`}
							>
								<span>{reaction.emoji}</span>
								{reaction.count > 1 && (
									<span className='text-xs text-muted-foreground'>
										{reaction.count}
									</span>
								)}
							</button>
						))}
					</div> */}
				</div>
			</div>
		</div>
	);
};

export default Comment;
