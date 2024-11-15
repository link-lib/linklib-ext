import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VoiceNote from '@/scripts/highlighter/components/Comment/VoiceNote';
import { NoteWithUserMeta } from '@/utils/supabase/typeAliases';
import React, { useContext, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/scripts/auth/context/AuthModalContext';
import { Textarea } from '@/components/ui/textarea';

interface CommentProps {
	note: NoteWithUserMeta;
	onDelete: (note: NoteWithUserMeta) => Promise<void>;
	onEdit: (note: NoteWithUserMeta, noteValue: string) => Promise<void>;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
}

const Comment: React.FC<CommentProps> = ({
	note,
	onDelete,
	onEdit,
	isEditing,
	setIsEditing,
}) => {
	const { user } = useContext(AuthContext);
	const isCommentOwner = user?.id === note.user_id;
	const [editValue, setEditValue] = useState(note.value);

	return (
		<div className='p-4'>
			<div className='w-full bg-popover'>
				<div className='flex items-center gap-2 flex-row justify-between '>
					<div className='flex flex-row gap-2 items-center'>
						<Avatar className='w-4 h-4'>
							<AvatarImage src={note.user_meta.picture} />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<div className='text-sm font-medium text-muted-foreground truncate'>
							{note.user_meta.name}
						</div>
					</div>
					<div className='flex items-center gap-2'>
						<div className='text-xs text-muted-foreground'>
							{formatTimeAgo(new Date(note.created_at))}
						</div>

						{isCommentOwner && (
							<div className='flex gap-1'>
								<button
									className='hover:text-white flex justify-center align-center items-center text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
									onClick={() => setIsEditing(true)}
								>
									<Pencil className='h-4 w-4' />
								</button>
								<button
									className='hover:text-white text-white hover:border-white flex justify-center align-center items-center border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
									onClick={() => onDelete(note)}
								>
									<Trash2 className='h-4 w-4' />
								</button>
							</div>
						)}
					</div>
				</div>

				<div className='space-y-4'>
					{isEditing ? (
						<div className='space-y-2'>
							<Textarea
								value={editValue}
								onChange={(e) => setEditValue(e.target.value)}
								className='w-full min-h-[100px] p-2 text-sm rounded-md border text-primary'
							/>
							<div className='flex justify-end gap-2'>
								<Button
									variant='outline'
									size='sm'
									onClick={() => setIsEditing(false)}
								>
									Cancel
								</Button>
								<Button
									size='sm'
									onClick={() => onEdit(note, editValue)}
								>
									Save
								</Button>
							</div>
						</div>
					) : (
						<div className='text-sm text-primary'>{note.value}</div>
					)}
				</div>
			</div>
		</div>
	);
};

export const VoiceComment: React.FC<{ highlightId: string }> = ({
	highlightId,
}) => {
	if (highlightId !== 'c215184f-324d-45df-99f3-50744c19884a') return null;

	return (
		<div className='p-4'>
			<div className='w-full bg-popover'>
				<div className='flex items-center gap-2 flex-row justify-between '>
					<div className='flex flex-row gap-2 items-center'>
						<Avatar className='w-4 h-4'>
							{/* <AvatarImage src={note.user_meta.picture} /> */}
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<div className='text-sm font-medium text-muted-foreground truncate'>
							{/* notes */}
							Nadav
						</div>
					</div>
					<div className='text-xs text-muted-foreground'>5h</div>
				</div>

				<VoiceNote
					transcription='ok this is a long rant on how '
					duration='2:37'
					audioUrl={''}
				/>
			</div>
		</div>
	);
};

function formatTimeAgo(date: Date): string {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	// Less than a minute
	if (diffInSeconds < 60) {
		return 'now';
	}

	// Less than an hour
	if (diffInSeconds < 3600) {
		const minutes = Math.floor(diffInSeconds / 60);
		return `${minutes}m`;
	}

	// Less than a day
	if (diffInSeconds < 86400) {
		const hours = Math.floor(diffInSeconds / 3600);
		return `${hours}h`;
	}

	// Less than a week
	if (diffInSeconds < 604800) {
		const days = Math.floor(diffInSeconds / 86400);
		return `${days}d`;
	}

	// Less than a month
	if (diffInSeconds < 2592000) {
		const weeks = Math.floor(diffInSeconds / 604800);
		return `${weeks}w`;
	}

	// Less than a year
	if (diffInSeconds < 31536000) {
		const months = Math.floor(diffInSeconds / 2592000);
		return `${months}mo`;
	}

	// More than a year
	const years = Math.floor(diffInSeconds / 31536000);
	return `${years}y`;
}

export default Comment;
