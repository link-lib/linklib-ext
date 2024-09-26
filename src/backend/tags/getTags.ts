// src/backend/tags/getTags.ts

import { createClient, getLocalStorage } from '@/utils/supabase/client';
import { Tables } from 'database.types';
import { Session, User } from '@supabase/supabase-js';

// Define the Tag type based on the Database schema
export type Tag = Omit<Tables<'tag'>, 'user_id'>;

/**
 * Fetches tags associated with the authenticated user.
 *
 * @returns {Promise<Tag[]>} - A promise that resolves to an array of Tag objects.
 * @throws {Error} - Throws an error if the session is invalid or the fetch operation fails.
 */
export async function getTags(): Promise<Tag[]> {
	const supabase = createClient();

	let user: User | undefined = undefined;

	try {
		const currentSession = (await getLocalStorage('session')) as Session;
		user = currentSession.user;
	} catch {
		console.error('Invalid session stored.');
		throw new Error('Session parsing error');
	}

	const userId = user!.id;

	if (!userId) {
		throw new Error('User ID not found in session.');
	}

	const { data, error } = await supabase
		.from('tag')
		.select('*')
		.eq('user_id', userId);

	if (error) {
		console.log('Error fetching highlights.', error);
		throw error;
	}

	return data || [];
}
