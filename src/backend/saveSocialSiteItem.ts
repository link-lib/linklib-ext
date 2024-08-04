// ---------------------------------------------
// Handler for all social media post saves: Youtube, Instagram,
// LinkedIn, TikTok, Twitter
// ---------------------------------------------

import { createClient } from '../../utils/supabase/client';

type InstagramContent = {
	type: 'INSTAGRAM';
	link: string;
};

type LinkedInContent = {
	type: 'LINKEDIN';
	link: string;
};

type TikTokContent = {
	type: 'TIKTOK';
	link: string;
};

type TwitterContent = {
	type: 'TWITTER';
	nativeid: string;
};

type YouTubeContent = {
	type: 'YOUTUBE';
	link: string;
};

type HackerNewsContent = {
	type: 'HN';
	nativeid: string;
};

type RedditContent = {
	type: 'REDDIT';
	nativeid: string;
};

type ContentItem =
	| InstagramContent
	| LinkedInContent
	| TikTokContent
	| TwitterContent
	| YouTubeContent
	| HackerNewsContent
	| RedditContent;

export async function saveSocialSiteItem(item: ContentItem) {
	const supabase = createClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (!user || userError) {
		console.error(
			'User not authenticated or error fetching user:',
			userError
		);
		return null;
	}

	const payload: any = {
		type: item.type,
		user_id: user.id,
	};

	switch (item.type) {
		case 'INSTAGRAM':
		case 'LINKEDIN':
		case 'TIKTOK':
		case 'YOUTUBE':
			payload.link = item.link;
			break;
		case 'TWITTER':
		case 'REDDIT':
		case 'HN':
			payload.nativeid = item.nativeid;
			break;
	}

	const { data, error } = await supabase.from('contentitem').insert(payload);

	if (error) {
		console.error('Error saving content item:', error);
		return null;
	}

	return data;
}
