import { createClient } from '@/utils/supabase/client';
import { Notification } from '@/utils/supabase/typeAliases';

export async function markNotificationsAsRead(
	notificationIds: Notification['id'][]
) {
	const supabase = createClient();

	const { error } = await supabase
		.from('notifications')
		.update({ is_read: true })
		.in('id', notificationIds)
		.select();

	if (error) {
		throw new Error(
			`Failed to mark notifications as read: ${error.message}`
		);
	}
}
