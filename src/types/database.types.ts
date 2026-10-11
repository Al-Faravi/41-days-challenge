export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; current_streak: number; max_streak: number; current_phase: string; created_at: string }
        Insert: { id: string; email: string; current_streak?: number; max_streak?: number; current_phase?: string; created_at?: string }
        Update: { id?: string; email?: string; current_streak?: number; max_streak?: number; current_phase?: string; created_at?: string }
      },
      daily_logs: {
        Row: { id: string; user_id: string; log_date: string; prayers_5_waqt: boolean; no_porn: boolean; no_masturbation: boolean; nafal_prayer: boolean; quran_reading: boolean; walk_minutes: number; daily_score: number; created_at: string }
        Insert: { id?: string; user_id: string; log_date: string; prayers_5_waqt?: boolean; no_porn?: boolean; no_masturbation?: boolean; nafal_prayer?: boolean; quran_reading?: boolean; walk_minutes?: number; daily_score?: number; created_at?: string }
        Update: { id?: string; user_id?: string; log_date?: string; prayers_5_waqt?: boolean; no_porn?: boolean; no_masturbation?: boolean; nafal_prayer?: boolean; quran_reading?: boolean; walk_minutes?: number; daily_score?: number; created_at?: string }
      }
    }
  }
}