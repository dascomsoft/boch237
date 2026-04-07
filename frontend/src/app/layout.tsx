import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cours Cameroun - Trouvez votre répétiteur',
  description: 'Plateforme de mise en relation parents/répétiteurs au Cameroun',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="max-w-md mx-auto bg-slate-900 min-h-screen shadow-xl">
          {children}
        </div>
      </body>
    </html>
  );
}