# Link in Bio - Eshaan Sood

A simple, single-page link-in-bio website hosted on GitHub Pages.

## Setup for GitHub Pages

1. Push this repository to GitHub
2. Go to your repository settings on GitHub
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select the branch (usually `main`) and folder (`/` root)
5. Click "Save"
6. Your site will be available at `https://[your-username].github.io/[repository-name]/`

## Local Development

Simply open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Customization

- Update the links in the `.links` section with your actual URLs
- Update the social media links in the footer with your profiles
- Modify the CSS variables in the `:root` selector to change the color scheme
