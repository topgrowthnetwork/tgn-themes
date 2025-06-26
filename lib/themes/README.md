# Theme System

This theme system allows you to switch between different visual themes for your eCommerce application using environment variables. The system is designed to be SSG-friendly and uses CSS custom properties with data attributes.

## Features

- **Environment-based theme selection**: Set `NEXT_PUBLIC_THEME` environment variable
- **SSG compatible**: Uses CSS custom properties and data attributes, perfect for static generation
- **Type-safe**: Full TypeScript support with theme validation
- **Extensible**: Easy to add new themes by updating CSS variables
- **Consistent**: Global border radius, colors, and typography

## Available Themes

- **active**: Blue color scheme with rounded corners (12px border radius)
- **minimal**: Gray color scheme with subtle corners (6px border radius)
- **classic**: Red color scheme with sharp corners (2px border radius)

## Usage

### Setting the Theme

Set the environment variable in your `.env.local` file:

```bash
NEXT_PUBLIC_THEME=active
```

Or in your deployment platform:

```bash
NEXT_PUBLIC_THEME=minimal
```

### Using Theme Colors

The theme colors are available as Tailwind classes with the `primary-` prefix:

```tsx
<div className="bg-primary-500 text-primary-900">
  <button className="bg-primary-600 hover:bg-primary-700">Click me</button>
</div>
```

### Using Theme Border Radius

Use the `rounded-theme` class for consistent border radius:

```tsx
<div className="rounded-theme bg-white p-4">Content with theme border radius</div>
```

### Using Theme Fonts

Use the theme font classes:

```tsx
<p className="font-theme-en">English text</p>
<p className="font-theme-ar">Arabic text</p>
```

### Using Theme Components

Import and use the theme-aware components:

```tsx
import { ThemeButton, ThemeCard } from 'components/theme';

export function MyComponent() {
  return (
    <ThemeCard>
      <h2>My Card</h2>
      <ThemeButton variant="primary">Click me</ThemeButton>
    </ThemeCard>
  );
}
```

## Adding New Themes

1. **Add CSS variables** in `app/globals.css`:

```css
/* Your New Theme */
[data-theme='myNewTheme'] {
  --theme-color-50: #f0f9ff;
  --theme-color-100: #e0f2fe;
  --theme-color-200: #bae6fd;
  --theme-color-300: #7dd3fc;
  --theme-color-400: #38bdf8;
  --theme-color-500: #0ea5e9;
  --theme-color-600: #0284c7;
  --theme-color-700: #0369a1;
  --theme-color-800: #075985;
  --theme-color-900: #0c4a6e;
  --theme-color-950: #082f49;
  --theme-font-en: 'Roboto, system-ui, sans-serif';
  --theme-font-ar: 'Noto Sans Arabic, system-ui, sans-serif';
  --theme-border-radius: 1rem;
}
```

2. **Set the environment variable**:

```bash
NEXT_PUBLIC_THEME=myNewTheme
```

## Theme Configuration

Each theme includes CSS custom properties for:

- **Colors**: 50-950 shade range for the primary color
- **Fonts**: Separate font families for English and Arabic
- **Border Radius**: Global border radius for consistent styling

## Demo Page

Visit `/theme-demo` to see all themes in action and test different components.

## Best Practices

1. **Use theme classes**: Prefer `primary-*` colors over hardcoded values
2. **Consistent border radius**: Use `rounded-theme` for cards, buttons, inputs
3. **Font families**: Use `font-theme-en` and `font-theme-ar` classes
4. **Component composition**: Use theme-aware components when possible
5. **Environment variables**: Always set `NEXT_PUBLIC_THEME` in your deployment

## How It Works

The theme system works by:

1. **Environment Variable**: `NEXT_PUBLIC_THEME` is read at build time
2. **Data Attribute**: The theme name is added as `data-theme` to the `<html>` element
3. **CSS Variables**: CSS custom properties are defined for each theme using data attribute selectors
4. **Tailwind Integration**: Tailwind classes use the CSS variables for colors, fonts, and border radius

## File Structure

```
app/
├── globals.css          # Theme CSS variables and data attributes

components/theme/
├── theme-card.tsx       # Theme-aware card component
├── theme-button.tsx     # Theme-aware button component
└── index.ts             # Component exports

lib/themes/
├── config.ts            # Theme types and validation
├── themes.ts            # Theme definitions (for reference)
├── loader.ts            # Theme loading functions (for reference)
├── index.ts             # Exports
└── README.md            # This file
```
