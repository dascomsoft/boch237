
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Boch237 | Trouvez votre répétiteur au Cameroun',
  description: 'Boch237 est la plateforme n°1 au Cameroun pour trouver un répétiteur qualifié. Parents, élèves et enseignants, connectez-vous facilement pour des cours à domicile dans toutes les villes et provinces du Cameroun.',
  keywords: 'répétiteur Cameroun, cours à domicile, professeur particulier, soutien scolaire, enseignant, parent, élève, Yaoundé, Douala, Bafoussam, Garoua, Maroua, Ngaoundéré, Bamenda, Buea, Ebolowa, Bertoua',
  authors: [{ name: 'Boch237 Team' }],
  creator: 'Boch237',
  publisher: 'Boch237',
  robots: 'index, follow',
  openGraph: {
    title: 'Boch237 - Plateforme de mise en relation parents/répétiteurs au Cameroun',
    description: 'Trouvez facilement un répétiteur qualifié près de chez vous au Cameroun. Plus de 1000 répétiteurs disponibles dans toutes les villes et provinces.',
    url: 'https://boch237.com',
    siteName: 'Boch237',
    images: [
      {
        url: '/bochlogo.png',
        width: 500,
        height: 500,
        alt: 'Boch237 Logo',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boch237 - Trouvez votre répétiteur au Cameroun',
    description: 'La plateforme qui connecte parents, élèves et enseignants pour des cours à domicile au Cameroun.',
    images: ['/bochlogo.png'],
  },
  icons: {
    icon: '/bochlogo.png',
    shortcut: '/bochlogo.png',
    apple: '/bochlogo.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'votre-code-google-verification',
  },
  category: 'education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="canonical" href="https://boch237.com" />
        <meta name="geo.region" content="CM" />
        <meta name="geo.placename" content="Cameroun" />
        <meta name="language" content="French" />
      </head>
      <body className={inter.className}>
        <div className="max-w-md mx-auto bg-slate-900 min-h-screen shadow-xl">
          {children}
        </div>
      </body>
    </html>
  );
}