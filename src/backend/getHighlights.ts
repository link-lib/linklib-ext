import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export async function getHighlights(pageUrl: string) {
	const supabase = createClient();

	let userData: User | undefined = undefined;

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		userData = user;
	} catch {
		console.error('Invalid session stored.');
		throw new Error('Session parsing error');
	}

	const { data: highlights, error } = await supabase
		.from('contentitem')
		.select('*')
		.eq('user_id', userData.id)
		.eq('link', pageUrl)
		.eq('type', 'QUOTE');

	if (error) {
		console.log('Error fetching highlights.', error);
		throw error;
	}

	return highlights;
}
