'use client';

export default function SidebarSuggestions() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Suggested Creators</h3>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-sm">Creator {i}</p>
              <p className="text-xs text-gray-500">12.3K followers</p>
            </div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}