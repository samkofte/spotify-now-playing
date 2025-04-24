/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
  },
  images: {
    domains: ['i.scdn.co'], // Spotify'ın CDN'ine izin ver
  },
};

module.exports = nextConfig; 