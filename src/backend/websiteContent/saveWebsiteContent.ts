import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { SiteMetadata } from '@/scripts/highlighter/types/HighlightData';

interface WebsiteContentData {
	content: string | null;
	link: string;
	siteMetadata: SiteMetadata;
}

export async function saveWebsiteContent(
	websiteContentData: WebsiteContentData
) {
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

	const { data: insertData, error } = await supabase
		.from('website_content')
		.insert({
			content: websiteContentData.content,
			link: websiteContentData.link,
			user_id: userData.id,
			siteMetadata: websiteContentData.siteMetadata,
		});

	if (error) {
		console.log('Error saving website content.', error);
		throw error;
	} else {
		console.log('Successfully saved website content.', insertData);
	}

	return insertData;
}
