# Theme Setup Guide

## Environment Variables

Create a `.env.local` file in your project root and add:

```bash
# Theme Configuration
# Set to one of: active, minimal, classic
NEXT_PUBLIC_THEME=active

# Your other environment variables...
# NEXT_PUBLIC_BIGCOMMERCE_STORE_HASH=your_store_hash
# NEXT_PUBLIC_BIGCOMMERCE_STOREFRONT_API_TOKEN=your_token
# NEXT_PUBLIC_BIGCOMMERCE_CHANNEL_ID=your_channel_id
```

## Available Themes

### Active Theme (Default)

- **Colors**: Blue color palette
- **Border Radius**: 12px (rounded)
- **Fonts**: Inter for English, Noto Sans Arabic for Arabic

### Minimal Theme

- **Colors**: Gray color palette
- **Border Radius**: 6px (subtle)
- **Fonts**: Inter for English, Noto Sans Arabic for Arabic

### Classic Theme

- **Colors**: Red color palette
- **Border Radius**: 2px (sharp)
- **Fonts**: Georgia for English, Noto Serif Arabic for Arabic

## Testing Themes

1. Set the environment variable
2. Restart your development server
3. Visit `/theme-demo` to see the theme in action

## Deployment

Set the `NEXT_PUBLIC_THEME` environment variable in your deployment platform (Vercel, Netlify, etc.) to switch themes.
