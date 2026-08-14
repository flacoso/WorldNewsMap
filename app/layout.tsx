import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WorldNewsMap — Noticias del mundo',
  description: 'Noticias mundiales ubicadas en un mapa interactivo.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
