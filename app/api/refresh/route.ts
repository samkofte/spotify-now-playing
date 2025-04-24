import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('spotify_refresh_token');

    if (!refreshToken) {
      return NextResponse.json({ error: 'invalid_request', message: 'No refresh token' });
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken.value
      }).toString()
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'refresh_failed', message: 'Token refresh failed' });
    }

    const data = await response.json();
    
    // Yeni access token'ı cookie'ye kaydet
    const result = NextResponse.json({ success: true });
    result.cookies.set('spotify_access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 saat
    });

    return result;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'refresh_failed', message: 'Token refresh failed' });
  }
} 