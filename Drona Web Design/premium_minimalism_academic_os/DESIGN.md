---
name: Premium Minimalism Academic OS
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#434656'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#747688'
  outline-variant: '#c4c5d9'
  surface-tint: '#074af0'
  primary: '#0042dc'
  on-primary: '#ffffff'
  primary-container: '#2a5cff'
  on-primary-container: '#efefff'
  inverse-primary: '#b8c4ff'
  secondary: '#5d5c74'
  on-secondary: '#ffffff'
  secondary-container: '#e2e0fc'
  on-secondary-container: '#63627a'
  tertiary: '#9a3200'
  on-tertiary: '#ffffff'
  tertiary-container: '#c34100'
  on-tertiary-container: '#ffede8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001454'
  on-primary-fixed-variant: '#0037ba'
  secondary-fixed: '#e2e0fc'
  secondary-fixed-dim: '#c6c4df'
  on-secondary-fixed: '#1a1a2e'
  on-secondary-fixed-variant: '#45455b'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-sm:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  mono-label:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
---

## Brand & Style
The design system embodies "Premium Minimalism"—a high-fidelity aesthetic that merges the prestige of traditional Indian academia with the precision of a modern operating system. It treats the student's journey not as a series of web pages, but as a "Student OS" where multiple AI agents coexist.

The brand personality is authoritative and scholarly, yet technologically advanced. It prioritizes clarity through generous whitespace and editorial-grade typography. The emotional response should be one of "calm focus" and "intellectual agency." Visual depth is achieved through glassmorphism and subtle tonal layering rather than heavy decoration, ensuring the interface feels "alive" and responsive to the student's intent.

## Colors
The palette is architectural, using a neutral "Gallery White" base to allow environment-specific colors to define the context. This design system uses color as a "spatial signal" to tell the student exactly which mode of the OS they are currently inhabiting.

- **Main Learning (Blue):** The default state; evokes trust and clarity.
- **Test (Red):** Used sparingly to denote high-stakes focus and urgency.
- **Game (Gold):** Represents achievement and gamified engagement.
- **Workspace (Green):** Indicates active creation and productivity.
- **Resources (Purple):** Signals discovery and archival knowledge.
- **Career (Navy-Silver):** Provides a professional, "end-game" feel for transition to the workforce.

Functional neutrals use cool greys to maintain a modern, "tech-native" feel, avoiding warm-toned "muddy" greys.

## Typography
The typography system creates an editorial rhythm. **Playfair Display** is used for all primary headlines and display moments to evoke the feeling of a prestigious journal or textbook. **Inter** provides a highly legible, systematic contrast for all functional UI elements, body text, and agent dialogues.

Hierarchy is strictly enforced. Display styles should use tight letter-spacing for a premium look, while labels utilize uppercase tracking to denote "system-level" information. Avoid using Playfair Display for text smaller than 20px to maintain legibility.

## Layout & Spacing
This design system utilizes a **fixed-grid** strategy for large screens to maintain an editorial "white border" feel, transitioning to a fluid grid for mobile. The spacing rhythm is based on a strict 8px base unit.

Generous padding (XL and XXL increments) is used between major content sections to prevent information density fatigue—a common issue in education platforms. AI agent windows and sidebars follow a "drawer" logic, sliding over the main content area with fixed widths to ensure the learning material remains the focal point.

## Elevation & Depth
Depth is signaled through **Ambient Shadows** and **Glassmorphism**. 

- **Surface Level (Base):** Solid #F8F9FA.
- **Layer 1 (Cards):** White background with a 1px #E2E8F0 border and a very soft, diffused shadow (0 4px 20px rgba(0,0,0,0.04)).
- **Layer 2 (Modals/Agents):** Backdrop blur (20px) with 80% opacity white fill. This creates the "OS" feeling where agents float above the workspace.
- **Micro-elevation:** Buttons and interactive cards lift slightly (y-minus 2px) on hover to indicate agency, accompanied by a subtle increase in shadow spread.

## Shapes
The shape language is refined and balanced. A "Rounded" setting (0.5rem base) ensures the UI feels approachable and modern without appearing juvenile. 

- **Primary Buttons:** Fully rounded (pill) to distinguish them as primary actions.
- **Content Containers:** 1rem (rounded-lg) for large cards and learning modules.
- **Agent Avatars:** Circular, reflecting their personified but digital nature.
- **Input Fields:** 0.5rem (base roundedness) to maintain a crisp, academic structure.

## Components
- **AI Agent "Orchestrator":** A persistent floating dock or sidebar. Agents are represented by minimalist icons that expand into glassmorphic "thought bubbles" or full-height chat panels.
- **Learning Cards:** High-fidelity cards with "Playfair Display" titles. They use environment colors (e.g., a blue 4px top-border for Learning) to categorize content.
- **Primary Buttons:** Solid fills using the current environment color. Hover states should include a "shimmer" micro-animation to indicate AI responsiveness.
- **Ghost Buttons:** Transparent with a 1px border; used for secondary actions to maintain minimalism.
- **Inputs:** Minimalist bottom-border only or very light grey fills that transition to a 1px environment-colored border on focus.
- **Progress Steppers:** Vertical, slender lines with serif numerals, evoking the feeling of a table of contents in a high-end book.
- **Micro-animations:** Elements should use "staggered entrance" fades. Transitions between environments (e.g., Learning to Test) should use a full-screen "wash" of the new theme color at low opacity.