# Narrative Design System
## Foundations
Hermes Narrative Design System is a narrative-first visual language system for content-rich interfaces. It prioritizes reading comfort, editorial clarity, restrained surfaces, and quiet interaction. The system is built on a small set of semantic foundations that remain consistent across light and dark themes.

---

## Color
Color defines hierarchy, surface separation, and semantic meaning.  
The palette is intentionally minimal, with strong contrast and low decorative noise.

### Overview
Hermes uses a neutral, high-contrast palette with a warm light theme and a calm dark theme. The design language avoids ornamental color usage and instead relies on color to clarify structure and meaning.

### Color principles
+ Keep the palette narrow.
+ Let surfaces remain quiet and paper-like.
+ Use color for meaning, not decoration.
+ Preserve strong readability at all times.
+ Use borders and typography as primary structural tools.
+ Keep semantic colors sparse and purposeful.

### Color roles
| Token | Value | Purpose |
| --- | ---: | --- |
| `bg-color` | `#f7f3f0` | Main canvas and base background |
| `text-color` | `#000000` | Primary text and strong emphasis |
| `secondary-text` | `#666666` | Supporting text and metadata |
| `border-color` | `#000000` | Structural lines and dividers |
| `panel-bg` | `#ffffff` | Surface background for panels and containers |
| `hover-bg` | `#f5f5f5` | Subtle hover surface |
| `overlay-bg` | `rgba(0, 0, 0, 0.4)` | Backdrop and scrim |
| `accent-color` | `#000000` | Accent and emphasis |
| `error-color` | `#ff4444` | Error and destructive feedback |
| `success-color` | `#4caf50` | Success and positive feedback |
| `info-color` | `#2196f3` | Informational feedback |


### Theme behavior
The system supports a dark theme using the same semantic roles, with inverted values for background, text, border, panel, hover, and overlay. The design language remains unchanged; only contrast relationships shift.

### Accessibility
+ Maintain strong contrast for all readable content.
+ Do not rely on color alone to communicate meaning.
+ Keep hover and active states visible without excessive saturation.
+ Ensure semantic colors are used consistently.
+ Preserve legibility in both light and dark themes.

---

## Typography
Typography is the primary expressive foundation of the system.  
The visual voice is serif-led, with sans-serif reserved for supporting and functional contexts.

### Overview
Typography carries the narrative tone of the system. Serif is the dominant voice, giving interfaces a literary, editorial, and composed character. Sans-serif is used only when information needs to feel operational, compact, or technical.

### Typography principles
+ Use serif as the default expressive voice.
+ Keep typography elegant and readable.
+ Use size and spacing before weight.
+ Avoid heavy bold styling.
+ Let headings feel editorial rather than mechanical.
+ Use sans-serif only when the text needs to feel functional or compact.

### Font families
| Token | Value | Usage |
| --- | --- | --- |
| `font-serif` | `'EB Garamond', 'Noto Serif SC', serif` | Main narrative and editorial voice |
| `font-sans` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Utility and functional voice |


### Type scale
| Role | Value |
| --- | ---: |
| Display title | `4rem` |
| Large heading | `2.5rem` |
| Medium heading | `1.8rem` |
| Body text | `1.2rem` |
| Large body / supporting UI | `1.5rem` |
| Supporting text | `0.9rem` |
| Micro text | `0.85rem` |
| Uppercase label | `0.75rem` |


### Reading behavior
+ Main content should read like prose or a document.
+ Paragraphs should be spacious and comfortable.
+ Headings should create a clear reading structure.
+ Labels and metadata should support the content without competing with it.
+ The text rhythm should feel calm and editorial rather than dense or technical.

### Hierarchy guidance
+ Display sizes are for major pages or key entry sections.
+ Heading sizes define content structure.
+ Body text carries long-form content.
+ Small text supports utility, metadata, and system detail.

### Accessibility
+ Keep body text readable across all content densities.
+ Preserve hierarchy without depending on weight alone.
+ Use size, spacing, and contrast to distinguish levels.
+ Avoid tight line spacing in long-form reading contexts.

---

## Spacing
Spacing supports rhythm, clarity, and calm composition.  
It is used to separate ideas, group related content, and establish editorial flow.

