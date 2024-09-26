import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

export async function saveHighlight(highlightData: HighlightData) {
	const supabase = createClient();

	let userData: User | undefined = undefined;

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		userData = user;
	} catch (e) {
		console.error('Invalid session stored.', e);
		throw new Error('Session parsing error');
	}
	const bodyText = highlightData.matching.body;
	const pageUrl = highlightData.siteMetadata.url;

	const { data: insertData, error } = await supabase
		.from('contentitem')
		.insert({
			id: highlightData.uuid,
			type: 'QUOTE',
			highlight_data: JSON.stringify(highlightData),
			value: bodyText,
			link: pageUrl,
			user_id: userData.id,
		});
	if (error) {
		console.log('Error saving highlight.', error);
		throw new Error('error saving highlight');
	} else {
		console.log('Successfully saved highlight.', insertData);
	}
	return insertData;
}
