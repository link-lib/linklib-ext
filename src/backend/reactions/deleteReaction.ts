/* -----------------------------------------------------------------------
    deleteReaction
    Mutator to delete a reaction on a content item or note.
   ----------------------------------------------------------------------- */
'use server';

import { createClient } from '@/utils/supabase/client';

type DeleteReactionArgs = {
	reactionId: string;
};

export const deleteReaction = async ({ reactionId }: DeleteReactionArgs) => {
	const supabase = createClient();

	const { error } = await supabase
		.from('reactions')
		.delete()
		.eq('id', reactionId);

	if (error) {
		throw new Error('Error deleting reaction');
	}
};
