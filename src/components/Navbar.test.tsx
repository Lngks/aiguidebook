import { render, screen } from "../test/test-utils";
import Navbar from "./Navbar";
import { describe, it, expect, vi } from "vitest";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock ScrambleText as it might have complex logic
vi.mock("./ScrambleText", () => ({
  ScrambleText: ({ text }: { text: string }) => <span>{text}</span>,
}));

describe("Navbar Component", () => {
  it("renders the logo link", () => {
    render(<Navbar />);
    const logoLink = screen.getByRole("link", { name: /AI Guidebook/i });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders all navigation links", () => {
    render(<Navbar />);
    // On desktop view, these should be visible
    expect(screen.getByText("Verktøy")).toBeInTheDocument();
    expect(screen.getByText("Retningslinjer")).toBeInTheDocument();
    expect(screen.getByText("Personvern")).toBeInTheDocument();
    expect(screen.getByText("Interaktiv")).toBeInTheDocument();
  });

  it("has the correct hrefs for navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("Verktøy").closest("a")).toHaveAttribute("href", "/tools");
    expect(screen.getByText("Retningslinjer").closest("a")).toHaveAttribute("href", "/guidelines");
    expect(screen.getByText("Personvern").closest("a")).toHaveAttribute("href", "/privacy");
    expect(screen.getByText("Interaktiv").closest("a")).toHaveAttribute("href", "/interactive");
  });

  it("renders the theme toggle button", () => {
    render(<Navbar />);
    expect(screen.getByLabelText(/Toggle theme/i)).toBeInTheDocument();
  });
});
