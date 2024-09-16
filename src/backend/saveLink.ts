import { createClient, getLocalStorage } from '@/utils/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

interface LinkData {
	url: string;
	title: string;
	favicon: string;
	author: string;
	publishDate: string;
	savedDate: string;
}

export async function saveLink(linkData: LinkData) {
	const supabase = createClient();

	let user: User | undefined = undefined;

	try {
		const currentSession = (await getLocalStorage('session')) as Session;
		user = currentSession.user;
	} catch {
		console.error('Invalid session stored.');
		throw new Error('Session parsing error');
	}

	if (!user) {
		throw new Error('User not authenticated');
	}

	const { data: insertData, error } = await supabase
		.from('contentitem')
		.insert({
			id: uuidv4(),
			type: 'LINK',
			highlight_data: JSON.stringify(linkData),
			link: linkData.url,
			user_id: user.id,
		});

	if (error) {
		console.error('Error saving link:', error);
		throw error;
	}

	console.log('Successfully saved link:', insertData);
	return insertData;
}
