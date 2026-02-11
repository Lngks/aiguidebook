

## Replace Navbar Blue Background with ReactBits ColorBends

### Overview
Replace the solid blue (`bg-primary`) background in the Navbar with the animated ColorBends gradient component from ReactBits.

### Steps

1. **Install the ColorBends component via CLI**
   Run: `npx shadcn@latest add https://reactbits.dev/r/ColorBends-JS-CSS`
   This will add the component files to the project (likely under `src/components/ui/` or a similar path).

2. **Update `Navbar.tsx`**
   - Import `ColorBends` from the installed location
   - Remove `bg-primary` from the header element
   - Add `position: relative` and `overflow: hidden` to the header
   - Place `ColorBends` as an absolute-positioned background layer behind the nav content
   - Ensure nav content stays above with `position: relative` and `z-index`

   Structure will look like:
   ```text
   <header class="sticky top-0 z-50 border-b ... relative overflow-hidden">
     <!-- Background layer -->
     <div class="absolute inset-0">
       <ColorBends
         rotation={45}
         speed={0.2}
         colors={["#5227FF","#FF9FFC","#7cff67"]}
         transparent
         autoRotate={0.2}
         scale={1}
         frequency={1}
         warpStrength={1}
         mouseInfluence={1}
         parallax={0.5}
         noise={0.1}
       />
     </div>
     <!-- Existing nav content with relative z-10 -->
     <nav class="relative z-10 ...">...</nav>
   </header>
   ```

3. **Update mobile menu** - Apply the same pattern to the mobile dropdown section so it also uses the gradient background instead of `bg-primary`.

4. **Verify** - Check that text remains readable against the animated gradient, adjusting text colors if needed.

### Technical Notes
- ColorBends is a shader-based component; since the project already has `three`, `@react-three/fiber`, and `@react-three/drei` installed, dependencies should be covered.
- The component will be contained within the header's bounds via `overflow-hidden`.
- The `transparent` prop ensures it blends naturally.
