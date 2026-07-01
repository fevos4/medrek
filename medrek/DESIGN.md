---
name: Heritage Modern
colors:
  surface: '#fff8f3'
  surface-dim: '#e2d9ce'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf2e7'
  surface-container: '#f6ece1'
  surface-container-high: '#f1e7dc'
  surface-container-highest: '#ebe1d6'
  on-surface: '#1f1b14'
  on-surface-variant: '#4e453c'
  inverse-surface: '#353028'
  inverse-on-surface: '#f9efe4'
  outline: '#80756b'
  outline-variant: '#d1c4b9'
  surface-tint: '#725a3d'
  primary: '#080300'
  on-primary: '#ffffff'
  primary-container: '#2b1a04'
  on-primary-container: '#9c8161'
  inverse-primary: '#e1c19e'
  secondary: '#7d562d'
  on-secondary: '#ffffff'
  secondary-container: '#ffca98'
  on-secondary-container: '#7a532a'
  tertiary: '#030400'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1f09'
  on-tertiary-container: '#848869'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffddb9'
  primary-fixed-dim: '#e1c19e'
  on-primary-fixed: '#291803'
  on-primary-fixed-variant: '#594328'
  secondary-fixed: '#ffdcbd'
  secondary-fixed-dim: '#f0bd8b'
  on-secondary-fixed: '#2c1600'
  on-secondary-fixed-variant: '#623f18'
  tertiary-fixed: '#e1e6c2'
  tertiary-fixed-dim: '#c5c9a7'
  on-tertiary-fixed: '#1a1d07'
  on-tertiary-fixed-variant: '#45492f'
  background: '#fff8f3'
  on-background: '#1f1b14'
  surface-variant: '#ebe1d6'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm-amharic:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
  card-padding: 20px
  stack-gap: 12px
---

## Brand & Style

This design system is built for a digital community that bridges cultural heritage with modern social discourse. The personality is warm, communal, and grounded, drawing direct inspiration from Ethiopian aesthetics—specifically the rich, earthy tones of traditional textiles and natural landscapes.

The visual style is a sophisticated blend of **Modern / Corporate** structure and **Tactile** warmth. It utilizes a card-centric layout to organize information clearly, while the color palette and subtle borders evoke a sense of quality and permanence. The system is designed to be highly legible in a bilingual context, ensuring that both Latin and Ge'ez scripts feel like equal citizens within the interface.

## Colors

The palette is anchored in deep umbers and warm creams, moving away from clinical greys to create a "digital hearth" environment.

- **Primary:** A deep, near-black coffee bean brown used for navigation headers, primary text, and high-impact buttons.
- **Secondary:** A muted ochre/gold used for secondary actions, accents, and highlighting community tags.
- **Backgrounds:** The interface uses a tiered system of creams. The base page background is a soft parchment, while content cards use pure white to pop against the warmth.
- **Semantic Accents:** Borders use a very low-contrast version of the primary brown to maintain structure without harshness.

## Typography

The system uses **Plus Jakarta Sans** for its friendly yet professional geometry, which pairs exceptionally well with the rounded forms of the Ge'ez script used for Amharic. 

**Bilingual Hierarchy:** 
In bilingual blocks, English text takes the lead weight (Semi-bold/Bold), followed immediately by the Amharic translation in a slightly smaller, regular weight. This ensures that the dense nature of the Ge'ez script doesn't overwhelm the Latin characters while remaining perfectly legible.

**Usage:**
- **Headlines:** Reserved for post titles and section headers.
- **Labels:** Small, all-caps Inter is used for metadata like "3 hours ago" or "Community Rules" to provide a technical contrast to the warmer body text.

## Layout & Spacing

This design system follows a **Fixed Grid** philosophy for desktop to maintain a readable line length for long-form community posts.

- **Grid Structure:** A 12-column system is used. On desktop, the sidebar takes 3 columns, the main feed takes 6 columns, and the utility/sidebar-right takes 3 columns.
- **The "Thread" Stack:** Vertical spacing between cards is kept tight (12px) to signify a continuous stream of conversation, while internal card padding is generous (20px) to ensure content has room to breathe.
- **Responsive Behavior:** On mobile, the sidebars collapse into a drawer or bottom navigation, and the margins reduce to 16px. Cards become full-width to maximize screen real estate.

## Elevation & Depth

Depth is conveyed through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Base Layer:** The parchment background (#FAF6F1).
- **Raised Layer:** White surface cards (#FFFFFF) with a thin, 1px border in a muted tan. This creates a physical sense of "paper on a desk."
- **Interaction Layer:** Subtle, soft shadows (4px blur, 2% opacity) are applied only on hover to interactive cards to provide tactile feedback without cluttering the aesthetic.
- **Overlay Layer:** Modals and dropdown menus use a deep Primary Brown background with high-contrast gold text to signal a shift in focus.

## Shapes

The shape language is consistently **Rounded**. 

- **Primary Radius:** A base of 8px (0.5rem) is used for all content cards and input fields.
- **Large Radius:** 16px (1rem) is used for the "Create Community" dash-bordered cards and major layout containers.
- **Pill Shapes:** Used exclusively for tags, chips (e.g., "Hot", "New"), and primary "Sign Up" buttons to distinguish them from the structural rectangular cards.

## Components

### Buttons
- **Primary:** Solid Primary Brown with Gold text. Pill-shaped.
- **Secondary:** Transparent with a Gold 1px border or solid Gold with Brown text.
- **Ghost:** No border, Primary Brown text, used for secondary actions like "Share" or "Report."

### Cards
- Standard feed cards must feature a left-aligned voting rail separated by a subtle vertical line or distinct background tint.
- Header cards (like "Platform Rules") use a Primary Brown header bar with Gold text to denote authority.

### Tags / Chips
- Community tags (e.g., "Tech Ethiopia") use a Secondary Color background with an 8px radius. They act as the primary navigational anchor within a feed card.

### Inputs
- Search bars and text areas use a soft tan background with a subtle inset border. The focus state shifts the border to the Primary Brown.

### Vote Controls
- Vertical orientation. Arrows are minimal line icons. The score count uses a bold weight to remain legible at small sizes.