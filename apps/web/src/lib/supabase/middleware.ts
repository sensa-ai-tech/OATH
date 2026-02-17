/**
 * Supabase Middleware Client
 *
 * 處理 session refresh + 保護路由
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/** 不需要驗證的路由 */
const PUBLIC_ROUTES = new Set([
  '/',
  '/login',
  '/register',
  '/privacy',
  '/terms',
]);

/** API 路由前綴（不做 redirect） */
const API_PREFIX = '/api';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 刷新 session（重要：不要用 getSession，避免安全風險）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // API 路由不做 redirect
  if (pathname.startsWith(API_PREFIX)) {
    return supabaseResponse;
  }

  // 未登入 + 存取保護路由 → redirect 到 login
  if (!user && !PUBLIC_ROUTES.has(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 已登入 + 存取 auth 頁面 → redirect 到 daily
  if (user && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/daily';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
