import React from 'react';

function Loading({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-primary mx-auto mb-4"></div>
        <p className="text-slate-gray text-lg">{message}</p>
      </div>
    </div>
  );
}

export default Loading; 