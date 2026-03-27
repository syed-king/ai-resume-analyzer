import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'ResumeAI — Smart Resume Analyzer',
  description: 'AI-powered resume analysis and ATS optimization. Get your match score, find missing skills, and land more interviews.',
  manifest: '/manifest.json',
  themeColor: '#8b5cf6',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  icons: { apple: '/icon-192.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen text-white bg-dark-900">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            {children}
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background: 'rgba(17,17,42,0.95)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  color: '#fff',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                },
                success: { iconTheme: { primary: '#a78bfa', secondary: '#030712' } },
                error: { iconTheme: { primary: '#f472b6', secondary: '#030712' } },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js');}`,
          }}
        />
      </body>
    </html>
  );
}
