'use server';

/* -----------------------------------------------------------------------
    updateNote
    Mutator to update a note on a content item.
   ----------------------------------------------------------------------- */

import { createClient } from '@/utils/supabase/client';

type UpdateNoteArgs = {
	noteId: number;
	noteValue: string;
};

export const updateNote = async ({ noteId, noteValue }: UpdateNoteArgs) => {
	const supabase = createClient();

	const { error } = await supabase
		.from('notes')
		.update({ value: noteValue })
		.eq('id', noteId)
		.select();

	if (error) {
		throw new Error('Error updating note.');
	}
};
