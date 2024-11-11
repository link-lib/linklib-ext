import { UserMetadata } from '@/backend/getHighlights';
import { Database } from 'database.types';

export type Highlight = Database['public']['Tables']['contentitem']['Row'];
export type HighlightWithUserMeta = Highlight & {
	user_meta: UserMetadata;
};
export type Note = Database['public']['Tables']['notes']['Row'];
export type NoteWithUserMeta = Note & {
	user_meta: UserMetadata;
};
export type Reaction = Database['public']['Tables']['reactions']['Row'];
export type ReactionWithUserMeta = Reaction & {
	user_meta: UserMetadata;
};
