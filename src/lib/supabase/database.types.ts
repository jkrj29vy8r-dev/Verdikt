/**
 * Database types.
 *
 * This file mirrors the SQL schema in `supabase/migrations`. In a live project
 * it is regenerated with `pnpm db:types` (Supabase CLI) and should be treated
 * as generated output — edit the migrations, not this file. It is committed so
 * that type-checking works without a database connection.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          plan: Database["public"]["Enums"]["user_plan"];
          credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: Database["public"]["Enums"]["user_plan"];
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: Database["public"]["Enums"]["user_plan"];
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      vehicle_reports: {
        Row: {
          id: string;
          user_id: string;
          vin: string;
          year: number | null;
          make: string | null;
          model: string | null;
          trim: string | null;
          verdict_score: number | null;
          verdict_status:
            | Database["public"]["Enums"]["verdict_status"]
            | null;
          summary: string | null;
          payload: Json;
          status: Database["public"]["Enums"]["report_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vin: string;
          year?: number | null;
          make?: string | null;
          model?: string | null;
          trim?: string | null;
          verdict_score?: number | null;
          verdict_status?:
            | Database["public"]["Enums"]["verdict_status"]
            | null;
          summary?: string | null;
          payload?: Json;
          status?: Database["public"]["Enums"]["report_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vin?: string;
          year?: number | null;
          make?: string | null;
          model?: string | null;
          trim?: string | null;
          verdict_score?: number | null;
          verdict_status?:
            | Database["public"]["Enums"]["verdict_status"]
            | null;
          summary?: string | null;
          payload?: Json;
          status?: Database["public"]["Enums"]["report_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vehicle_reports_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      watchlist_items: {
        Row: {
          id: string;
          user_id: string;
          vin: string;
          label: string | null;
          target_price: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vin: string;
          label?: string | null;
          target_price?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vin?: string;
          label?: string | null;
          target_price?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "watchlist_items_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      user_plan: "free" | "pro" | "enterprise";
      verdict_status: "clear" | "caution" | "flagged";
      report_status: "pending" | "processing" | "complete" | "failed";
    };
    CompositeTypes: Record<never, never>;
  };
}

/** Convenience helpers for consuming the generated types. */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
