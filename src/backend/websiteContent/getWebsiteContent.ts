import { Session, User } from '@supabase/supabase-js';
import { createClient, getLocalStorage } from '@/utils/supabase/client';
import { SiteMetadata } from '@/scripts/highlighter/types/HighlightData';

export interface WebsiteContentType {
	id: string | number;
	content: string | null;
	link: string;
	user_id: string;
	siteMetadata: SiteMetadata;
	created_at: string;
}

export async function getWebsiteContent(
	url: string
): Promise<WebsiteContentType | null> {
	const supabase = createClient();

	let user: User | undefined = undefined;

	try {
		const currentSession = (await getLocalStorage('session')) as Session;
		user = currentSession.user;
	} catch {
		console.error('Invalid session stored.');
		throw new Error('Session parsing error');
	}

	const { data, error } = await supabase
		.from('website_content')
		.select('*')
		.eq('user_id', user.id)
		.eq('link', url)
		.single();

	debugger;

	if (error) {
		if (error.code === 'PGRST116') {
			// No matching record found
			return null;
		}
		console.error('Error checking existing website content:', error);
		throw error;
	}

	if (data) {
		const typedData: WebsiteContentType = {
			...data,
			siteMetadata: data.siteMetadata as SiteMetadata,
		};
		return typedData;
	}

	return null;
}
