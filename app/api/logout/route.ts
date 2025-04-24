import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  
  const response = NextResponse.redirect(`${origin}/`);
  
  // Token'ları temizle
  response.cookies.delete('spotify_access_token');
  response.cookies.delete('spotify_refresh_token');
  
  return response;
} 