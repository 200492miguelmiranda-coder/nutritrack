import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Cliente de Supabase. Si no hay variables de entorno configuradas,
// exportamos null y la app sigue funcionando solo con localStorage.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseListo = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = supabaseListo
  ? createClient(url as string, anonKey as string)
  : null;
