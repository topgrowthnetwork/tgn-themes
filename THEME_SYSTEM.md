# Theme System Documentation

This project now supports multiple eCommerce themes controlled by an environment variable. Only one theme is included per build, making the final bundle smaller and more efficient.

## How It Works

### Environment Variable

Set the `THEME` environment variable to control which theme is used:

```bash
# For minimal theme (default)
THEME=minimal npm run build

# For active theme
THEME=active npm run build
```

### Webpack Aliases

The system uses Webpack aliases to automatically resolve theme components:

- `@theme/*` → `components/themes/{THEME}/*`
- `@shared/*` → `components/shared/*`

## Usage Examples

### Importing Theme Components

```typescript
// This will import from the current theme (minimal or active)
import { Carousel } from '@theme/carousel';
import { Navbar } from '@theme/layout/navbar';
import { ProductDescription } from '@theme/product/product-description';
```

### Importing Shared Components

```typescript
// These are shared across all themes
import { Button } from '@shared/Button';
import { Modal } from '@shared/Modal';
import { addItemV2 } from '@shared/cart-actions';
```

### Before vs After

#### Before (Hardcoded paths):

```typescript
import { Carousel } from '@theme/carousel';
import { Navbar } from '@theme/layout/navbar';
```

#### After (Theme aliases):

```typescript
import { Carousel } from '@theme/carousel';
import { Navbar } from '@theme/layout/navbar';
```

## Available Themes

### 1. Minimal Theme (`THEME=minimal`)

- Clean, simple design
- Monochromatic color scheme
- Minimal animations and effects
- Professional, understated appearance

### 2. Active Theme (`THEME=active`)

- Colorful, modern design
- Rich visual elements
- Complex animations
- Bold, contemporary appearance

## Building Different Themes

### Development

```bash
# Run with minimal theme
THEME=minimal npm run dev

# Run with active theme
THEME=active npm run dev
```

### Production Build

```bash
# Build minimal theme
THEME=minimal npm run build

# Build active theme
THEME=active npm run build
```

## Adding New Themes

1. Create a new theme directory: `components/themes/{theme-name}/`
2. Copy the structure from an existing theme
3. Customize components as needed
4. Build with: `THEME={theme-name} npm run build`

## Benefits

- **Smaller Bundle Size**: Only one theme is included per build
- **Better Performance**: No unused theme code in production
- **Easier Maintenance**: Clear separation between themes
- **Flexible Deployment**: Different themes for different environments
- **No Runtime Overhead**: No theme switching logic needed

## Migration Guide

To migrate existing code to use the new theme system:

1. Replace hardcoded theme paths with `@theme` aliases
2. Move shared functionality to `@shared`
3. Update environment variables for different builds
4. Test with different themes

Example migration:

```typescript
// Old
import { Carousel } from '@theme/carousel';

// New
import { Carousel } from '@theme/carousel';
```
