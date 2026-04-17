import { render, screen, fireEvent, waitFor } from "../test/test-utils";
import Guidelines from "./Guidelines";
import { describe, it, expect, vi } from "vitest";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    ul: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useInView: () => true,
}));

describe("Guidelines Page", () => {
  it("renders the hero section", () => {
    render(<Guidelines />);
    expect(screen.getByRole("heading", { level: 1, name: /Bruk AI/i })).toBeInTheDocument();
    expect(screen.getByText(/ansvarlig./i)).toBeInTheDocument();
  });

  it("renders the checklist items", () => {
    render(<Guidelines />);
    expect(screen.getByText(/Har jeg opplyst om AI-bruk\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Er alle kilder verifisert manuelt\?/i)).toBeInTheDocument();
  });

  it("toggles checklist items when clicked", async () => {
    render(<Guidelines />);
    const checklistItem = screen.getByText(/Har jeg opplyst om AI-bruk\?/i);
    const label = checklistItem.closest("label");
    
    // Initial state check - usually handled by classes or data-attributes in shadcn
    // Guidelines uses checkedItems state and maps it to classes
    
    // Since we're using Radix Checkbox, we should look for the checkbox input or button
    const checkbox = screen.getAllByRole("checkbox")[0];
    
    // Toggle check
    fireEvent.click(checkbox);
    
    // Check if announcement updated
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(/Markert som fullført: Har jeg opplyst om AI-bruk\?/i);
    
    // Toggle uncheck
    fireEvent.click(checkbox);
    expect(status).toHaveTextContent(/Avmarkert: Har jeg opplyst om AI-bruk\?/i);
  });

  it("renders the FAQ section", () => {
    render(<Guidelines />);
    expect(screen.getByText(/Spørsmål & Svar/i)).toBeInTheDocument();
    expect(screen.getByText(/Er det lov å bruke ChatGPT til eksamen\?/i)).toBeInTheDocument();
  });
});
