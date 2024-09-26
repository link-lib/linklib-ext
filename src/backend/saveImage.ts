import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { uploadFile } from './uploadFile';

export async function uploadImage(file: File) {
	return uploadFile({ file, fileType: 'IMAGE' });
}

export async function saveImage(file: File) {
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

	const data = await uploadImage(file);
	if (data) {
		const { data: insertData, error } = await supabase
			.from('contentitem')
			.insert({
				id: data.id,
				path: data.path,
				fullPath: data.fullPath,
				user_id: userData.id,
				type: 'IMAGE',
			});
		if (error) {
			console.log('Error saving content item.', error);
		} else {
			console.log('Successfully saved content item.', insertData);
		}
		return insertData;
	}
}
