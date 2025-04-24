# 🎵 Spotify Now Playing

A modern, responsive web application that displays your current Spotify playback status in real-time. Perfect for streamers, content creators, or anyone who wants to showcase their music taste.

![Spotify Now Playing](https://i.imgur.com/example.png)

## ✨ Features

- 🎵 Real-time Spotify playback status
- 🎨 Modern, responsive design
- 🌙 Dark/Light theme support
- ⚡ Fast and lightweight
- 🔒 Secure authentication
- 🎨 Customizable appearance
- 📱 Mobile-friendly interface
- 🔄 Auto-refresh functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- A Spotify Developer account
- A registered Spotify application

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/samkofte/spotify-now-playing.git
   cd spotify-now-playing
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Spotify credentials:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Spotify Developer Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Add `http://localhost:3000/callback` to the Redirect URIs
4. Copy the Client ID and Client Secret to your `.env.local` file

## 🎨 Customization

### Theme Options

The application supports both light and dark themes. You can customize the appearance by modifying the following files:

- `app/globals.css` - Global styles and theme variables
- `tailwind.config.ts` - Tailwind CSS configuration
- `app/components/PreviewOverlay.tsx` - Overlay component styling

### Layout Customization

You can adjust the layout and positioning of elements by modifying:

- `app/overlay/page.tsx` - Main overlay layout
- `app/components/PreviewOverlay.tsx` - Preview component layout

## 📱 Usage

1. Visit the application URL
2. Log in with your Spotify account
3. The overlay will automatically display your current playback status
4. Use the preview mode to see how it looks before adding to your stream

### OBS Setup

1. Add a Browser Source in OBS
2. Set the URL to your deployed application
3. Set the width and height according to your needs
4. Enable "Refresh browser when scene becomes active"

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPOTIFY_CLIENT_ID` | Your Spotify application client ID | Yes |
| `SPOTIFY_CLIENT_SECRET` | Your Spotify application client secret | Yes |
| `SPOTIFY_REDIRECT_URI` | OAuth redirect URI | Yes |

### Customization Options

You can customize various aspects of the application through the configuration files:

- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `app/globals.css` - Global styles and theme variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)

## 📧 Contact

Mert Samet Taş - [@samkofte](https://github.com/samkofte)

Project Link: [https://github.com/samkofte/spotify-now-playing](https://github.com/samkofte/spotify-now-playing)
