# Museum Cards Implementation Guide

## Status
✅ Directories created for all 30 designs
⏳ Need to create index.tsx files for each design
⏳ Need to add CSS styles to premium-cards.css
⏳ Need to update registry.ts

## Directory Structure Created
All 30 folders have been created in `src/components/businesscard/designs/`:
- bauhaus-architect, perfumer, brutalist-gallerist, master-woodworker, cyber-hacker
- victorian-typographer, metaverse-architect, vinyl-producer-70s, streetwear-tokyo, sommelier-minimal
- aerospace-engineer, fashion-avant-garde, analog-photographer, wealth-manager, ai-artist-generative
- ceramic-master, sound-architect, textile-weaver, stained-glass, topographical-mapper
- paper-engineer, cyanotype-botanist, arcade-developer, celestial-navigator, kinetic-sculptor
- optician, thermal-imager, cinema-ticket, cryptographer, neon-sculptor

## Implementation Instructions

### Step 1: Create React Components
For each design folder, create an `index.tsx` file following this pattern:

```typescript
import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function DesignName({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  
  return (
    <div className={`${baseClass} card--design-name !p-0`}>
      <div className="card card-XX w-full h-full">
        {/* Card content based on HTML design */}
        <div className="card-XX-header">
          <FitText className="card-XX-name">{name}</FitText>
        </div>
        {/* Add other elements */}
      </div>
    </div>
  );
}
```

### Step 2: Convert HTML/CSS to React Components

#### Source Files
- Read `dist/assets/museum-business-cards.html` for designs 1-15
- Read `dist/assets/business-cards-illusionist.html` for designs 16-30

#### Conversion Rules
1. Convert HTML class names to React className
2. Extract CSS from `.card.classname` selectors
3. Use FitText component for dynamic text
4. Preserve ::before and ::after pseudo-elements
5. Keep all advanced CSS (backdrop-filter, clip-path, mix-blend-mode, etc.)
6. Assign sequential card numbers (card-32 through card-61)

### Step 3: Add CSS to premium-cards.css

Add styles at the end of `src/components/businesscard/premium-cards.css`:

```css
/* ============================================
   CARD 32: BAUHAUS ARCHITECT
   ============================================ */
.card-32 {
    /* Convert .bauhaus styles from HTML */
}

/* Continue for all 30 designs... */
```

### Step 4: Update Registry

Add to `src/components/businesscard/designs/registry.ts`:

```typescript
export const DESIGN_REGISTRY: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  // ... existing designs ...
  "bauhaus-architect": lazy(() => import("./bauhaus-architect")),
  "perfumer": lazy(() => import("./perfumer")),
  // ... add all 30 new designs ...
};
```

## Design Mapping

### Museum Cards (card-32 to card-46)
| Card # | Folder Name | HTML Class | Description |
|--------|-------------|------------|-------------|
| 32 | bauhaus-architect | .bauhaus | Geometric shapes, primary colors |
| 33 | perfumer | .perfumer | Glassmorphism, gradient background |
| 34 | brutalist-gallerist | .brutalist | Concrete texture, yellow accents |
| 35 | master-woodworker | .woodworker | Wood grain, warm browns |
| 36 | cyber-hacker | .hacker | Matrix green, terminal aesthetic |
| 37 | victorian-typographer | .victorian | Ornate borders, serif fonts |
| 38 | metaverse-architect | .metaverse | 3D isometric layers |
| 39 | vinyl-producer-70s | .vinyl | Vinyl record design |
| 40 | streetwear-tokyo | .streetwear | Holographic gradient |
| 41 | sommelier-minimal | .sommelier | Wine theme, minimal |
| 42 | aerospace-engineer | .blueprint | Blueprint grid |
| 43 | fashion-avant-garde | .fashion | Gradient overlay |
| 44 | analog-photographer | .photographer | Film strip borders |
| 45 | wealth-manager | .wealth | Gold on dark green |
| 46 | ai-artist-generative | .ai-artist | Morphing blobs |

### Illusionist Cards (card-47 to card-61)
| Card # | Folder Name | HTML Class | Description |
|--------|-------------|------------|-------------|
| 47 | ceramic-master | .ceramic | Kintsugi gold cracks |
| 48 | sound-architect | .sound | Concentric sound waves |
| 49 | textile-weaver | .textile | Woven fabric pattern |
| 50 | stained-glass | .glass | Colorful mosaic |
| 51 | topographical-mapper | .topo | Contour lines |
| 52 | paper-engineer | .origami | Folded paper effect |
| 53 | cyanotype-botanist | .cyanotype | Blue botanical prints |
| 54 | arcade-developer | .arcade | 8-bit pixel borders |
| 55 | celestial-navigator | .celestial | Orbital rings |
| 56 | kinetic-sculptor | .mobile | Calder mobile shapes |
| 57 | optician | .optician | Eye chart design |
| 58 | thermal-imager | .thermal | Heat map gradients |
| 59 | cinema-ticket | .ticket | Perforated ticket stub |
| 60 | cryptographer | .cipher | Code cipher background |
| 61 | neon-sculptor | .neon | Neon tube lighting |

## Testing Checklist
- [ ] All 30 components render without errors
- [ ] Vietnamese names display correctly (2/3/4 words)
- [ ] Text fits within card boundaries
- [ ] Advanced CSS effects work (backdrop-filter, clip-path, etc.)
- [ ] Cards scale properly in gallery view
- [ ] Export functionality works for all designs

## Notes
- Existing card numbers go up to card-31
- New cards start at card-32
- Maintain 300×533px (9:16) aspect ratio
- Use existing FitText component for text scaling
- Preserve all visual effects from HTML versions
