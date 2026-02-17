import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { AuthProvider } from '@/components/providers/auth-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Oath — 每日正向指引',
  description: '融合中西智慧的個人化成長夥伴',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider
            supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
            supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
          >
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
