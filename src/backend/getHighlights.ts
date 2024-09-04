import { createClient, getLocalStorage } from '@/utils/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export async function getHighlights(pageUrl: string) {
	const supabase = createClient();

	let user: User | undefined = undefined;

	try {
		const currentSession = (await getLocalStorage('session')) as Session;
		user = currentSession.user;
	} catch {
		console.error('Invalid session stored.');
		throw new Error('Session parsing error');
	}

	const { data: highlights, error } = await supabase
		.from('contentitem')
		.select('*')
		.eq('user_id', user.id)
		.eq('link', pageUrl)
		.eq('type', 'QUOTE');

	if (error) {
		console.log('Error fetching highlights.', error);
		throw error;
	}

	return highlights;
}
