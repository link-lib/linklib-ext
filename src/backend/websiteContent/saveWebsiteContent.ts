import { Session, User } from '@supabase/supabase-js';
import { createClient, getLocalStorage } from '@/utils/supabase/client';
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

	let user: User | undefined = undefined;

	try {
		const currentSession = (await getLocalStorage('session')) as Session;
		user = currentSession.user;
	} catch {
		console.error('Invalid session stored.');
		throw new Error('Session parsing error');
	}

	const { data: insertData, error } = await supabase
		.from('website_content')
		.insert({
			content: websiteContentData.content,
			link: websiteContentData.link,
			user_id: user.id,
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
