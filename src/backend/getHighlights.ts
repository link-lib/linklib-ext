import { cleanUrl } from '@/scripts/highlighter/utils/highlightDataUtils';
import { createClient } from '@/utils/supabase/client';
import {
	HighlightWithUserMeta,
	NoteWithUserMeta,
	ReactionWithUserMeta,
} from '@/utils/supabase/typeAliases';

// Add a type for the user metadata JSON structure
export type UserMetadata = {
	name?: string;
	picture: string;
	email: string;
	firstName?: string;
};

export type HighlightWithNotesAndReactions = HighlightWithUserMeta & {
	notes: (NoteWithUserMeta & {
		reactions: ReactionWithUserMeta[];
		created_at: string;
		user_meta: UserMetadata;
	})[];
	reactions: ReactionWithUserMeta[];
};

export async function getHighlights(
	pageUrl: string
): Promise<HighlightWithNotesAndReactions[]> {
	const supabase = createClient();
	const cleanedUrl = cleanUrl(pageUrl);

	// Get all highlights for this page URL
	const { data: highlights, error: highlightsError } = await supabase
		.from('content_with_user_info')
		.select('*')
		.eq('link', cleanedUrl)
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
		.order('created_at');

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

	return highlightsWithNotesAndReactions;
}
