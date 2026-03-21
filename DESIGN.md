# Design System Document: The Kinetic Precision Framework

## 1. Overview & Creative North Star: "Kinetic Brutalism"
The Creative North Star for this design system is **Kinetic Brutalism**. Unlike standard fitness apps that rely on generic stock imagery and round buttons, this system celebrates raw power through high-contrast typography, intentional asymmetry, and "High-Tech Depth." 

We break the "template" look by treating the screen as a digital engine room. The layout avoids static, centered grids in favor of aggressive, left-aligned editorial stacks and overlapping elements that suggest movement. We lean into the tension between the "Deep Charcoal" (`#131313`) void and the "Electric Lime" (`#ccf200`) energy, creating an interface that feels less like a utility and more like a high-performance instrument.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is engineered to maximize focus and minimize visual noise. We use color not just for decoration, but as a functional tool for hierarchy.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Boundaries must be defined solely through background color shifts.
- To separate a navigation bar from a hero section, transition from `surface-container-low` to `surface`.
- To define a content block, place a `surface-container-high` element over a `surface-container` background.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface tiers to create "nested" depth:
*   **Base Level:** `surface` (#131313) – The foundation.
*   **Inset Elements:** `surface-container-lowest` (#0e0e0e) – Use for recessed areas like search bars or input fields.
*   **Elevated Elements:** `surface-container-high` (#2a2a2a) – Use for primary content cards to create a subtle lift.

### The "Glass & Gradient" Rule
To achieve a high-tech feel, floating elements (Modals, Navigation Bars) must use **Glassmorphism**.
- **Formula:** `surface` at 70% opacity + `backdrop-blur: 20px`.
- **Signature Textures:** For primary CTAs, do not use a flat color. Apply a linear gradient from `primary` (#ccf200) to `primary-fixed-dim` (#b3d400) at a 45-degree angle to give the element "soul" and a metallic, high-tech sheen.

---

## 3. Typography: The Motivating Voice
Typography is the primary driver of the brand's "Energetic" personality. We use a high-contrast pairing of **Lexend** (Display/Headlines) and **Inter** (Body/UI).

*   **Display & Headlines (Lexend):** Use `display-lg` (3.5rem) for hero messaging. Lexend’s geometric clarity provides a modern, high-tech edge. Headlines should be set with tight letter-spacing (-0.02em) to feel aggressive and authoritative.
*   **Body & Titles (Inter):** Use `body-lg` (1rem) for instructions and `title-md` (1.125rem) for navigation. Inter provides the "Accessible" balance to Lexend’s "Professional" intensity.
*   **The Power Scale:** Large-scale typography should overlap background elements or images slightly to create an editorial, "poster-like" feel that defies the traditional grid.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often a crutch for poor layout. In this design system, we prioritize **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-highest` card on a `surface-dim` background. The delta in lightness creates a natural, sophisticated lift.
*   **Ambient Shadows:** If a "floating" effect is mandatory (e.g., a floating action button), use a wide, diffused shadow.
    *   *Shadow:* `0px 20px 40px rgba(0, 0, 0, 0.4)`. 
    *   *Color:* Use a tinted shadow based on the `on-surface` color to avoid a "muddy" look.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` (#454932) at **15% opacity**. 100% opaque borders are strictly forbidden as they clutter the "high-tech" aesthetic.

---

## 5. Components: Precision Elements

### Buttons
*   **Primary:** High-contrast `primary-fixed` (#ccf200) background with `on-primary-fixed` (#181e00) text. Shape: `md` (0.375rem) for a modern, sharp look.
*   **Secondary:** Ghost style. No background, `outline` (#8f9378) text, with a `Ghost Border` (15% opacity).
*   **States:** On hover, primary buttons should scale 102% and increase brightness.

### Cards & Lists
*   **The "No-Divider" Rule:** Forbid the use of divider lines. Use vertical white space (`spacing-8` or `spacing-10`) or subtle background shifts between `surface-container` and `surface-container-low` to separate content.
*   **Image Handling:** Fitness imagery should use a "darkened" overlay or a gradient fade into the `surface` color to ensure text readability and a seamless transition into the UI.

### Input Fields
*   **Style:** `surface-container-lowest` background with a `sm` (0.125rem) corner radius. 
*   **Focus State:** The `outline` should transition to `primary-fixed` (#ccf200) with a subtle outer glow (2px blur).

### Specialized Fitness Components
*   **Performance Gauges:** Use semi-circular tracks with `secondary` (#bad15f) for background and `primary-fixed` (#ccf200) for the active value.
*   **Workout Timers:** Use `display-lg` typography. Numbers should be "tabular-nums" to prevent layout shifting during countdowns.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts. Push a headline to the far left and the CTA to the far right.
*   **Do** use "Electric Lime" sparingly for conversion points only. Excessive use reduces its energetic impact.
*   **Do** embrace negative space. High-performance brands need room to breathe.

### Don't
*   **Don't** use 1px solid borders to "box in" content. It looks dated and "out-of-the-box."
*   **Don't** use standard "drop shadows" with high opacity. They ruin the clean, high-tech surface transitions.
*   **Don't** center-align long blocks of text. Stick to the aggressive, left-aligned editorial grid.
*   **Don't** use rounded corners larger than `xl` (0.75rem). The brand is "Professional" and "High-Tech," not "Soft" or "Cutesy."