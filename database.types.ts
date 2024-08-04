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
      contentitem: {
        Row: {
          createdat: string | null
          fullPath: string | null
          id: string
          link: string | null
          nativeid: string | null
          path: string | null
          type: Database["public"]["Enums"]["content_type"]
          user_id: string | null
          value: string | null
        }
        Insert: {
          createdat?: string | null
          fullPath?: string | null
          id: string
          link?: string | null
          nativeid?: string | null
          path?: string | null
          type: Database["public"]["Enums"]["content_type"]
          user_id?: string | null
          value?: string | null
        }
        Update: {
          createdat?: string | null
          fullPath?: string | null
          id?: string
          link?: string | null
          nativeid?: string | null
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
            foreignKeyName: "contentitemtag_tagid_fkey"
            columns: ["tagid"]
            isOneToOne: false
            referencedRelation: "tag"
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
          icon: string | null
          id: string
          name: string | null
          user_id: string | null
        }
        Insert: {
          createdat?: string | null
          icon?: string | null
          id: string
          name?: string | null
          user_id?: string | null
        }
        Update: {
          createdat?: string | null
          icon?: string | null
          id?: string
          name?: string | null
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
            referencedRelation: "tag"
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
    }
    Views: {
      [_ in never]: never
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
