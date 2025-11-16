import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Amenity Platform',
  description: 'Faith-based social network',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div style={{ padding: '20px', background: '#000', color: '#fff', minHeight: '100vh' }}>
          <h1>Amenity Platform - Minimal Layout Test</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