### Overview
The spacing system is compact but sufficient. It favors a small set of consistent values rather than many arbitrary increments. This keeps the interface disciplined and easy to scan.

### Spacing principles
+ Use small spacing for closely related elements.
+ Use medium spacing for grouped content blocks.
+ Use large spacing for section changes.
+ Use extra-large spacing for major narrative breaks.
+ Keep vertical rhythm more important than dense packing.
+ Let whitespace act as a structural element.

### Spacing tokens
| Token | Value | Usage |
| --- | ---: | --- |
| `spacing-xs` | `0.5rem` | Tight local spacing |
| `spacing-sm` | `1rem` | Standard spacing |
| `spacing-md` | `1.5rem` | Medium grouping spacing |
| `spacing-lg` | `2.5rem` | Large section spacing |


### Additional observed layout values
| Value | Usage |
| --- | --- |
| `2rem` | Panel padding and content inset |
| `3rem` | Section separation and large gaps |
| `4rem` | Major horizontal rule spacing |


### Composition guidance
+ Content should never feel crowded.
+ Internal padding should make surfaces feel intentional.
+ Section spacing should make hierarchy obvious.
+ Layout should feel breathable and editorial.
+ Whitespace should function as a structural tool, not as empty space.

---

## Shape
Shape is intentionally minimal.  
The system uses sharp geometry as a structural language rather than a decorative one.

### Overview
Shape in Hermes is deliberately restrained. Corners are effectively square, and geometry is used to support clarity, discipline, and a paper-like visual tone.

### Shape principles
+ Prefer sharp or near-sharp edges.
+ Avoid decorative rounding.
+ Keep surfaces architectural and paper-like.
+ Use shape to define structure, not personality.
+ Reserve fully rounded geometry for rare semantic needs.

### Shape tokens
| Token | Value | Usage |
| --- | ---: | --- |
| `radius-none` | `0` | Default sharp edge |
| `radius-sm` | `0` | Minimal or no rounding |
| `radius-md` | `0` | Minimal or no rounding |
| `radius-full` | `9999px` | Fully rounded pill form |


### Shape character
The system should feel composed, direct, and disciplined.  
Shape should never compete with typography or hierarchy.

---

## Elevation
Elevation is subtle and functional.  
It separates layers without becoming visually heavy.

### Overview
Hermes does not rely on dramatic shadow language. Depth is used sparingly and always in service of clarity. Surfaces remain mostly flat, with a quiet sense of layering.

### Elevation principles
+ Base surfaces remain flat.
+ Secondary surfaces use light separation.
+ Overlays and floating layers use soft shadows.
+ Borders remain the primary structural separator.
+ Shadow should support hierarchy, not define it.

### Elevation character
+ Floating layers should still feel editorial.
+ Depth should be quiet rather than dramatic.
+ Use the minimum amount of elevation required for clarity.
+ Avoid glossy, plastic, or highly materialized depth effects.
+ Panels, menus, and dialogs should feel like layered paper surfaces.

### Layering guidance
+ Background content should stay readable under overlays where appropriate.
+ Panels and menus should feel detached but calm.
+ Dialogs should read as light surfaces above the page.

---

## Motion
Motion is quiet and informative.  
It supports transitions between states and layers without drawing attention to itself.

### Overview
Motion in Hermes is measured and restrained. It should help users understand context changes, not perform as a visual effect. Transitions are short, smooth, and understated.

### Motion principles
+ Keep transitions short.
+ Prefer fade, slight translation, and restrained scaling.
+ Avoid springy or playful motion.
+ Motion should feel like turning a page, not triggering an effect.
+ The interface should remain calm during change.

### Motion tokens
| Token | Value | Usage |
| --- | ---: | --- |
| `transition-fast` | `0.15s ease` | Hover and lightweight feedback |
| `transition-normal` | `0.3s ease` | Standard transitions |
| `transition-slow` | `0.4s ease` | Larger layered transitions |


### Motion duration tokens
| Token | Value | Usage |
| --- | ---: | --- |
| `transition-duration-fast` | `150` | Fast animations |
| `transition-duration-normal` | `300` | Standard animations |
| `transition-duration-slow` | `400` | Slower contextual changes |


