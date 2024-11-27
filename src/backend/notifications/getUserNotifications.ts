import { createClient } from '@/utils/supabase/client';

export async function getUserNotifications(userId: string) {
	const supabase = createClient();
	const { data, error } = await supabase.rpc('fetch_user_notifications', {
		p_user_id: userId,
	});

	if (error) {
		console.error('Error fetching notifications:', error);
		return [];
	}

	return data;
}
