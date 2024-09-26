import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export async function deleteHighlight(highlightId: string) {
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

	const { data, error } = await supabase
		.from('contentitem')
		.delete()
		.eq('id', highlightId)
		.eq('user_id', userData.id);

	if (error) {
		console.log('Error deleting highlight.', error);
		throw error;
	} else {
		console.log('Successfully deleted highlight.', data);
	}

	return data;
}
