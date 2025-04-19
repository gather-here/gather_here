export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      Channel_participants: {
        Row: {
          channel_id: string;
          user_id: string | null;
        };
        Insert: {
          channel_id?: string;
          user_id?: string | null;
        };
        Update: {
          channel_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'channel_participants_channel_id_fkey';
            columns: ['channel_id'];
            isOneToOne: true;
            referencedRelation: 'Channels';
            referencedColumns: ['channel_id'];
          },
        ];
      };
      Channels: {
        Row: {
          channel_id: string;
          is_public: boolean | null;
        };
        Insert: {
          channel_id?: string;
          is_public?: boolean | null;
        };
        Update: {
          channel_id?: string;
          is_public?: boolean | null;
        };
        Relationships: [];
      };
      Interests: {
        Row: {
          category: string | null;
          created_at: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          post_id: string;
          user_id?: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'interests_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'Posts';
            referencedColumns: ['post_id'];
          },
          {
            foreignKeyName: 'interests_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['user_id'];
          },
        ];
      };
      IT_Events: {
        Row: {
          apply_done: string;
          apply_start: string;
          category: string;
          date_done: string;
          date_start: string;
          description: string;
          event_id: string;
          host: string;
          img_url: string;
          link_url: string;
          location: string;
          price: Json;
          title: string;
        };
        Insert: {
          apply_done: string;
          apply_start: string;
          category: string;
          date_done: string;
          date_start: string;
          description: string;
          event_id?: string;
          host: string;
          img_url?: string;
          link_url: string;
          location: string;
          price: Json;
          title?: string;
        };
        Update: {
          apply_done?: string;
          apply_start?: string;
          category?: string;
          date_done?: string;
          date_start?: string;
          description?: string;
          event_id?: string;
          host?: string;
          img_url?: string;
          link_url?: string;
          location?: string;
          price?: Json;
          title?: string;
        };
        Relationships: [];
      };
      IT_Interests: {
        Row: {
          created_at: string;
          event_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          event_id?: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          event_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'IT_Interests_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'IT_Events';
            referencedColumns: ['event_id'];
          },
          {
            foreignKeyName: 'IT_Interests_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['user_id'];
          },
        ];
      };
      Messages: {
        Row: {
          channel_id: string;
          content: string;
          message_id: string;
          sent_at: string;
          user_id: string;
        };
        Insert: {
          channel_id: string;
          content?: string;
          message_id?: string;
          sent_at?: string;
          user_id?: string;
        };
        Update: {
          channel_id?: string;
          content?: string;
          message_id?: string;
          sent_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Messages_channel_id_fkey';
            columns: ['channel_id'];
            isOneToOne: false;
            referencedRelation: 'Channels';
            referencedColumns: ['channel_id'];
          },
          {
            foreignKeyName: 'Messages_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['user_id'];
          },
        ];
      };
      Posts: {
        Row: {
          category: string;
          content: string;
          created_at: string;
          deadline: string;
          duration: number;
          location: string | null;
          personal_link: string | null;
          place: string;
          post_id: string;
          recruitments: number;
          target_position: string[];
          tech_stack: string[];
          title: string | null;
          total_members: number;
          user_id: string;
        };
        Insert: {
          category: string;
          content?: string;
          created_at?: string;
          deadline?: string;
          duration: number;
          location?: string | null;
          personal_link?: string | null;
          place: string;
          post_id?: string;
          recruitments: number;
          target_position: string[];
          tech_stack: string[];
          title?: string | null;
          total_members: number;
          user_id?: string;
        };
        Update: {
          category?: string;
          content?: string;
          created_at?: string;
          deadline?: string;
          duration?: number;
          location?: string | null;
          personal_link?: string | null;
          place?: string;
          post_id?: string;
          recruitments?: number;
          target_position?: string[];
          tech_stack?: string[];
          title?: string | null;
          total_members?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Posts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['user_id'];
          },
        ];
      };
      User_Interests: {
        Row: {
          created_at: string;
          liked_user_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          liked_user_id?: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          liked_user_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'User_Interests_liked_user_id_fkey';
            columns: ['liked_user_id'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'User_Interests_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['user_id'];
          },
        ];
      };
      Users: {
        Row: {
          answer1: string | null;
          answer2: string | null;
          answer3: string | null;
          background_image_url: string | null;
          blog: string | null;
          created_at: string | null;
          description: string | null;
          email: string | null;
          experience: string | null;
          first_link: string | null;
          first_link_type: string | null;
          hubCard: boolean | null;
          job_title: string | null;
          nickname: string | null;
          profile_image_url: string | null;
          second_link: string | null;
          second_link_type: string | null;
          tech_stacks: string[] | null;
          user_id: string;
        };
        Insert: {
          answer1?: string | null;
          answer2?: string | null;
          answer3?: string | null;
          background_image_url?: string | null;
          blog?: string | null;
          created_at?: string | null;
          description?: string | null;
          email?: string | null;
          experience?: string | null;
          first_link?: string | null;
          first_link_type?: string | null;
          hubCard?: boolean | null;
          job_title?: string | null;
          nickname?: string | null;
          profile_image_url?: string | null;
          second_link?: string | null;
          second_link_type?: string | null;
          tech_stacks?: string[] | null;
          user_id?: string;
        };
        Update: {
          answer1?: string | null;
          answer2?: string | null;
          answer3?: string | null;
          background_image_url?: string | null;
          blog?: string | null;
          created_at?: string | null;
          description?: string | null;
          email?: string | null;
          experience?: string | null;
          first_link?: string | null;
          first_link_type?: string | null;
          hubCard?: boolean | null;
          job_title?: string | null;
          nickname?: string | null;
          profile_image_url?: string | null;
          second_link?: string | null;
          second_link_type?: string | null;
          tech_stacks?: string[] | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      app_permission: 'channels.delete' | 'messages.delete';
      app_role: 'admin' | 'moderator';
      user_status: 'ONLINE' | 'OFFLINE';
    };
    CompositeTypes: Record<never, never>;
  };
}

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
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
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
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
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes'] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
  ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;
