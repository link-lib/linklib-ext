import { createClient } from '@/utils/supabase/client';
import { Highlight, Note } from '@/utils/supabase/typeAliases';
import { User } from '@supabase/supabase-js';

export type HighlightWithNotes = Highlight & {
	notes: Note[];
};

export async function getHighlights(
	pageUrl: string
): Promise<HighlightWithNotes[]> {
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

	const { data: highlights, error: highlightsError } = await supabase
		.from('contentitem')
		.select('*')
		.eq('user_id', userData.id)
		.eq('link', pageUrl)
		.eq('type', 'QUOTE');

	if (highlightsError) {
		console.log('Error fetching highlights.', highlightsError);
		throw highlightsError;
	}

	if (!highlights?.length) {
		return [];
	}

	// get all notes for these highlights
	const { data: notes, error: notesError } = await supabase
		.from('notes')
		.select('*')
		.in(
			'item_id',
			highlights.map((h) => h.id)
		)
		.eq('user_id', userData.id);

	if (notesError) {
		console.log('Error fetching notes.', notesError);
		throw notesError;
	}

	// Combine highlights with their notes
	const highlightsWithNotes: HighlightWithNotes[] = highlights.map(
		(highlight) => ({
			...highlight,
			notes: notes?.filter((note) => note.item_id === highlight.id) || [],
		})
	);

	return highlightsWithNotes;
}
