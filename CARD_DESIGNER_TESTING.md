# Card Designer - Testing & Refinement Checklist

## Issues Fixed in Refinement Pass 1:

### Critical Bugs Fixed:
1. ✅ **Element dragging** - Added mousedown/mousemove/mouseup handlers
2. ✅ **Element resizing** - Added resize handle with proper constraints
3. ✅ **Export code generation** - Fixed template literal syntax issues
4. ✅ **Element boundaries** - Constrained elements within 300×533px canvas
5. ✅ **Text overflow** - Added whiteSpace: nowrap and textOverflow: ellipsis
6. ✅ **Global mouse handlers** - Added useEffect for cleanup

### Improvements Made:
- Added drag state management (isDraggingElement, isResizing)
- Added drag start position tracking
- Proper cursor feedback (grab/grabbing)
- Resize handle only shows on selected element
- Better export code formatting
- Removed image data from export (too large for clipboard)

## Testing Checklist (Run Before Claiming Success):

### Basic Functionality:
- [ ] Drag text field from sidebar onto canvas
- [ ] Click element to select it
- [ ] Drag selected element to new position
- [ ] Resize element using bottom-right handle
- [ ] Element stays within canvas boundaries
- [ ] Text doesn't overflow element bounds

### Background Controls:
- [ ] Switch to gradient background
- [ ] Change gradient colors
- [ ] Adjust gradient angle
- [ ] Switch to solid color background
- [ ] Upload image background
- [ ] Switch between background types

### Frame Selection:
- [ ] Select each of the 9 frame presets
- [ ] Frame renders correctly
- [ ] Frame doesn't interfere with elements
- [ ] Can select "None" to remove frame

### Element Customization:
- [ ] Change font family
- [ ] Change font size
- [ ] Change font weight
- [ ] Change text color
- [ ] Edit text content
- [ ] Changes apply immediately

### Export Functionality:
- [ ] Click Export button
- [ ] Code copied to clipboard
- [ ] Toast notification appears
- [ ] Generated code is valid React/TypeScript
- [ ] Code includes all elements with correct positions
- [ ] Code includes background style
- [ ] Code includes frame if selected

### Edge Cases:
- [ ] Multiple elements don't overlap incorrectly
- [ ] Can't drag element outside canvas
- [ ] Can't resize element too small (min 60×30)
- [ ] Can't resize element outside canvas
- [ ] Deselect element by clicking canvas
- [ ] Clear all elements works
- [ ] Reset canvas works

## Known Limitations:

1. **Image Export**: Background images are not included in export code (data URLs too large)
   - Solution: User must manually add image to public folder and reference it

2. **Element Overlap**: No z-index management UI
   - Elements stack in order created
   - Could add "Bring to Front" / "Send to Back" buttons

3. **Undo/Redo**: Not implemented
   - Could add history stack

4. **Snap to Grid**: Not implemented
   - Could add alignment guides

5. **Multi-select**: Can't select multiple elements
   - Could add shift-click multi-select

## Refinement Pass 2 TODO:

### High Priority:
- [ ] Test actual drag and drop in browser
- [ ] Verify export code compiles in React
- [ ] Test with real data in BusinessCardSection
- [ ] Add loading fonts (Google Fonts CDN)
- [ ] Add element z-index controls

### Medium Priority:
- [ ] Add undo/redo
- [ ] Add alignment guides
- [ ] Add "Duplicate Element" button
- [ ] Add keyboard shortcuts (Delete, Ctrl+Z, etc.)
- [ ] Add element locking

### Low Priority:
- [ ] Add more frame presets
- [ ] Add text alignment options
- [ ] Add rotation support
- [ ] Add opacity controls
- [ ] Export as PNG (html2canvas)

## Integration Testing:

### Test in Real App:
1. Start dev server: `npm run dev`
2. Navigate to `/designer`
3. Create a card design
4. Export the code
5. Create file: `src/components/businesscard/designs/test-design/index.tsx`
6. Paste exported code
7. Add to registry.ts
8. Add to types.ts
9. View in gallery at `/cards`
10. Verify it renders correctly with real data

## Current Status:

**Refinement Pass 1**: ✅ COMPLETE
- Fixed critical bugs
- Added missing functionality
- Improved code quality

**Refinement Pass 2**: ⏳ PENDING
- Needs browser testing
- Needs real integration test
- Needs user feedback

**DO NOT CLAIM "READY" UNTIL**:
- All basic functionality tests pass
- Export code successfully integrates
- At least one custom design works in gallery
