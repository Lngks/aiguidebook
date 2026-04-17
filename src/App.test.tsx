import { render, screen, waitFor } from "./test/test-utils";
import { AppContent } from "./App";
import { describe, it, expect, vi } from "vitest";

// Mock Three.js and related components to avoid WebGL errors in jsdom
vi.mock("three", async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    WebGLRenderer: vi.fn().mockImplementation(() => ({
      setSize: vi.fn(),
      render: vi.fn(),
      dispose: vi.fn(),
      forceContextLoss: vi.fn(),
      domElement: document.createElement("canvas"),
    })),
  };
});

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    size: { width: 100, height: 100 },
    viewport: { width: 100, height: 100, factor: 1 },
  })),
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => null,
  PerspectiveCamera: () => null,
}));

// Mock AsciiHero specifically to avoid complex 3D logic
vi.mock("./components/AsciiHero", () => ({
  default: () => <div data-testid="ascii-hero">ASCII Hero</div>,
}));

// Mock ColorBends as it uses complex Three.js logic
vi.mock("./components/ui/ColorBends", () => ({
  default: () => <div data-testid="color-bends">Color Bends</div>,
}));

// Mock AsciiRenderer if used directly
vi.mock("./components/ui/AsciiRenderer", () => ({
  default: () => <div data-testid="ascii-renderer">Ascii Renderer</div>,
}));

describe("App Integration", () => {
  it("renders the app and shows the initial loader", () => {
    // Note: App already includes BrowserRouter internally, so we might need a version that doesn't
    // or just let it be. Our custom render uses MemoryRouter, but App.tsx has BrowserRouter.
    // In actual tests, it's better to test AppContent if App has BrowserRouter.
    
    // However, vitest-jsdom usually handles this if we don't nest routers.
    // Let's see if we can render App directly.
    
    render(<AppContent />);
    
    // InitialLoader should be visible
    expect(screen.getByText(/BOOT_SEQUENCE_INIT/i)).toBeInTheDocument();
  });

  it("eventually renders the main content after loader", async () => {
    render(<AppContent />);
    
    // Wait for loader to complete (Internal logic of InitialLoader)
    // We might need to mock the delay if it's too long
    
    // For now, let's just check if Navbar is present (Layout renders it)
    await waitFor(() => {
      expect(screen.getByRole("banner")).toBeInTheDocument();
    }, { timeout: 10000 }); // Loader might take a few seconds
  });
});
