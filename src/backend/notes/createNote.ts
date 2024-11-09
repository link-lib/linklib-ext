/* -----------------------------------------------------------------------
    createNote
    Mutator to create a new note on a content item.
   ----------------------------------------------------------------------- */
'use server';

import { createClient } from '@/utils/supabase/client';

type CreateNoteArgs = {
	noteValue: string;
	itemId: string;
};

export const createNote = async ({ noteValue, itemId }: CreateNoteArgs) => {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const userId = user!.id;

	const { error } = await supabase
		.from('notes')
		.insert({
			value: noteValue,
			user_id: userId,
			item_id: itemId,
		})
		.select();

	if (error) {
		throw new Error('Error in creating new note.');
	}
};
