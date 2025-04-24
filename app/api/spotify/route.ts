import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function refreshToken() {
  const response = await fetch('http://localhost:3000/api/refresh');
  return response.json();
}

export async function GET(request: Request) {
  // URL'den token'ı al
  const { searchParams } = new URL(request.url);
  const urlToken = searchParams.get('token');

  let accessToken;

  if (urlToken) {
    // URL'den gelen token'ı kullan
    accessToken = { value: urlToken };
  } else {
    // Cookie'den token'ı al
    const cookieStore = await cookies();
    accessToken = cookieStore.get('spotify_access_token');
  }

  // Token yoksa hata döndür
  if (!accessToken) {
    return NextResponse.json({ error: 'invalid_request', message: 'No access token' });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    });

    // 401 hatası alırsak token'ı yenilemeyi dene
    if (response.status === 401) {
      console.log('Token expired, attempting refresh...');
      const refreshResult = await refreshToken();
      
      if (refreshResult.error) {
        return NextResponse.json({ error: 'invalid_request', message: 'Token refresh failed' });
      }

      // Yeni token ile tekrar dene
      const retryResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Authorization': `Bearer ${refreshResult.access_token}`
        }
      });

      if (!retryResponse.ok) {
        return NextResponse.json({ error: 'invalid_request', message: 'API request failed after token refresh' });
      }

      // Şarkı çalmıyorsa 204 döner
      if (retryResponse.status === 204) {
        return NextResponse.json({ isPlaying: false });
      }

      const data = await retryResponse.json();
      return NextResponse.json({
        isPlaying: data.is_playing,
        name: data.item?.name,
        artist: data.item?.artists[0]?.name,
        albumArt: data.item?.album?.images[0]?.url
      });
    }

    // Şarkı çalmıyorsa 204 döner
    if (response.status === 204) {
      return NextResponse.json({ isPlaying: false });
    }

    const data = await response.json();

    return NextResponse.json({
      isPlaying: data.is_playing,
      name: data.item?.name,
      artist: data.item?.artists[0]?.name,
      albumArt: data.item?.album?.images[0]?.url
    });
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    return NextResponse.json({ error: 'invalid_request', message: 'Failed to fetch' });
  }
} 