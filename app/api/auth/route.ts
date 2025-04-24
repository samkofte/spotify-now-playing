import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const scope = 'user-read-currently-playing user-read-playback-state';

// Spotify Developer Dashboard'da tanımlı olan callback URL'i kullan
const CALLBACK_PATH = '/api/callback';

export async function GET(request: Request) {
  try {
    const { origin } = new URL(request.url);
    const callbackUrl = `${origin}${CALLBACK_PATH}`;

    // Önce mevcut token'ları temizle
    const response = NextResponse.redirect('https://accounts.spotify.com/authorize');
    response.cookies.delete('spotify_access_token');
    response.cookies.delete('spotify_refresh_token');

    // Spotify auth URL'ini oluştur
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', client_id!);
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('redirect_uri', callbackUrl);
    authUrl.searchParams.append('state', Math.random().toString(36).substring(7));
    authUrl.searchParams.append('show_dialog', 'true'); // Her zaman hesap seçim ekranını göster

    // Spotify'a yönlendir
    response.headers.set('Location', authUrl.toString());
    return response;
  } catch (error) {
    console.error('Auth error:', error);
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/?error=auth_error`);
  }
} 