/**
 * Supabase Server Client（SSR 用）
 *
 * 用於 Server Components / Route Handlers / Middleware
 * 基於 @supabase/ssr 的 cookie 管理
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component 中無法寫入 cookie — 正常行為
            // Middleware 或 Route Handler 中會正確寫入
          }
        },
      },
    },
  );
}
