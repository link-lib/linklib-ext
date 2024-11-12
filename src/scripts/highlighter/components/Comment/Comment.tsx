import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VoiceNote from '@/scripts/highlighter/components/Comment/VoiceNote';
import { NoteWithUserMeta } from '@/utils/supabase/typeAliases';
import React from 'react';

interface CommentProps {
	note: NoteWithUserMeta;
}

const Comment: React.FC<CommentProps> = ({ note }) => {
	console.log(note);
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
							{/* notes */}
							{note.user_meta.name}
						</div>
					</div>
					<div className='text-xs text-muted-foreground'>
						{formatTimeAgo(new Date(note.created_at))}
					</div>
				</div>

				<div className='space-y-4'>
					<div className='text-sm text-primary'>{note.value}</div>
				</div>
			</div>
		</div>
	);
};

export const VoiceComment: React.FC<CommentProps> = () => {
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
