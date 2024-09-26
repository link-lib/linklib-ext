import { createClient } from '@/utils/supabase/client';

interface AddTagToContentItemArgs {
	itemId: string;
	tagId: string;
}

export async function addTagToContentItem(args: AddTagToContentItemArgs) {
	const supabase = createClient();

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
