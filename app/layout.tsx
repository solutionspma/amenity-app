'use client';

import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Navigation from '@/components/Navigation';
import MobileNav from '@/components/MobileNav';
import { ToastContainer } from '@/components/ui/Toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <div className="min-h-full">
            {/* Main Content - Full Width */}
            <main className="min-h-screen">
              {children}
            </main>
            
            {/* Mobile Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
              <MobileNav />
            </div>
          </div>
          
          {/* Global Toast Notifications */}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}