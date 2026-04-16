







import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import NotificationBadge from '@/components/NotificationBadge';

const nunito = Nunito({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Boch237 | Trouvez votre répétiteur au Cameroun',
  description: 'Boch237 est la plateforme n°1 au Cameroun pour trouver un répétiteur qualifié.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${nunito.variable} font-sans bg-slate-900`}>
        <div className="min-h-screen max-w-4xl mx-auto">
          <div className="sticky top-0 z-20 bg-green-600 p-2 flex justify-end">
            <NotificationBadge />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}