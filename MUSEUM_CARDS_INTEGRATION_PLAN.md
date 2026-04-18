# Museum Cards Integration Plan

## Overview
Integrating 30 premium card designs from two HTML galleries into the React app.

## Source Files
- `dist/assets/museum-business-cards.html` - 15 designs
- `dist/assets/business-cards-illusionist.html` - 15 designs

## Cards to Integrate

### From museum-business-cards.html (15 cards)
1. **bauhaus-architect** - Bauhaus style with geometric shapes
2. **perfumer** - Glassmorphism with gradient background
3. **brutalist-gallerist** - Concrete brutalist with yellow accents
4. **master-woodworker** - Wood grain texture with warm tones
5. **cyber-hacker** - Matrix-style green terminal aesthetic
6. **victorian-typographer** - Ornate Victorian with decorative borders
7. **metaverse-architect** - 3D isometric layers with neon
8. **vinyl-producer-70s** - Vinyl record design (different from existing)
9. **streetwear-tokyo** - Holographic gradient with Japanese text
10. **sommelier-minimal** - Minimalist wine theme
11. **aerospace-engineer** - Blueprint grid design
12. **fashion-avant-garde** - Gradient overlay fashion
13. **analog-photographer** - Film strip borders
14. **wealth-manager** - Luxury gold on dark green
15. **ai-artist-generative** - Morphing blob shapes

### From business-cards-illusionist.html (15 cards)
16. **ceramic-master** - Kintsugi gold cracks
17. **sound-architect** - Concentric sound waves
18. **textile-weaver** - Woven fabric pattern
19. **stained-glass** - Colorful mosaic panels
20. **topographical-mapper** - Contour line patterns
21. **paper-engineer** - Folded paper effect
22. **cyanotype-botanist** - Blue botanical prints
23. **arcade-developer** - 8-bit pixel art borders
24. **celestial-navigator** - Orbital rings and stars
25. **kinetic-sculptor** - Calder mobile with shapes
26. **optician** - Eye chart design
27. **thermal-imager** - Heat map gradients
28. **cinema-ticket** - Perforated ticket stub
29. **cryptographer** - Code cipher background
30. **neon-sculptor** - Neon tube lighting

## Implementation Steps

### Phase 1: Create Component Structure
- Create 30 folders in `src/components/businesscard/designs/`
- Each folder contains `index.tsx`

### Phase 2: Add CSS Styles
- Add all 30 card styles to `src/components/businesscard/premium-cards.css`
- Convert HTML/CSS to scoped card classes

### Phase 3: Update Registry
- Add all 30 designs to `src/components/businesscard/designs/registry.ts`

### Phase 4: Testing
- Test each design with Vietnamese names
- Verify responsive scaling
- Check text overflow handling

## Technical Notes
- All cards use 300×533px (9:16 aspect ratio)
- Use FitText component for dynamic text sizing
- Maintain existing card structure pattern
- Preserve advanced CSS techniques (backdrop-filter, clip-path, mix-blend-mode, etc.)
