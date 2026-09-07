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
      meetings: {
        Row: {
          id: string;
          public_code: string;
          organizer_id: string;
          name: string;
          coordination_deadline: string;
          status: "OPEN" | "CLOSED" | "CONFIRMED";
          confirmed_date: string | null;
          confirmed_start_time: string | null;
          confirmed_end_time: string | null;
          confirmed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          public_code?: string;
          organizer_id: string;
          name: string;
          coordination_deadline: string;
          status?: "OPEN" | "CLOSED" | "CONFIRMED";
          confirmed_date?: string | null;
          confirmed_start_time?: string | null;
          confirmed_end_time?: string | null;
          confirmed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          public_code?: string;
          organizer_id?: string;
          name?: string;
          coordination_deadline?: string;
          status?: "OPEN" | "CLOSED" | "CONFIRMED";
          confirmed_date?: string | null;
          confirmed_start_time?: string | null;
          confirmed_end_time?: string | null;
          confirmed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      participants: {
        Row: {
          id: string;
          meeting_id: string;
          user_id: string;
          nickname: string;
          submitted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          user_id: string;
          nickname: string;
          submitted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          nickname?: string;
          submitted_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      availability: {
        Row: {
          id: string;
          participant_id: string;
          available_date: string;
          start_time: string;
          end_time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          participant_id: string;
          available_date: string;
          start_time: string;
          end_time: string;
          created_at?: string;
        };
        Update: {
          available_date?: string;
          start_time?: string;
          end_time?: string;
        };
        Relationships: [];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      get_meeting_by_code: {
        Args: {
          code: string;
        };
        Returns: {
          id: string;
          public_code: string;
          name: string;
          coordination_deadline: string;
          status: "OPEN" | "CLOSED" | "CONFIRMED";
        }[];
      };
    };

    Enums: {
      meeting_status: "OPEN" | "CLOSED" | "CONFIRMED";
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
