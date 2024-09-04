import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

type UploadFileProps = {
	file: File;
	fileType: 'IMAGE';
};

export async function uploadFile({ file, fileType }: UploadFileProps) {
	const supabase = createClient();
	const randomId = uuidv4();

	let filePath = '';
	switch (fileType) {
		case 'IMAGE':
			filePath = `images/${randomId}.png`;
			break;
		default:
			console.log('unrecognized file type', fileType);
			return;
	}

	const { data, error } = await supabase.storage
		.from('user_saved_files')
		.upload(filePath, file, {
			cacheControl: '3600',
			upsert: false,
		});
	if (error) {
		console.log('Error uploading file', error);
	} else {
		console.log('Successfully uploaded file', data);
		return data;
	}
}
