'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the correct profile route
    router.replace('/profiles/me');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">👤</div>
        <h1 className="text-2xl font-bold text-white mb-2">Redirecting to Profile...</h1>
        <p className="text-gray-300">Taking you to your profile page</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    </div>
  );
}