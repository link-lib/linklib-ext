// ---------------------------------------------
// Handler for all social media post saves: Youtube, Instagram,
// LinkedIn, TikTok, Twitter
// ---------------------------------------------

import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

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

	if (!userData) {
		console.error('User not authenticated or error fetching user:');
		throw new Error('User authentication error');
	}

	const payload: any = {
		type: item.type,
		user_id: userData.id,
		id: uuidv4(),
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
		throw new Error('Error saving conten item ' + error);
	}

	console.log('Successfully saved post to database.');
	return data;
}
