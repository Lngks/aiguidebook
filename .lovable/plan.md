

## Parallax Scroll System Between Sections

### Overview
Add a parallax scrolling effect throughout the Index page where sections animate and move at different speeds as the user scrolls, creating depth and visual interest between each section.

### Approach
Create a reusable `useParallax` hook and a `ParallaxSection` wrapper component. Each section on the page will be wrapped in this component, which uses `IntersectionObserver` for triggering entrance animations and a scroll event listener for the parallax translate effect.

### What will change

**1. New file: `src/hooks/use-parallax.ts`**
- A custom React hook that tracks the scroll position relative to a given element ref
- Returns a `y` offset value that can be applied as a CSS transform
- Uses `requestAnimationFrame` for smooth performance
- Accepts a `speed` parameter (e.g. 0.1 = subtle, 0.5 = strong parallax)

**2. New file: `src/components/ParallaxSection.tsx`**
- A wrapper component that combines:
  - **Scroll-triggered fade-in**: Uses `IntersectionObserver` to detect when the section enters the viewport and applies a fade+slide-up animation
  - **Parallax offset**: Uses the `useParallax` hook to translate the section content at a different rate than the scroll, creating the depth illusion
- Props: `speed` (parallax intensity), `className`, `children`, `as` (HTML tag)

**3. Updated file: `src/pages/Index.tsx`**
- Import and wrap each section with `ParallaxSection`, assigning different speeds to create layered depth:
  - Hero: speed 0.1 (slow, background feel)
  - "Tre ting du ma vite": speed 0.15
  - "Bruk AI med tillit": speed 0.2
  - CTA banner: speed 0.1
  - Placeholder image: speed 0.25
  - FAQ: speed 0.15
  - "Trenger du mer hjelp": speed 0.1
- Replace existing `section-fade-in` CSS classes with the component's built-in scroll-triggered animation (so animations fire when sections scroll into view, not on page load)

**4. Updated file: `src/index.css`**
- Add a utility class for the parallax entrance animation (opacity + translateY transition driven by a CSS custom property or class toggle)

### Technical Notes
- No external dependencies needed -- pure React hooks + IntersectionObserver + transform
- `will-change: transform` applied for GPU acceleration
- Parallax is disabled on mobile (`prefers-reduced-motion` media query respected) for accessibility and performance
- The existing `section-fade-in` keyframe animations are preserved but the parallax sections will use the new scroll-triggered approach instead

