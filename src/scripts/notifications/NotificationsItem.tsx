import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Notification } from '@/utils/supabase/typeAliases';

interface NotificationItemProps {
	notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
	const relatedData = notification.related_data;
	const noteData = relatedData.note_data;
	const contentData = relatedData.content_data;

	return (
		<div className={`p-3 ${!notification.read ? 'bg-muted/50' : ''}`}>
			<div className='flex items-start gap-3'>
				<Avatar className='w-8 h-8'>
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
				<div className='flex-1'>
					<p className='text-sm font-medium'>
						{noteData.raw_user_meta_data.name ??
							noteData.raw_user_meta_data.email}
					</p>
					<p className='text-sm text-muted-foreground'>
						{notification.notification_type === 'reply'
							? `replied to your highlight: "${noteData.value}"`
							: 'interacted with your highlight'}
					</p>
					<div className='mt-1 text-xs text-muted-foreground'>
						{new Date(notification.created_at).toLocaleDateString()}
					</div>
					<div className='mt-2 p-2 bg-muted/30 rounded-md text-xs'>
						{contentData.value}
					</div>
					<Button
						variant='link'
						size='sm'
						className='mt-2 h-auto p-0 text-xs'
						onClick={() => window.open(contentData.link, '_blank')}
					>
						View highlight →
					</Button>
				</div>
			</div>
		</div>
	);
};
