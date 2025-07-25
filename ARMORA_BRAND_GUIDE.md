# Armora Brand Style Guide

## Brand Identity

### App Name
**Armora** - Premium Security Transport

### Brand Positioning
"Protection-first" security transport services with SIA-licensed close protection officers.

## Color Palette

### Primary Colors
- **Midnight Navy**: `#0A1F3D`
  - Primary brand color
  - Used for headers, primary buttons, navigation
  - Hex: #0A1F3D
  - RGB: 10, 31, 61
  - Dark variant: #081729
  - Light variant: #0D2851

- **Royal Cyan**: `#0FD3E3`
  - Accent color
  - Used for highlights, secondary buttons, icons
  - Hex: #0FD3E3
  - RGB: 15, 211, 227
  - Light variant: #3FDCE9
  - Dark variant: #0CB8C6

### Neutral Colors
- **Arctic Grey**: `#F4F6F8`
  - Background color
  - Used for main app background
  
- **Charcoal**: `#222222`
  - Primary text color
  - Headers and body text

- **White**: `#FFFFFF`
  - Card backgrounds
  - Surface color

### Status Colors
- **Success**: `#10B981` (Keep existing)
- **Warning**: `#F59E0B` (Keep existing)
- **Error**: `#EF4444` (Keep existing)
- **Info**: `#0FD3E3` (Royal Cyan)

## Typography

### Font Family
- **Primary**: System Default (Inter/SF Pro style)
- Modern, clean sans-serif
- Excellent readability
- Professional appearance

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Text Hierarchy
- **Display Large**: 32px, Bold (700)
- **Display Medium**: 28px, Bold (700)
- **Headline Large**: 20px, Semibold (600)
- **Headline Medium**: 18px, Semibold (600)
- **Body Large**: 16px, Regular (400)
- **Body Medium**: 14px, Regular (400)
- **Caption**: 12px, Medium (500)

## Component Styling

### Buttons
#### Primary Button
- Background: Midnight Navy (#0A1F3D)
- Text: White (#FFFFFF)
- Border Radius: 12px
- Padding: 16px vertical, 24px horizontal
- Shadow: 0px 2px 8px rgba(10, 31, 61, 0.2)

#### Secondary Button
- Background: Royal Cyan (#0FD3E3)
- Text: Midnight Navy (#0A1F3D)
- Border Radius: 12px
- Padding: 16px vertical, 24px horizontal
- Shadow: 0px 2px 8px rgba(15, 211, 227, 0.2)

#### Outline Button
- Background: Transparent
- Border: 2px solid Midnight Navy (#0A1F3D)
- Text: Midnight Navy (#0A1F3D)
- Border Radius: 12px
- Padding: 14px vertical, 22px horizontal

### Cards
- Background: White (#FFFFFF)
- Border Radius: 16px
- Border: 1px solid #E8E8E8
- Shadow: 0px 2px 8px rgba(0, 0, 0, 0.1)
- Padding: 20px

### Navigation
- Background: White (#FFFFFF)
- Border: 1px solid #E8E8E8
- Active Tab: Royal Cyan (#0FD3E3)
- Inactive Tab: #666666

## Gradient Usage

### Brand Gradient
- **Start**: Midnight Navy (#0A1F3D)
- **End**: Royal Cyan (#0FD3E3)
- **Direction**: 45 degrees (diagonal)
- **Usage**: Premium buttons, hero sections, splash screens

### Implementation Example
```css
background: linear-gradient(45deg, #0A1F3D 0%, #0FD3E3 100%);
```

## Dark Mode

### Background Colors
- **Primary Background**: Midnight Navy (#0A1F3D)
- **Card Background**: Lighter Navy (#0D2851)
- **Surface**: Dark Navy (#081729)

### Text Colors
- **Primary Text**: White (#FFFFFF)
- **Secondary Text**: #B0B0B0
- **Accent Text**: Royal Cyan (#0FD3E3)

## Spacing System

### Padding/Margin Scale
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

### Border Radius Scale
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **round**: 50% (for circular elements)

## Icon Guidelines

### Icon Style
- Outline style preferred
- 2px stroke width
- Ionicons library
- Royal Cyan (#0FD3E3) for active/accent icons
- Charcoal (#222222) for regular icons

### Common Icon Colors
- **Active/Selected**: Royal Cyan (#0FD3E3)
- **Default**: Charcoal (#222222)
- **Disabled**: #BDBDBD
- **Success**: #10B981
- **Warning**: #F59E0B
- **Error**: #EF4444

## Shadow System

### Card Shadows
```css
/* Small Shadow */
shadowColor: '#000000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.05,
shadowRadius: 2,
elevation: 1

/* Medium Shadow */
shadowColor: '#000000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3

/* Large Shadow */
shadowColor: '#000000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.15,
shadowRadius: 8,
elevation: 5
```

## Usage Guidelines

### Do's
✅ Use Midnight Navy for primary actions and branding
✅ Use Royal Cyan for highlights and secondary actions
✅ Maintain consistent spacing using the spacing system
✅ Use the gradient sparingly for premium elements
✅ Ensure sufficient contrast for accessibility

### Don'ts
❌ Don't use the old green (#00C851) color
❌ Don't mix Armora colors with other brand colors
❌ Don't use gradients excessively
❌ Don't compromise readability for aesthetics
❌ Don't use custom fonts without approval

## Accessibility

### Color Contrast
- All text must meet WCAG AA standards (4.5:1 ratio)
- Midnight Navy on white: ✅ Excellent contrast
- Royal Cyan on white: ✅ Good contrast
- White on Midnight Navy: ✅ Excellent contrast

### Touch Targets
- Minimum 44px × 44px for all interactive elements
- Adequate spacing between touch targets

## Implementation Notes

### Theme Integration
All colors are centralized in `/theme/index.js` and should be used via the theme object:

```javascript
import theme from '../theme';

// Use theme colors
backgroundColor: theme.colors.primary, // Midnight Navy
color: theme.colors.secondary, // Royal Cyan
```

### Migration from GQCars
The following colors have been updated:
- Old Primary: `#007AFF` → New Primary: `#0A1F3D`
- Old Secondary: `#FF6B35` → New Secondary: `#0FD3E3`
- Old Success: `#00C851` → New Info/Accent: `#0FD3E3`

## Version
- **Version**: 1.0
- **Last Updated**: 2025-01-25
- **Status**: Active