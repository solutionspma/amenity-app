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
      <body className={`${inter.className} h-full bg-amenity-50 dark:bg-amenity-900`}>
        <Providers>
          <div className="flex h-full">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:flex-shrink-0">
              <Navigation />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
                {children}
              </main>
              
              {/* Mobile Navigation */}
              <div className="lg:hidden">
                <MobileNav />
              </div>
            </div>
          </div>
          
          {/* Global Toast Notifications */}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}