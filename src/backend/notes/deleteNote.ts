'use server';

/* -----------------------------------------------------------------------
    updateNote
    Mutator to update a note on a content item.
   ----------------------------------------------------------------------- */

import { createClient } from '@/utils/supabase/client';

type DeleteNoteArgs = {
	noteId: number;
};

export const deleteNote = async ({ noteId }: DeleteNoteArgs) => {
	const supabase = createClient();

	const { error } = await supabase
		.from('notes')
		.delete()
		.eq('id', noteId)
		.select();

	if (error) {
		throw new Error('Error deleting note.');
	}
};
