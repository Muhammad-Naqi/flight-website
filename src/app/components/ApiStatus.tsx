'use client';

import { useEffect, useState } from 'react';

export default function ApiStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkApi = async () => {
      // Use 127.0.0.1 instead of localhost to avoid IPv6 issues
      let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      if (apiUrl.includes('localhost') && !apiUrl.includes('127.0.0.1')) {
        apiUrl = apiUrl.replace('localhost', '127.0.0.1');
      }

      try {
        const response = await fetch(`${apiUrl}/blogs?page=1&limit=1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          setStatus('online');
        } else {
          const errorData = await response.json().catch(() => ({}));
          setStatus('offline');
          setError(
            `API returned status ${response.status}: ${errorData.message || response.statusText}`
          );
        }
      } catch (err: any) {
        setStatus('offline');
        let errorMsg = err.message || 'Cannot connect to API';
        if (err.message?.includes('ECONNREFUSED') || err.message?.includes('Failed to fetch')) {
          errorMsg = `Backend API is not running or not accessible at ${apiUrl}. Please start your backend server.`;
        }
        setError(errorMsg);
      }
    };

    checkApi();
  }, []);

  if (status === 'checking') {
    return null;
  }

  if (status === 'offline') {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-400">⚠️</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              <strong>API Connection Error:</strong> Cannot connect to backend API at{' '}
              <code className="bg-red-100 px-1 rounded">
                {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}
              </code>
            </p>
            {error && <p className="text-sm text-red-600 mt-1">Error: {error}</p>}
            <p className="text-sm text-red-600 mt-2">
              Please make sure your backend API is running and accessible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
