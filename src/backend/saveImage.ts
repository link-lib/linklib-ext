import { createClient } from '../../utils/supabase/client';
import { uploadFile } from './uploadFile';

export async function uploadImage(file: File) {
	return uploadFile({ file, fileType: 'IMAGE' });
}

export async function saveImage(file: File) {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		console.log('User not authenticated.');
		return null;
	}

	const data = await uploadImage(file);
	if (data) {
		const { data: insertData, error } = await supabase
			.from('contentitem')
			.insert({
				id: data.id,
				path: data.path,
				fullPath: data.fullPath,
				user_id: user.id,
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
