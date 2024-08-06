import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { createClient } from '../../utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export async function saveHighlight(highlightData: HighlightData) {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		console.log('User not authenticated.');
		return null;
	}

	const bodyText = highlightData.matching.body;
	const pageUrl = highlightData.url;

	const { data: insertData, error } = await supabase
		.from('contentitem')
		.insert({
			type: 'QUOTE',
			value: bodyText,
			highlight_data: JSON.stringify(highlightData),
			link: pageUrl,
			id: uuidv4(),
			user_id: user.id,
		});
	if (error) {
		console.log('Error saving highlight.', error);
	} else {
		console.log('Successfully saved highlight.', insertData);
	}
	return insertData;
}
