

# AIGuidebook — Implementation Plan

## Overview
A modern academic website providing university students with clear, trustworthy guidance on responsible AI use. Clean, professional design with navy/blue tones, top navigation, and a mix of informational content and interactive elements.

---

## Pages & Structure

### 1. Home Page
- Hero section with the AIGuidebook brand, tagline, and a brief mission statement
- Quick overview cards linking to the main sections (Tools, Guidelines, Privacy & Risks)
- "Why This Matters" section with key stats or highlights about AI in education
- Clean footer with citations and attribution

### 2. Tools Page
- Curated overview of popular AI tools students encounter (ChatGPT, Copilot, Gemini, etc.)
- For each tool: what it does, common academic uses, and key considerations
- Icons and cards layout for easy scanning

### 3. Guidelines Page
- Clear rules and examples of acceptable vs. unacceptable AI use
- **Interactive Checklist**: A "Before You Submit" checklist students can tick through to verify their AI-assisted work meets academic integrity standards — with visual progress and a summary at the end
- Practical tips section with do's and don'ts
- Citation guidance for AI-generated content

### 4. Privacy & Risks Page
- Sections covering: data privacy, bias, hallucinations, and academic integrity risks
- Simple explanations with real-world examples
- Visual callouts and warning cards for key risks
- Tips for protecting personal data when using AI tools

### 5. Interactive Tool (WIP Page)
- A placeholder page clearly marked as "Coming Soon / Work in Progress"
- Teaser description of the planned Three.js AI pipeline visualization experience
- Styled consistently with the rest of the site so it feels intentional

---

## Design & UX

- **Style**: Modern academic — navy/blue primary tones, clean typography, professional feel with generous whitespace
- **Navigation**: Sticky top navigation bar with links to all pages, mobile-responsive hamburger menu
- **Responsiveness**: Fully responsive layout for desktop, tablet, and mobile
- **Accessibility**: Proper heading hierarchy, contrast ratios, alt text, keyboard navigation
- **Animations**: Subtle fade-in animations on scroll, hover effects on cards and links

---

## Technical Approach
- Static content site (no backend needed initially)
- React + React Router for multi-page navigation
- Tailwind CSS for styling with the modern academic color theme
- Interactive checklist with local state (checkboxes, progress indicator)
- All content hardcoded — can be made dynamic later if needed

