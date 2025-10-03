# bitl.site - Simple URL Shortener

A minimalist URL shortening service built with React, Tailwind CSS, and Supabase. Transform long URLs into short, shareable links with QR codes.

## Features

- ✨ **Instant URL Shortening** - No registration required
- 📱 **QR Code Generation** - Every short URL comes with a scannable QR code
- 🎨 **Minimalist Design** - Clean, distraction-free interface
- 📱 **Mobile-First** - Responsive design that works on all devices
- ⚡ **Fast & Lightweight** - Optimized for performance
- 🔒 **Privacy-Focused** - No user tracking or analytics

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + REST API)
- **Styling**: Tailwind CSS with Inter font
- **QR Codes**: qrcode.js
- **Routing**: React Router
- **Deployment**: Netlify (frontend), Supabase (backend)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for production)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bitl-shortener
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. For production, update `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=https://your-domain.com
```

5. Set up the database (see `supabase-setup.md`)

6. Start the development server:
```bash
npm run dev
```

## Database Setup

See `supabase-setup.md` for detailed instructions on setting up the Supabase database.

## Deployment

### Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

### Environment Variables

Make sure to set these in your Netlify dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Logo.jsx
│   ├── Footer.jsx
│   ├── URLForm.jsx
│   ├── CopyButton.jsx
│   ├── QRCodeDisplay.jsx
│   └── ShortURLDisplay.jsx
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── ResultPage.jsx
│   └── RedirectPage.jsx
├── services/           # API services
│   └── urlService.js
├── lib/               # Third-party integrations
│   └── supabase.js
├── utils/             # Utility functions
│   └── helpers.js
└── App.jsx            # Main app component
```

## API Endpoints

- `POST /urls` - Create shortened URL
- `GET /s/{short_id}` - Redirect to original URL

## Features in Detail

### URL Shortening
- Validates input URL format
- Generates unique 6-character short IDs
- Stores mappings in Supabase PostgreSQL

### QR Code Generation
- Automatic QR code generation for each short URL
- High-contrast, scannable codes
- Mobile-optimized sizing

### Mobile Responsiveness
- Mobile-first design approach
- Touch-friendly interface elements
- Responsive grid layouts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please open an issue on GitHub.

---

**bitl.site** - Simple, fast, and reliable URL shortening service.