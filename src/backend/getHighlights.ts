import { createClient } from '@/utils/supabase/client';
import { Highlight, Note, Reaction } from '@/utils/supabase/typeAliases';

export type HighlightWithNotesAndReactions = Highlight & {
	notes: (Note & {
		reactions: Reaction[];
		created_at: string;
	})[];
	reactions: Reaction[];
};

export async function getHighlights(
	pageUrl: string
): Promise<HighlightWithNotesAndReactions[]> {
	const supabase = createClient();

	// Get all highlights for this page URL
	const { data: highlights, error: highlightsError } = await supabase
		.from('contentitem')
		.select('*')
		.eq('link', pageUrl)
		.eq('type', 'QUOTE');

	if (highlightsError) {
		console.log('Error fetching highlights.', highlightsError);
		throw highlightsError;
	}

	if (!highlights?.length) {
		return [];
	}

	// Get all notes for these highlights
	const { data: notes, error: notesError } = await supabase
		.from('notes')
		.select('*')
		.in(
			'item_id',
			highlights.map((h) => h.id)
		)
		.order('created_at', { ascending: false });

	if (notesError) {
		console.log('Error fetching notes.', notesError);
		throw notesError;
	}

	// Get all reactions for both highlights and notes
	const { data: reactions, error: reactionsError } = await supabase
		.from('reactions')
		.select('*')
		.or(
			`item_id.in.(${highlights.map((h) => h.id).join(',')}),` +
				`note_id.in.(${notes?.map((n) => n.id).join(',')})`
		);

	if (reactionsError) {
		console.log('Error fetching reactions.', reactionsError);
		throw reactionsError;
	}

	// Combine highlights with their notes and reactions
	const highlightsWithNotesAndReactions: HighlightWithNotesAndReactions[] =
		highlights.map((highlight) => {
			const highlightNotes =
				notes?.filter((note) => note.item_id === highlight.id) || [];
			const notesWithReactions = highlightNotes.map((note) => ({
				...note,
				reactions:
					reactions?.filter(
						(reaction) => reaction.note_id === note.id
					) || [],
			}));

			return {
				...highlight,
				notes: notesWithReactions,
				reactions:
					reactions?.filter(
						(reaction) => reaction.item_id === highlight.id
					) || [],
			};
		});

	return highlightsWithNotesAndReactions;
}
