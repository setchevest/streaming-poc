import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import './globals.css';

export const metadata = {
  title: 'Streaming Platform - Live Sports Events',
  description: 'Watch live sports events with real-time streaming and analytics',
}

export const generateViewport = () => ({
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
})

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
