# Ghostcard

Generate beautiful story cards from Ghost blog posts. Paste a URL, customize the style, and export as PNG.

## Features

- **URL Fetching** - Paste any Ghost blog post URL to automatically extract title, excerpt, featured image, publish date, and read time
- **Multiple Themes** - Light, Dark, and Gradient color schemes
- **Multiple Layouts** - Standard, Overlay, and Minimal designs
- **PNG Export** - Download high-resolution images ready for social media
- **Static Deployment** - Works on GitHub Pages, Cloudflare Pages, or any static host

## Usage

1. Visit the app
2. Paste a Ghost blog post URL
3. Click "Fetch Post"
4. Choose your preferred theme and layout
5. Click "Export as PNG"

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Deployment

The project is configured for static export. After building, deploy the `out/` directory to any static hosting service.

### GitHub Pages

1. Push to GitHub
2. Go to Settings > Pages
3. Set source to GitHub Actions
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
      - uses: actions/deploy-pages@v4
```

### Cloudflare Pages

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `out`

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI components
- [html-to-image](https://github.com/bubkoo/html-to-image) - PNG export

## License

MIT
