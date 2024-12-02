import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTimeAgo } from '@/scripts/highlighter/components/Comment/Comment';
import { Notification } from '@/utils/supabase/typeAliases';

interface NotificationItemProps {
	notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
	const relatedData = notification.related_data;
	const noteData = relatedData.note_data;
	const contentData = relatedData.content_data;

	return (
		<a
			href={contentData.link}
			target='_blank'
			rel='noopener noreferrer'
			className='block p-5 bg-popover hover:bg-popover-hover transition-colors duration-200'
		>
			<div className='flex flex-col gap-2'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2 text-muted-foreground'>
						<Avatar className='w-6 h-6'>
							<AvatarImage
								src={noteData.raw_user_meta_data.picture}
								alt={
									noteData.raw_user_meta_data.name ??
									noteData.raw_user_meta_data.email
								}
							/>
							<AvatarFallback>
								{(
									noteData.raw_user_meta_data.name?.[0] ??
									noteData.raw_user_meta_data.email[0]
								)?.toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className='flex gap-1 items-center'>
							<span className='text-sm font-medium'>
								{noteData.raw_user_meta_data.name ??
									noteData.raw_user_meta_data.email}
							</span>
							<span className='text-sm '>
								{notification.notification_type === 'reply'
									? 'replied to your note'
									: 'interacted with your highlight'}
							</span>
						</div>
					</div>
					<span className='text-xs text-muted-foreground'>
						{formatTimeAgo(new Date(notification.created_at))}
					</span>
				</div>

				<div className='text-sm '>{noteData.value}</div>

				{/* <div className='p-2'> */}
				<div className='line-clamp-3 text-sm leading-relaxed'>
					<span className='bg-yellow-400 text-primary-foreground leading-relaxed whitespace-pre-wrap'>
						{contentData.value.split(' ').join(' ')}
					</span>
				</div>
				{/* </div> */}
			</div>
		</a>
	);
};
