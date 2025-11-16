'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RouterTest() {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const testNavigation = (path: string) => {
    addLog(`Testing navigation to: ${path}`);
    try {
      router.push(path);
      addLog(`✅ router.push('${path}') called successfully`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Router Test Page</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          onClick={() => testNavigation('/profiles/settings')}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
        >
          Test Profile Settings
        </button>
        <button 
          onClick={() => testNavigation('/profiles/me')}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Test Profile Me
        </button>
        <button 
          onClick={() => testNavigation('/messages')}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Test Messages
        </button>
        <button 
          onClick={() => testNavigation('/feed')}
          className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded"
        >
          Test Feed
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Navigation Logs:</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-400">No logs yet. Click a button to test navigation.</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-sm font-mono bg-gray-700 p-2 rounded">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}