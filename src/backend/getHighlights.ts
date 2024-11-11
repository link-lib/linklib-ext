import { createClient } from '@/utils/supabase/client';
import { Highlight, Note, Reaction } from '@/utils/supabase/typeAliases';

// Add a type for the user metadata JSON structure
type UserMetadata = {
	name: string;
	picture: string;
};

export type HighlightWithNotesAndReactions = Highlight & {
	notes: (Note & {
		reactions: (Reaction & {
			user_meta: UserMetadata;
		})[];
		created_at: string;
		user_meta: UserMetadata;
	})[];
	reactions: (Reaction & {
		user_meta: UserMetadata;
	})[];
	user_meta: UserMetadata;
};

export async function getHighlights(
	pageUrl: string
): Promise<HighlightWithNotesAndReactions[]> {
	const supabase = createClient();

	// Get all highlights for this page URL
	const { data: highlights, error: highlightsError } = await supabase
		.from('content_with_user_info')
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
		.from('notes_with_user_info')
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
		.from('reactions_with_user_info')
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
		highlights.map((highlight) => ({
			...highlight,
			user_meta: highlight.raw_user_meta_data as UserMetadata,
			notes: (
				notes?.filter((note) => note.item_id === highlight.id) || []
			).map((note) => ({
				...note,
				user_meta: note.raw_user_meta_data as UserMetadata,
				reactions:
					reactions
						?.filter((reaction) => reaction.note_id === note.id)
						.map((reaction) => ({
							...reaction,
							user_meta:
								reaction.raw_user_meta_data as UserMetadata,
						})) || [],
			})),
			reactions:
				reactions
					?.filter((reaction) => reaction.item_id === highlight.id)
					.map((reaction) => ({
						...reaction,
						user_meta: reaction.raw_user_meta_data as UserMetadata,
					})) || [],
		}));

	console.log(highlightsWithNotesAndReactions);

	return highlightsWithNotesAndReactions;
}
