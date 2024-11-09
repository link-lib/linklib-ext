import { Database } from 'database.types';

export type Highlight = Database['public']['Tables']['contentitem']['Row'];
export type Note = Database['public']['Tables']['notes']['Row'];
export type Reaction = Database['public']['Tables']['reactions']['Row'];
