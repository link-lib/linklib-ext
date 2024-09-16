import { Session, User } from '@supabase/supabase-js';
import { createClient, getLocalStorage } from '@/utils/supabase/client';

interface AddTagToContentItemArgs {
	itemId: string;
	tagId: string;
}

export async function addTagToContentItem(args: AddTagToContentItemArgs) {
	const supabase = createClient();

	let user: User | undefined = undefined;

	try {
		const currentSession = (await getLocalStorage('session')) as Session;
		user = currentSession.user;
	} catch {
		console.error('Invalid session stored.');
		throw new Error('Session parsing error');
	}

	if (!user) throw new Error('User not found');

	const { data: insertData, error } = await supabase
		.from('contentitemtag')
		.insert({
			itemid: args.itemId,
			tagid: args.tagId,
		});

	if (error) {
		console.error('Error adding new tag to content item.', error);
		throw error;
	} else {
		console.log('Successfully added tag to content item.', insertData);
	}

	return insertData;
}
