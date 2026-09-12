


// import type { Metadata, Viewport } from 'next';
// import { Nunito } from 'next/font/google';

// import './globals.css';
// import NotificationBadge from '@/components/NotificationBadge';

// const nunito = Nunito({
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '600', '700', '800', '900'],
//   variable: '--font-nunito',
//   display: 'swap'
// });

// export const metadata: Metadata = {
//   metadataBase: new URL(
//     process.env.NEXT_PUBLIC_APP_URL || 'https://boch237.com'
//   ),

//   title: {
//     default: 'Boch237 | Trouvez votre répétiteur au Cameroun',
//     template: '%s | Boch237'
//   },

//   description:
//     'Boch237 est la plateforme de référence au Cameroun pour trouver rapidement un répétiteur qualifié.',

//   keywords: [
//     'répétiteur Cameroun',
//     'cours à domicile',
//     'soutien scolaire',
//     'enseignant Cameroun',
//     'Boch237'
//   ],

//   applicationName: 'Boch237',

//   icons: {
//     icon: '/favicon.ico',
//     shortcut: '/favicon.ico',
//     apple: '/apple-touch-icon.png'
//   },

//   openGraph: {
//     type: 'website',
//     locale: 'fr_CM',
//     siteName: 'Boch237',
//     title: 'Boch237 | Trouvez votre répétiteur au Cameroun',
//     description:
//       'Trouvez facilement un répétiteur qualifié près de chez vous.',
//     images: [
//       {
//         url: '/og-image.jpg',
//         width: 1200,
//         height: 630,
//         alt: 'Boch237'
//       }
//     ]
//   },

//   twitter: {
//     card: 'summary_large_image',
//     title: 'Boch237 | Trouvez votre répétiteur',
//     description:
//       'Trouvez facilement un répétiteur qualifié au Cameroun.',
//     images: ['/og-image.jpg']
//   }
// };

// export const viewport: Viewport = {
//   width: 'device-width',
//   initialScale: 1,
//   maximumScale: 5,
//   themeColor: '#020617',
//   colorScheme: 'dark'
// };

// export default function RootLayout({
//   children
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="fr" className={nunito.variable}>
//       <body className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-white antialiased">
//         {/* Fond global */}
//         <div
//           aria-hidden="true"
//           className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
//         >
//           <div className="absolute inset-0 bg-slate-950" />

//           <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-emerald-500/[0.07] blur-3xl sm:h-[36rem] sm:w-[36rem]" />

//           <div className="absolute -right-52 top-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-500/[0.05] blur-3xl sm:h-[36rem] sm:w-[36rem]" />

//           <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
//         </div>

//         <div className="relative min-h-screen">
//           {/* Barre globale */}
//           <div className="border-b border-white/[0.06] bg-slate-950/95">
//             <div className="mx-auto flex h-10 w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
//               <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
//                 Trouvez le répétiteur adapté à vos objectifs
//               </p>

//               <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400 sm:hidden">
//                 Boch237
//               </p>

//               <div className="flex items-center gap-3">
//                 <span className="hidden items-center gap-1.5 text-[11px] text-slate-500 md:flex">
//                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
//                   Plateforme disponible
//                 </span>

//                 <div className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] transition hover:border-emerald-400/20 hover:bg-emerald-400/10">
//                   <NotificationBadge />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Contenu de toutes les pages */}
//           <div className="relative w-full">
//             {children}
//           </div>
//         </div>
//       </body>
//     </html>
//   );
// }





















import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';

import './globals.css';
import NotificationBadge from '@/components/NotificationBadge';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://boch237.com'
  ),

  title: {
    default: 'Boch237 | Trouvez votre répétiteur au Cameroun',
    template: '%s | Boch237'
  },

  description:
    'Boch237 est la plateforme de référence au Cameroun pour trouver rapidement un répétiteur qualifié.',

  keywords: [
    'répétiteur Cameroun',
    'cours à domicile',
    'soutien scolaire',
    'enseignant Cameroun',
    'Boch237'
  ],

  applicationName: 'Boch237',

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },

  openGraph: {
    type: 'website',
    locale: 'fr_CM',
    siteName: 'Boch237',
    title: 'Boch237 | Trouvez votre répétiteur au Cameroun',
    description:
      'Trouvez facilement un répétiteur qualifié près de chez vous.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Boch237'
      }
    ]
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Boch237 | Trouvez votre répétiteur',
    description:
      'Trouvez facilement un répétiteur qualifié au Cameroun.',
    images: ['/og-image.jpg']
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#020617',
  colorScheme: 'dark'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={nunito.variable}>
      <body className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-white antialiased">
        {/* Fond global */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-slate-950" />

          <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-emerald-500/[0.07] blur-3xl sm:h-[36rem] sm:w-[36rem]" />

          <div className="absolute -right-52 top-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-500/[0.05] blur-3xl sm:h-[36rem] sm:w-[36rem]" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        </div>

        <div className="relative min-h-screen">
          {/* ============================================================
              Barre globale
              Décalée à droite pour ne pas passer sous la sidebar (md+)
          ============================================================= */}
          <div className="border-b border-white/[0.06] bg-slate-950/95 md:pl-64">
            <div className="mx-auto flex h-10 w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
              <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
                Trouvez le répétiteur adapté à vos objectifs
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400 sm:hidden">
                Boch237
              </p>

              <div className="flex items-center gap-3">
                <span className="hidden items-center gap-1.5 text-[11px] text-slate-500 md:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  Plateforme disponible
                </span>

                <div className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] transition hover:border-emerald-400/20 hover:bg-emerald-400/10">
                  <NotificationBadge />
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              Contenu de toutes les pages
              - md:pl-64 : compense la sidebar fixe à gauche (desktop)
              - pb-24    : réserve la place de la bottom nav (mobile)
              - md:pb-0  : plus besoin de marge basse en desktop
          ============================================================= */}
          <div className="relative w-full pb-24 md:pb-0 md:pl-64">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}