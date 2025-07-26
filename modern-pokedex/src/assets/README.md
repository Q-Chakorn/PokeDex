# Assets Directory

This directory contains all static assets organized by type and purpose.

## Structure

src/assets/
├── data/
│   └── pokemon_kanto_dataset.json
├── images/
│   ├── icons/
│   ├── pokemon/
│   └── ui/
│       └── react.svg
├── styles/
└── README.md
```

## Data Files

### Pokemon Dataset
- `pokemon_kanto_dataset.json` - Complete Kanto region Pokemon data
- Contains 151 Pokemon with stats, types, abilities, and moves

## Images

### Icons
- App icons and favicons
- Type icons for Pokemon types
- UI icons for buttons and navigation

### Pokemon Images
- Official Pokemon artwork
- Sprite images for cards and lists
- High-resolution images for detail views

### UI Graphics
- Background images
- Decorative elements
- Loading animations

## Styles

### Global Styles
- CSS custom properties
- Global utility classes
- Theme variables

## Usage

### Importing Data
```typescript
import pokemonData from '@/assets/data/pokemon_kanto_dataset.json';
```

### Importing Images
```typescript
import logo from '@/assets/images/ui/logo.svg';
import pikachuImage from '@/assets/images/pokemon/pikachu.png';
```

### Image Optimization

- Use WebP format when possible
- Provide fallbacks for older browsers
- Optimize file sizes for web delivery
- Use responsive images for different screen sizes

## File Naming Conventions

### Data Files
- Use descriptive names: `pokemon_kanto_dataset.json`
- Include version if applicable: `pokemon_data_v2.json`

### Images
- Use kebab-case: `pokemon-logo.svg`
- Include size if multiple versions: `icon-24x24.png`
- Use descriptive names: `pikachu-artwork.png`

### Styles
- Use kebab-case: `global-styles.css`
- Prefix with purpose: `theme-variables.css`

## Performance Considerations

- Optimize image sizes for web
- Use appropriate formats (SVG for icons, WebP for photos)
- Implement lazy loading for large images
- Consider using CDN for static assets

## Adding New Assets

1. Place files in appropriate subdirectory
2. Follow naming conventions
3. Optimize for web delivery
4. Update this README if adding new categories
5. Test imports in components
