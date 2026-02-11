

## Glassmorphism Overlay for Hero Section

### What will change
Instead of a plain dark overlay over the ColorBends background, a frosted-glass (glassmorphism) panel will be placed behind the text content. This gives a modern, translucent look while ensuring text remains readable.

### Visual Effect
- A frosted glass card behind the hero text with blur, semi-transparent white/dark background, and a subtle border
- Text shadows for extra legibility
- The animated gradient remains visible through the glass

### Technical Details

**File: `src/pages/Index.tsx`**

1. **Add a glassmorphism container** around the text content (wrapping the `h1`, `p`, and buttons) with these Tailwind classes:
   - `bg-white/10` -- semi-transparent white background
   - `backdrop-blur-xl` -- strong blur for the frosted effect
   - `border border-white/20` -- subtle glass edge
   - `rounded-2xl` -- rounded corners
   - `p-8 md:p-10` -- comfortable padding
   - `shadow-lg` -- depth

2. **Add text shadows** to the `h1` and `p` for extra contrast reinforcement via inline `textShadow` styles.

3. **Remove `opacity-80`** from the paragraph to keep text at full opacity.

No new files or dependencies needed -- just Tailwind's built-in `backdrop-blur` utilities.

