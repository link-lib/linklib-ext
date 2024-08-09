import { Session, User } from '@supabase/supabase-js';
import { createClient, getLocalStorage } from '../../utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export async function saveLink(link: string) {
	const supabase = createClient();
	const randomId = uuidv4();

	let user: User | undefined = undefined;

	try {
		const currentSession = (await getLocalStorage('session')) as Session;
		user = currentSession.user;
	} catch {
		console.error('Invalid session stored.');
		throw new Error('Session parsing error');
	}

	const { data: insertData, error } = await supabase
		.from('contentitem')
		.insert({
			user_id: user.id,
			link,
			type: 'LINK',
			id: randomId,
		});
	if (error) {
		console.log('Error saving content item.', error);
	} else {
		console.log('Successfully saved content item.', insertData);
	}
	return insertData;
}
