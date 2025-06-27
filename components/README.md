# Components Organization

This directory is organized into a theme-based structure to support multiple visual themes for the application.

## Structure

```
/components
  /shared           # Used across all themes
    Button.tsx
    Modal.tsx
    Header.tsx
    loading-dots.tsx
    price.tsx
    label.tsx
    notification-message.tsx
    json-viewer.tsx
    prose.tsx
    index.ts

  /themes
    /active         # Current active theme (all existing components)
      /cart/
      /grid/
      /icons/
      /layout/
      /product/
      /theme/
      carousel.tsx
      logo-square.tsx
      opengraph-image.tsx
      loading-dots.tsx
      price.tsx
      label.tsx
      notification-message.tsx
      json-viewer.tsx
      prose.tsx
      index.ts

    /minimal        # Minimal theme
      ProductCard.tsx
      Navbar.tsx
      index.ts

    index.ts        # Main themes index
```

## Usage

### Importing Shared Components

```typescript
import { Button, Modal, Header } from '@/components/shared';
```

### Importing Theme-Specific Components

```typescript
// Import from active theme
import { Carousel, ProductGallery } from '@theme';

// Import from minimal theme
import { ProductCard, Navbar } from '@/components/themes/minimal';

// Or import all themes
import { active, minimal } from '@/components/themes';
```

## Adding New Components

### Shared Components

- Place in `/components/shared/`
- Add to `/components/shared/index.ts`
- Use across all themes

### Theme-Specific Components

- Place in `/components/themes/{theme-name}/`
- Add to `/components/themes/{theme-name}/index.ts`
- Only used by that specific theme

## Theme Switching

The theme system allows for easy switching between different visual styles while maintaining the same functionality. Each theme can have its own:

- Component implementations
- Styling approaches
- Layout variations
- Visual design patterns

All themes share the same shared components for consistency in core functionality.
