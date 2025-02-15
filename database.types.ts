export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			bugs: {
				Row: {
					created_at: string;
					description: string;
					id: number;
					user_id: string | null;
				};
				Insert: {
					created_at?: string;
					description: string;
					id?: number;
					user_id?: string | null;
				};
				Update: {
					created_at?: string;
					description?: string;
					id?: number;
					user_id?: string | null;
				};
				Relationships: [];
			};
			contentitem: {
				Row: {
					createdat: string | null;
					fullPath: string | null;
					highlight_data: Json | null;
					id: string;
					link: string | null;
					nativeid: string | null;
					path: string | null;
					type: Database['public']['Enums']['content_type'];
					user_id: string | null;
					value: string | null;
				};
				Insert: {
					createdat?: string | null;
					fullPath?: string | null;
					highlight_data?: Json | null;
					id: string;
					link?: string | null;
					nativeid?: string | null;
					path?: string | null;
					type: Database['public']['Enums']['content_type'];
					user_id?: string | null;
					value?: string | null;
				};
				Update: {
					createdat?: string | null;
					fullPath?: string | null;
					highlight_data?: Json | null;
					id?: string;
					link?: string | null;
					nativeid?: string | null;
					path?: string | null;
					type?: Database['public']['Enums']['content_type'];
					user_id?: string | null;
					value?: string | null;
				};
				Relationships: [];
			};
			contentitemtag: {
				Row: {
					itemid: string;
					tagid: string;
				};
				Insert: {
					itemid: string;
					tagid: string;
				};
				Update: {
					itemid?: string;
					tagid?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'contentitemtag_itemid_fkey';
						columns: ['itemid'];
						isOneToOne: false;
						referencedRelation: 'content_with_user_info';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'contentitemtag_itemid_fkey';
						columns: ['itemid'];
						isOneToOne: false;
						referencedRelation: 'contentitem';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'contentitemtag_itemid_fkey';
						columns: ['itemid'];
						isOneToOne: false;
						referencedRelation: 'public_content_items';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'contentitemtag_tagid_fkey';
						columns: ['tagid'];
						isOneToOne: false;
						referencedRelation: 'public_tags';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'contentitemtag_tagid_fkey';
						columns: ['tagid'];
						isOneToOne: false;
						referencedRelation: 'tag';
						referencedColumns: ['id'];
					}
				];
			};
			custom_user_data: {
				Row: {
					created_at: string;
					id: number;
					link_onboarding_completed: boolean;
					substack_link: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					link_onboarding_completed?: boolean;
					substack_link?: string | null;
					user_id?: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					link_onboarding_completed?: boolean;
					substack_link?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			errors: {
				Row: {
					action: string | null;
					created_at: string;
					error: string | null;
					id: number;
					user_id: string | null;
				};
				Insert: {
					action?: string | null;
					created_at?: string;
					error?: string | null;
					id?: number;
					user_id?: string | null;
				};
				Update: {
					action?: string | null;
					created_at?: string;
					error?: string | null;
					id?: number;
					user_id?: string | null;
				};
				Relationships: [];
			};
			feedback: {
				Row: {
					created_at: string;
					description: string | null;
					id: number;
					user_id: string | null;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					id?: number;
					user_id?: string | null;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					id?: number;
					user_id?: string | null;
				};
				Relationships: [];
			};
			landing_page_interaction: {
				Row: {
					created_at: string;
					email: string | null;
					features: string | null;
					id: number;
					item_id: string | null;
					reason: string | null;
				};
				Insert: {
					created_at?: string;
					email?: string | null;
					features?: string | null;
					id?: number;
					item_id?: string | null;
					reason?: string | null;
				};
				Update: {
					created_at?: string;
					email?: string | null;
					features?: string | null;
					id?: number;
					item_id?: string | null;
					reason?: string | null;
				};
				Relationships: [];
			};
			list: {
				Row: {
					createdat: string | null;
					description: string | null;
					icon: string | null;
					id: string;
					is_public: boolean;
					name: string | null;
					slug: string;
					updated_at: string | null;
					user_id: string | null;
				};
				Insert: {
					createdat?: string | null;
					description?: string | null;
					icon?: string | null;
					id: string;
					is_public?: boolean;
					name?: string | null;
					slug: string;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Update: {
					createdat?: string | null;
					description?: string | null;
					icon?: string | null;
					id?: string;
					is_public?: boolean;
					name?: string | null;
					slug?: string;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Relationships: [];
			};
			list_tag: {
				Row: {
					list_id: string;
					tag_id: string;
				};
				Insert: {
					list_id: string;
					tag_id: string;
				};
				Update: {
					list_id?: string;
					tag_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'list_tag_list_id_fkey';
						columns: ['list_id'];
						isOneToOne: false;
						referencedRelation: 'list';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'list_tag_tag_id_fkey';
						columns: ['tag_id'];
						isOneToOne: false;
						referencedRelation: 'public_tags';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'list_tag_tag_id_fkey';
						columns: ['tag_id'];
						isOneToOne: false;
						referencedRelation: 'tag';
						referencedColumns: ['id'];
					}
				];
			};
			notes: {
				Row: {
					created_at: string;
					id: number;
					item_id: string | null;
					user_id: string;
					value: string | null;
				};
				Insert: {
					created_at?: string;
					id?: number;
					item_id?: string | null;
					user_id: string;
					value?: string | null;
				};
				Update: {
					created_at?: string;
					id?: number;
					item_id?: string | null;
					user_id?: string;
					value?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'notes_item_id_fkey';
						columns: ['item_id'];
						isOneToOne: false;
						referencedRelation: 'content_with_user_info';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'notes_item_id_fkey';
						columns: ['item_id'];
						isOneToOne: false;
						referencedRelation: 'contentitem';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'notes_item_id_fkey';
						columns: ['item_id'];
						isOneToOne: false;
						referencedRelation: 'public_content_items';
						referencedColumns: ['id'];
					}
				];
			};
			notifications: {
				Row: {
					created_at: string;
					id: number;
					is_read: boolean | null;
					notification_type:
						| Database['public']['Enums']['notification_type']
						| null;
					related_id: string;
					related_table: Database['public']['Enums']['notifiable_item_table'];
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					is_read?: boolean | null;
					notification_type?:
						| Database['public']['Enums']['notification_type']
						| null;
					related_id: string;
					related_table: Database['public']['Enums']['notifiable_item_table'];
					user_id?: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					is_read?: boolean | null;
					notification_type?:
						| Database['public']['Enums']['notification_type']
						| null;
					related_id?: string;
					related_table?: Database['public']['Enums']['notifiable_item_table'];
					user_id?: string;
				};
				Relationships: [];
			};
			reactions: {
				Row: {
					created_at: string;
					emoji: string;
					id: string;
					item_id: string | null;
					note_id: number | null;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					emoji: string;
					id?: string;
					item_id?: string | null;
					note_id?: number | null;
					user_id: string;
				};
				Update: {
					created_at?: string;
					emoji?: string;
					id?: string;
					item_id?: string | null;
					note_id?: number | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'reactions_item_id_fkey';
						columns: ['item_id'];
						isOneToOne: false;
						referencedRelation: 'content_with_user_info';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'reactions_item_id_fkey';
						columns: ['item_id'];
						isOneToOne: false;
						referencedRelation: 'contentitem';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'reactions_item_id_fkey';
						columns: ['item_id'];
						isOneToOne: false;
						referencedRelation: 'public_content_items';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'reactions_note_id_fkey';
						columns: ['note_id'];
						isOneToOne: false;
						referencedRelation: 'notes';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'reactions_note_id_fkey';
						columns: ['note_id'];
						isOneToOne: false;
						referencedRelation: 'notes_with_user_info';
						referencedColumns: ['id'];
					}
				];
			};
			tag: {
				Row: {
					icon: string | null;
					id: string;
					name: string;
					user_id: string | null;
				};
				Insert: {
					icon?: string | null;
					id?: string;
					name: string;
					user_id?: string | null;
				};
				Update: {
					icon?: string | null;
					id?: string;
					name?: string;
					user_id?: string | null;
				};
				Relationships: [];
			};
			website_content: {
				Row: {
					content: string | null;
					created_at: string;
					id: string;
					link: string | null;
					siteMetadata: Json | null;
					user_id: string | null;
				};
				Insert: {
					content?: string | null;
					created_at?: string;
					id?: string;
					link?: string | null;
					siteMetadata?: Json | null;
					user_id?: string | null;
				};
				Update: {
					content?: string | null;
					created_at?: string;
					id?: string;
					link?: string | null;
					siteMetadata?: Json | null;
					user_id?: string | null;
				};
				Relationships: [];
			};
		};
		Views: {
			content_with_user_info: {
				Row: {
					createdat: string | null;
					fullPath: string | null;
					highlight_data: Json | null;
					id: string | null;
					link: string | null;
					nativeid: string | null;
					path: string | null;
					raw_user_meta_data: Json | null;
					type: Database['public']['Enums']['content_type'] | null;
					user_id: string | null;
					value: string | null;
				};
				Relationships: [];
			};
			hypopg_hidden_indexes: {
				Row: {
					am_name: unknown | null;
					index_name: unknown | null;
					indexrelid: unknown | null;
					is_hypo: boolean | null;
					schema_name: unknown | null;
					table_name: unknown | null;
				};
				Relationships: [];
			};
			hypopg_list_indexes: {
				Row: {
					am_name: unknown | null;
					index_name: string | null;
					indexrelid: unknown | null;
					schema_name: unknown | null;
					table_name: unknown | null;
				};
				Relationships: [];
			};
			notes_with_user_info: {
				Row: {
					created_at: string | null;
					id: number | null;
					item_id: string | null;
					raw_user_meta_data: Json | null;
					user_id: string | null;
					value: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'notes_item_id_fkey';
						columns: ['item_id'];
						isOneToOne: false;
						referencedRelation: 'content_with_user_info';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'notes_item_id_fkey';
						columns: ['item_id'];
						isOneToOne: false;
						referencedRelation: 'contentitem';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'notes_item_id_fkey';
						columns: ['item_id'];
						isOneToOne: false;
						referencedRelation: 'public_content_items';
						referencedColumns: ['id'];
					}
				];
			};
			public_content_items: {
				Row: {
					id: string | null;
				};
				Relationships: [];
			};
			public_tags: {
				Row: {
					id: string | null;
				};
				Relationships: [];
			};
			reactions_with_user_info: {
				Row: {
					created_at: string | null;
					emoji: string | null;
					id: string | null;
					item_id: string | null;
					note_id: number | null;
					raw_user_meta_data: Json | null;
					user_id: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'reactions_item_id_fkey';
						columns: ['item_id'];
						isOneToOne: false;
						referencedRelation: 'content_with_user_info';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'reactions_item_id_fkey';
						columns: ['item_id'];
						isOneToOne: false;
						referencedRelation: 'contentitem';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'reactions_item_id_fkey';
						columns: ['item_id'];
						isOneToOne: false;
						referencedRelation: 'public_content_items';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'reactions_note_id_fkey';
						columns: ['note_id'];
						isOneToOne: false;
						referencedRelation: 'notes';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'reactions_note_id_fkey';
						columns: ['note_id'];
						isOneToOne: false;
						referencedRelation: 'notes_with_user_info';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Functions: {
			clean_stale_notifications: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			fetch_user_notifications: {
				Args: {
					p_user_id: string;
				};
				Returns: {
					notification_id: number;
					user_id: string;
					related_table: Database['public']['Enums']['notifiable_item_table'];
					related_id: string;
					is_read: boolean;
					created_at: string;
					notification_type: Database['public']['Enums']['notification_type'];
					related_data: Json;
				}[];
			};
			get_list_for_tags_sql: {
				Args: {
					sql: string;
				};
				Returns: {
					id: string;
					name: string;
					icon: string;
				}[];
			};
			hypopg: {
				Args: Record<PropertyKey, never>;
				Returns: Record<string, unknown>[];
			};
			hypopg_create_index: {
				Args: {
					sql_order: string;
				};
				Returns: Record<string, unknown>[];
			};
			hypopg_drop_index: {
				Args: {
					indexid: unknown;
				};
				Returns: boolean;
			};
			hypopg_get_indexdef: {
				Args: {
					indexid: unknown;
				};
				Returns: string;
			};
			hypopg_hidden_indexes: {
				Args: Record<PropertyKey, never>;
				Returns: {
					indexid: unknown;
				}[];
			};
			hypopg_hide_index: {
				Args: {
					indexid: unknown;
				};
				Returns: boolean;
			};
			hypopg_relation_size: {
				Args: {
					indexid: unknown;
				};
				Returns: number;
			};
			hypopg_reset: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			hypopg_reset_index: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			hypopg_unhide_all_indexes: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			hypopg_unhide_index: {
				Args: {
					indexid: unknown;
				};
				Returns: boolean;
			};
			index_advisor: {
				Args: {
					query: string;
				};
				Returns: {
					startup_cost_before: Json;
					startup_cost_after: Json;
					total_cost_before: Json;
					total_cost_after: Json;
					index_statements: string[];
					errors: string[];
				}[];
			};
			notify_other_note_users:
				| {
						Args: {
							current_user_id: string;
							content_item_id: string;
							note_id: number;
						};
						Returns: undefined;
				  }
				| {
						Args: {
							current_user_id: string;
							p_item_id: number;
							note_id: number;
						};
						Returns: undefined;
				  };
		};
		Enums: {
			content_type:
				| 'INSTAGRAM'
				| 'LINKEDIN'
				| 'TWITTER'
				| 'TIKTOK'
				| 'YOUTUBE'
				| 'QUOTE'
				| 'IMAGE'
				| 'LINK'
				| 'HN'
				| 'REDDIT'
				| 'PINTEREST'
				| 'LOOM';
			notifiable_item_table: 'notes' | 'reactions' | 'contentitem';
			notification_type: 'reply' | 'user_post_engagement';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
			PublicSchema['Views'])
	? (PublicSchema['Tables'] &
			PublicSchema['Views'])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema['Enums']
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
	? PublicSchema['Enums'][PublicEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
	? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
	: never;
