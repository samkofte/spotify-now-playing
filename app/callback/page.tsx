'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Callback() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      // Exchange the code for tokens
      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa('d7417bfd00cf49538cb4cfa98e0017d9:dd9a1812706e4544a938e9a972957783')
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'http://localhost:3000/callback',
        }).toString()
      })
      .then(response => response.json())
      .then(data => {
        if (data.refresh_token) {
          setToken(data.refresh_token);
        } else {
          setError('No refresh token received');
        }
      })
      .catch(err => {
        setError(err.message);
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full">
        <h1 className="text-white text-2xl font-bold mb-4">Spotify Authorization</h1>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : token ? (
          <div className="space-y-4">
            <p className="text-white">Your refresh token is:</p>
            <pre className="bg-black/50 p-4 rounded text-green-400 break-all whitespace-pre-wrap">
              {token}
            </pre>
            <p className="text-gray-400 text-sm">
              Copy this token and add it to your .env.local file as SPOTIFY_REFRESH_TOKEN
            </p>
          </div>
        ) : (
          <div className="text-white">Loading...</div>
        )}
      </div>
    </div>
  );
} 