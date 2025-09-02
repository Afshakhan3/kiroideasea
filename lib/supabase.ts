import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          user_type: 'giver' | 'investor'
          plan_type: 'single' | 'unlimited' | 'investor' | null
          is_paid: boolean
          expiry_date: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          user_type: 'giver' | 'investor'
          plan_type?: 'single' | 'unlimited' | 'investor' | null
          is_paid?: boolean
          expiry_date?: string | null
        }
        Update: {
          name?: string
          email?: string
          user_type?: 'giver' | 'investor'
          plan_type?: 'single' | 'unlimited' | 'investor' | null
          is_paid?: boolean
          expiry_date?: string | null
        }
      }
      ideas: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          video_url: string
          created_at: string
        }
        Insert: {
          user_id: string
          title: string
          description: string
          video_url: string
        }
        Update: {
          title?: string
          description?: string
          video_url?: string
        }
      }
      likes: {
        Row: {
          id: string
          idea_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          idea_id: string
          user_id: string
        }
        Update: {}
      }
      comments: {
        Row: {
          id: string
          idea_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          idea_id: string
          user_id: string
          content: string
        }
        Update: {
          content?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          created_at: string
        }
        Insert: {
          sender_id: string
          receiver_id: string
          content: string
        }
        Update: {
          content?: string
        }
      }
    }
  }
}