
### Test Utilities
- **`src/test/test-utils.tsx`**: Created a custom `render` function that automatically wraps components in necessary providers:
  - `QueryClientProvider`
  - `MemoryRouter` (for isolated navigation testing)
  - `TooltipProvider`
  - `Toaster` and `Sonner` (for toast notifications)

### Component & Page Tests
- **`src/pages/Guidelines.test.tsx`**:
  - Verified rendering of the hero section.
  - Tested the interactive checklist: confirmed that toggling items updates the UI and triggers the correct ARIA live region announcements for screen readers.
  - Verified the FAQ accordion rendering.
- **`src/components/Navbar.test.tsx`**:
  - Verified the logo links to the home page.
  - Confirmed all navigation items (Verktøy, Retningslinjer, etc.) are present with correct paths.
  - Verified the theme toggle button existence.
- **`src/App.test.tsx`**:
  - Integration smoke test for the entire application.
  - Verified the Initial Boot Loader appears and eventually transitions to the main content.

### Infrastructure Fixes
- **`src/App.tsx`**: Exported `AppContent` to allow testing the main application structure without duplicating the Top-Level Router, avoiding React Router conflicts.
- **`src/test/setup.ts`**: Added a mock for `window.scrollTo` to support tests involving page transitions.

## Test Results

All tests were executed using `npm run test` (mapped to `vitest run`).

```text
 RUN  v3.2.4 C:/Users/blang/OneDrive - USN/Vår 26/PRO1000/aiguidebook

 ✓ src/components/Navbar.test.tsx (4 tests) 204ms
 ✓ src/pages/Guidelines.test.tsx (4 tests) 386ms
 ✓ src/App.test.tsx (2 tests) 222ms

 Test Files  3 passed (3)
      Tests  10 passed (10)
   Start at  14:33:18
   Duration  4.81s
```
