/* -----------------------------------------------------------------------
    createReaction
    Mutator to create a new reaction on a content item or note.
   ----------------------------------------------------------------------- */
'use server';

import { createClient } from '@/utils/supabase/client';

type CreateReactionArgs = {
	emoji: string;
	itemId?: string;
	noteId?: number;
};

export const createReaction = async ({
	emoji,
	itemId,
	noteId,
}: CreateReactionArgs) => {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const userId = user!.id;

	// Validate that either itemId or noteId is provided, but not both
	if ((!itemId && !noteId) || (itemId && noteId)) {
		throw new Error('Must provide either itemId or noteId, but not both.');
	}

	const { data, error } = await supabase
		.from('reactions')
		.insert({
			emoji,
			user_id: userId,
			item_id: itemId || null,
			note_id: noteId || null,
		})
		.select();

	if (error) {
		// If error is due to unique constraint, user already reacted with this emoji
		if (error.code === '23505') {
			throw new Error('You have already reacted with this emoji.');
		}
		throw new Error('Error in creating new reaction.');
	}

	return data[0];
};
