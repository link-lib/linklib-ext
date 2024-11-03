import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
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

	if (!userData) {
		throw new Error('User not authenticated');
	}

	const { data: insertData, error } = await supabase
		.from('contentitem')
		.insert({
			id: uuidv4(),
			type: 'LINK',
			highlight_data: JSON.stringify(linkData),
			link: linkData.url,
			user_id: userData.id,
		});

	if (error) {
		console.error('Error saving link:', error);
		throw error;
	}

	console.log('Successfully saved link:', insertData);
	return insertData;
}
