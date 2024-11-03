import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
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

	const { data, error } = await supabase
		.from('website_content')
		.select('*')
		.eq('user_id', userData.id)
		.eq('link', url)
		.single();

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
