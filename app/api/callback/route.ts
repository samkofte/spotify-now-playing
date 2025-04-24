import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export async function GET(request: Request) {
  try {
    const { origin } = new URL(request.url);
    const redirect_uri = `${origin}/api/callback`;
    const cookieStore = await cookies();
    const searchParams = new URL(request.url).searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.redirect(`${origin}/`);
    }

    // Token al
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri
      }).toString()
    });

    if (!tokenResponse.ok) {
      console.error('Token alma hatası:', await tokenResponse.text());
      return NextResponse.redirect(`${origin}/?error=token_error`);
    }

    const tokenData = await tokenResponse.json();

    // Cookie'leri ayarla
    const response = NextResponse.redirect(`${origin}/`);
    
    response.cookies.set('spotify_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 saat
    });

    if (tokenData.refresh_token) {
      response.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30 gün
      });
    }

    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${origin}/?error=callback_error`);
  }
} 