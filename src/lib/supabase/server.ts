import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                // লোকাল টেস্টিংয়ের সময় যেন ব্রাউজার কুকি ব্লক না করে
                secure: process.env.NODE_ENV === "production",
              });
            });
          } catch (error) {
            // Server Component থেকে কল হলে এরর ইগনোর করবে
          }
        },
      },
    }
  );
}