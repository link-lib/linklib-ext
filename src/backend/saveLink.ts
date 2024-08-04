import { createClient } from '../../utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export async function saveLink(link: string) {
	const supabase = createClient();
	const randomId = uuidv4();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		console.log('User not authenticated.');
		return null;
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
