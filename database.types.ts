export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bugs: {
        Row: {
          created_at: string
          description: string
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bugs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contentitem: {
        Row: {
          createdat: string | null
          fullPath: string | null
          highlight_data: Json | null
          id: string
          link: string | null
          nativeid: string | null
          note: string | null
          path: string | null
          type: Database["public"]["Enums"]["content_type"]
          user_id: string | null
          value: string | null
        }
        Insert: {
          createdat?: string | null
          fullPath?: string | null
          highlight_data?: Json | null
          id: string
          link?: string | null
          nativeid?: string | null
          note?: string | null
          path?: string | null
          type: Database["public"]["Enums"]["content_type"]
          user_id?: string | null
          value?: string | null
        }
        Update: {
          createdat?: string | null
          fullPath?: string | null
          highlight_data?: Json | null
          id?: string
          link?: string | null
          nativeid?: string | null
          note?: string | null
          path?: string | null
          type?: Database["public"]["Enums"]["content_type"]
          user_id?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contentitem_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contentitemtag: {
        Row: {
          itemid: string
          tagid: string
        }
        Insert: {
          itemid: string
          tagid: string
        }
        Update: {
          itemid?: string
          tagid?: string
        }
        Relationships: [
          {
            foreignKeyName: "contentitemtag_itemid_fkey"
            columns: ["itemid"]
            isOneToOne: false
            referencedRelation: "contentitem"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contentitemtag_itemid_fkey"
            columns: ["itemid"]
            isOneToOne: false
            referencedRelation: "public_content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contentitemtag_tagid_fkey"
            columns: ["tagid"]
            isOneToOne: false
            referencedRelation: "public_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contentitemtag_tagid_fkey"
            columns: ["tagid"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["id"]
          },
        ]
      }
      errors: {
        Row: {
          action: string | null
          created_at: string
          error: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string
          error?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string
          error?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "errors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          description: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_page_interaction: {
        Row: {
          created_at: string
          email: string | null
          features: string | null
          id: number
          item_id: string | null
          reason: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          features?: string | null
          id?: number
          item_id?: string | null
          reason?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          features?: string | null
          id?: number
          item_id?: string | null
          reason?: string | null
        }
        Relationships: []
      }
      list: {
        Row: {
          createdat: string | null
          description: string | null
          icon: string | null
          id: string
          is_public: boolean
          name: string | null
          slug: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          createdat?: string | null
          description?: string | null
          icon?: string | null
          id: string
          is_public?: boolean
          name?: string | null
          slug: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          createdat?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_public?: boolean
          name?: string | null
          slug?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "list_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      list_tag: {
        Row: {
          list_id: string
          tag_id: string
        }
        Insert: {
          list_id: string
          tag_id: string
        }
        Update: {
          list_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "list_tag_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "list_tag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "public_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "list_tag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          created_at: string
          id: number
          item_id: string | null
          user_id: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          item_id?: string | null
          user_id: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          item_id?: string | null
          user_id?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "contentitem"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "public_content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tag: {
        Row: {
          icon: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          icon?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          icon?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tag_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      website_content: {
        Row: {
          content: string | null
          created_at: string
          id: number
          link: string | null
          siteMetadata: Json | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          link?: string | null
          siteMetadata?: Json | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          link?: string | null
          siteMetadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "website-content_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      hypopg_hidden_indexes: {
        Row: {
          am_name: unknown | null
          index_name: unknown | null
          indexrelid: unknown | null
          is_hypo: boolean | null
          schema_name: unknown | null
          table_name: unknown | null
        }
        Relationships: []
      }
      hypopg_list_indexes: {
        Row: {
          am_name: unknown | null
          index_name: string | null
          indexrelid: unknown | null
          schema_name: unknown | null
          table_name: unknown | null
        }
        Relationships: []
      }
      public_content_items: {
        Row: {
          id: string | null
        }
        Relationships: []
      }
      public_tags: {
        Row: {
          id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_list_for_tags_sql: {
        Args: {
          sql: string
        }
        Returns: {
          id: string
          name: string
          icon: string
        }[]
      }
      hypopg: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>[]
      }
      hypopg_create_index: {
        Args: {
          sql_order: string
        }
        Returns: Record<string, unknown>[]
      }
      hypopg_drop_index: {
        Args: {
          indexid: unknown
        }
        Returns: boolean
      }
      hypopg_get_indexdef: {
        Args: {
          indexid: unknown
        }
        Returns: string
      }
      hypopg_hidden_indexes: {
        Args: Record<PropertyKey, never>
        Returns: {
          indexid: unknown
        }[]
      }
      hypopg_hide_index: {
        Args: {
          indexid: unknown
        }
        Returns: boolean
      }
      hypopg_relation_size: {
        Args: {
          indexid: unknown
        }
        Returns: number
      }
      hypopg_reset: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      hypopg_reset_index: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      hypopg_unhide_all_indexes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      hypopg_unhide_index: {
        Args: {
          indexid: unknown
        }
        Returns: boolean
      }
      index_advisor: {
        Args: {
          query: string
        }
        Returns: {
          startup_cost_before: Json
          startup_cost_after: Json
          total_cost_before: Json
          total_cost_after: Json
          index_statements: string[]
          errors: string[]
        }[]
      }
    }
    Enums: {
      content_type:
        | "INSTAGRAM"
        | "LINKEDIN"
        | "TWITTER"
        | "TIKTOK"
        | "YOUTUBE"
        | "QUOTE"
        | "IMAGE"
        | "LINK"
        | "HN"
        | "REDDIT"
        | "PINTEREST"
        | "LOOM"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