### Motion usage
+ Fast transitions support hover and immediate feedback.
+ Normal transitions support menus and layered surfaces.
+ Slow transitions support larger overlays or major state changes.

---

## States
States communicate interaction clearly while preserving the system’s quiet tone.

### Overview
States are semantic and restrained. They should be easy to distinguish without breaking the visual calm of the system.

### State model
| State | Purpose |
| --- | --- |
| Default | Neutral base state |
| Hover | Subtle affordance and feedback |
| Active | Stronger emphasis or selected interaction |
| Focus | Keyboard and accessibility cue |
| Disabled | Lower emphasis and reduced interactivity |
| Selected | Persistent selection emphasis |
| Error | Invalid or destructive state |
| Success | Positive confirmation |
| Information | Neutral informational state |


### State principles
+ States should be easy to distinguish.
+ Use contrast, surface tone, and borders rather than decoration.
+ Keep state changes restrained.
+ Do not rely on animation to communicate state.
+ Keep the same interaction language across the system.

### State behavior
+ Hover should be subtle and immediate.
+ Active and selected states should be persistent and obvious.
+ Focus should remain visible and accessible.
+ Disabled should reduce emphasis without breaking layout rhythm.
+ Error, success, and information should remain semantic and sparse.

### Accessibility
+ Focus must be clearly visible.
+ Disabled states must remain recognizable.
+ Semantic states must not depend on color alone.
+ Interaction feedback should remain perceivable in low-motion contexts.

---

## Layout
Layout is editorial and content-first.  
It supports reading, scanning, and section-based hierarchy.

### Overview
The layout language is structured but not rigid. It favors readable content widths, generous spacing, and clear vertical rhythm. The system is designed to serve narrative content before dense operational interfaces.

### Layout principles
+ Keep reading width comfortable.
+ Use vertical rhythm to organize narrative content.
+ Keep secondary areas visually subordinate.
+ Let spacing and alignment define structure.
+ Avoid excessive horizontal complexity for content-heavy pages.

### Layout behavior
+ Main content should feel easy to scan.
+ Sections should unfold in a clear sequence.
+ The system should feel structured but not rigid.
+ Responsive behavior should preserve readability before density.
+ Content areas should feel breathable and deliberate.

### Responsive guidance
+ Reduce density on smaller screens.
+ Preserve comfortable text size and spacing.
+ Simplify horizontal layouts when necessary.
+ Keep touch targets practical and accessible.

---

## Theme
Theme is semantic, not decorative.  
Light and dark modes share the same roles and hierarchy.

### Overview
The theme system is built so that the meaning of the design remains stable across appearances. Only the visual values change; the language stays the same.

### Theme principles
+ Same meaning, different contrast values.
+ Same structure, different surface tone.
+ Same readability goals across themes.
+ Theme switching should never change the design language.

### Light theme identity
+ Warm
+ Paper-like
+ Open
+ Editorial
+ High clarity

### Dark theme identity
+ Grounded
+ Quiet
+ High-contrast
+ Calm
+ Layered

---

## Accessibility
Accessibility is part of the foundation, not an optional layer.

### Overview
The system is designed to support long-form reading, clear interaction states, and stable hierarchy across themes and screen sizes.

### Accessibility principles
+ Maintain strong contrast for text and structure.
+ Never depend on color alone to communicate meaning.
+ Keep focus states visible.
+ Preserve legibility at all supported sizes.
+ Keep semantic feedback consistent and understandable.
+ Support long-form reading without strain.

### Readability principles
+ Use comfortable line heights.
+ Keep paragraph spacing clear.
+ Avoid visual clutter.
+ Ensure supporting text does not compete with main content.
+ Maintain hierarchy even in compact layouts.

### Inclusive behavior
+ The system should work for both reading-heavy and action-heavy contexts.
+ Typography and spacing should support users with varying reading speeds.
+ Interaction feedback should remain understandable with reduced motion or limited vision conditions.

---

## Foundation summary
Hermes Narrative Design System is a restrained, editorial design language built on:

+ serif-led typography
+ a very small, semantic color system
+ minimal shape language
+ subtle elevation
+ quiet motion
+ readable spacing
+ clear but calm interaction states
+ content-first layout principles

The result is a system that feels composed, narrative, and grounded.