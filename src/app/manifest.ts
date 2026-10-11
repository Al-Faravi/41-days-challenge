import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '41-Days Rewire',
    short_name: 'The Rewire',
    description: 'Secure your journey and rewire your mind.',
    start_url: '/',
    display: 'standalone',
    background_color: '#051726',
    theme_color: '#051726',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/effort.png', 
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/effort.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}