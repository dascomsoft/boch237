// import type { Metadata } from 'next';
// import { Nunito } from 'next/font/google';
// import './globals.css';

// const nunito = Nunito({ 
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '600', '700', '800', '900'],
//   variable: '--font-nunito',
// });

// export const metadata: Metadata = {
//   title: 'Boch237 | Trouvez votre répétiteur au Cameroun',
//   description: 'Boch237 est la plateforme n°1 au Cameroun pour trouver un répétiteur qualifié...',
  
//   openGraph: {
//     title: 'Boch237 - Plateforme de mise en relation parents/répétiteurs au Cameroun',
//     description: 'Trouvez facilement un répétiteur qualifié près de chez vous au Cameroun.',
//     url: 'https://boch237.com',
//     siteName: 'Boch237',

//     // ❌ favicon.ico mauvais choix ici
//     // ✅ utilise une vraie image
//     images: [
//       {
//         url: '/bochlogo.png',
//         width: 500,
//         height: 500,
//         alt: 'Boch237 Logo',
//       },
//     ],
//     locale: 'fr_FR',
//     type: 'website',
//   },

//   twitter: {
//     card: 'summary_large_image',
//     title: 'Boch237 - Trouvez votre répétiteur au Cameroun',
//     description: 'La plateforme qui connecte parents...',
    
//     // ❌ pareil ici
//     images: ['/bochlogo.png'],
//   },

//   // ✅ CORRECTION ICI
//   icons: {
//     icon: [
//       { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
//     ],
//     shortcut: ['/favicon.ico'],
//     apple: [
//       { url: '/bochlogo.png', sizes: '180x180' }, // mieux en PNG
//     ],
//   },

//   manifest: '/manifest.json',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="fr">
//       <head>
//         <link rel="canonical" href="https://boch237.com" />
//         <meta name="geo.region" content="CM" />
//         <meta name="geo.placename" content="Cameroun" />
//         <meta name="language" content="French" />

//         {/* ✅ GARDE JUSTE ÇA (simple et efficace) */}
//         <link rel="icon" href="/favicon.ico" sizes="any" />
//       </head>

//       <body className={`${nunito.variable} font-sans`}>
//         <div className="max-w-md mx-auto bg-slate-900 min-h-screen shadow-xl">
//           {children}
//         </div>
//       </body>
//     </html>
//   );
// }

























// import type { Metadata } from 'next';
// import { Nunito } from 'next/font/google';
// import './globals.css';
// import NotificationBadge from '@/components/NotificationBadge';

// const nunito = Nunito({ 
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '600', '700', '800', '900'],
//   variable: '--font-nunito',
// });

// export const metadata: Metadata = {
//   title: 'Boch237 | Trouvez votre répétiteur au Cameroun',
//   description: 'Boch237 est la plateforme n°1 au Cameroun pour trouver un répétiteur qualifié.',
//   keywords: 'répétiteur Cameroun, cours à domicile, professeur particulier, soutien scolaire',
//   authors: [{ name: 'Boch237 Team' }],
//   creator: 'Boch237',
//   publisher: 'Boch237',
//   robots: 'index, follow',
//   openGraph: {
//     title: 'Boch237 - Plateforme de mise en relation parents/répétiteurs au Cameroun',
//     description: 'Trouvez facilement un répétiteur qualifié près de chez vous au Cameroun.',
//     url: 'https://boch237.com',
//     siteName: 'Boch237',
//     images: [{ url: '/favicon.ico', width: 500, height: 500, alt: 'Boch237 Logo' }],
//     locale: 'fr_FR',
//     type: 'website',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Boch237 - Trouvez votre répétiteur au Cameroun',
//     description: 'La plateforme qui connecte parents, élèves et enseignants pour des cours à domicile.',
//     images: ['/favicon.ico'],
//   },
//   icons: {
//     icon: '/favicon.ico',
//     shortcut: '/favicon.ico',
//     apple: '/favicon.ico',
//   },
//   manifest: '/manifest.json',
//   category: 'education',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="fr">
//       <head>
//         <link rel="canonical" href="https://boch237.com" />
//         <meta name="geo.region" content="CM" />
//         <meta name="geo.placename" content="Cameroun" />
//         <meta name="language" content="French" />
//         <link rel="icon" type="image/x-icon" href="/favicon.ico" />
//       </head>
//       <body className={`${nunito.variable} font-sans`}>
//         <div className="max-w-md mx-auto bg-slate-900 min-h-screen shadow-xl relative">
//           <div className="sticky top-0 z-20 bg-green-600 p-2 flex justify-end">
//             <NotificationBadge />
//           </div>
//           {children}
//         </div>
//       </body>
//     </html>
//   );
// }









































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