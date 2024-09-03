import { createClient, getLocalStorage } from '../../utils/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export async function deleteHighlight(highlightId: string) {
	const supabase = createClient();

	let user: User | undefined = undefined;

	try {
		const currentSession = (await getLocalStorage('session')) as Session;
		user = currentSession.user;
	} catch {
		console.error('Invalid session stored.');
		throw new Error('Session parsing error');
	}

	const { data, error } = await supabase
		.from('contentitem')
		.delete()
		.eq('id', highlightId)
		.eq('user_id', user.id);

	if (error) {
		console.log('Error deleting highlight.', error);
		throw error;
	} else {
		console.log('Successfully deleted highlight.', data);
	}

	return data;
}
