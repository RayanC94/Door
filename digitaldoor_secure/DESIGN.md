# Design System Strategy: The Secure Curator

## 1. Overview & Creative North Star
This design system is built on the Creative North Star of **"The Secure Curator."** For Airbnb hosts, security isn’t just about locks; it’s about the peace of mind that comes from professional-grade reliability and effortless hospitality. We move away from the "clunky hardware" aesthetic toward a high-end, editorial digital experience.

The system breaks the standard "SaaS template" look by utilizing **intentional asymmetry** and **tonal depth**. Instead of rigid, boxed-in grids, we use expansive breathing room and overlapping elements to suggest a modern, interconnected ecosystem. This approach creates a "tech-forward" reassurance—it feels like a premium concierge service rather than just a settings menu.

---

## 2. Colors: Depth Over Definition
Our palette is rooted in the authority of **Deep Navy** and the energy of **Electric Blue**. To maintain a premium feel, we strictly adhere to a philosophy of soft transitions rather than hard boundaries.

### The "No-Line" Rule
**Designers are prohibited from using 1px solid borders for sectioning.** Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit directly on a `surface` background to define its territory.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass.
*   **Surface (Base):** The foundation of the page.
*   **Surface-Container-Low:** Used for secondary content areas or sidebar backgrounds.
*   **Surface-Container-Highest:** Used for floating cards or primary interaction areas to create a "lifted" appearance.

### The "Glass & Gradient" Rule
To avoid a flat, "out-of-the-box" look, use **Glassmorphism** for floating elements (e.g., navigation bars or tooltips). Utilize semi-transparent surface colors with a `backdrop-blur` of 12px–20px. 
*   **Signature Texture:** Main CTAs and Hero backgrounds should leverage a subtle linear gradient transitioning from `primary` (#1A1A2E) to `primary-container` (#45455B) at a 135-degree angle. This adds "visual soul" and a metallic, high-tech sheen.

---

## 3. Typography: Editorial Authority
We use a high-contrast scale to create an editorial feel. By pairing bold, oversized headlines with functional, airy body text, we convey both tech-sophistication and readability.

*   **Display (Inter, Bold):** Used for hero statements. The `display-lg` (3.5rem) should feel monumental, set with a tight letter-spacing (-0.02em) to look like a premium tech brand.
*   **Headlines (Inter, Bold):** These drive the narrative. Use `headline-md` (1.75rem) to introduce features with authority.
*   **Body (Inter, Regular):** The workhorse. `body-lg` (1rem) is the standard for host instructions, ensuring a reassuring and legible experience.
*   **Labels (Inter, Medium):** Small caps or standard `label-sm` (0.6875rem) in `secondary` (#0050CC) color provide technical metadata without cluttering the visual field.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often a crutch for poor layout. In this system, we prioritize **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking" surface tiers. A `surface-container-lowest` (#FFFFFF) card placed on a `surface-container-low` (#F3F3F5) section creates a soft, natural lift without a single pixel of shadow.
*   **Ambient Shadows:** When a "floating" effect is mandatory (e.g., a critical "Unlock" button), use extra-diffused shadows: `box-shadow: 0 20px 40px rgba(26, 28, 29, 0.06);`. The shadow color must be a tinted version of `on-surface`, never pure black.
*   **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use the **Ghost Border**: `outline-variant` (#C8C5CD) at 20% opacity. 100% opaque borders are forbidden.

---

## 5. Components: Modern Utility

### Buttons
*   **Primary:** Uses the `secondary` (#0066FF) token with a subtle 135° gradient to `on-secondary-fixed-variant`. Roundedness: `xl` (0.75rem).
*   **Secondary:** Ghost style. No background, `outline-variant` ghost border (20% opacity), text in `primary`.
*   **States:** On hover, primary buttons should scale slightly (1.02x) rather than just changing color, mimicking a tactile tech interface.

### Cards & Comparison Tables
*   **Cards:** Forbid divider lines. Use `surface-container-highest` for the header area and `surface-container-lowest` for the body to create a natural visual break.
*   **Comparison Tables:** Instead of grid lines, use alternating row tints of `surface-container-low` and `surface-container-lowest`. Use `tertiary` (#00C853) for "Secure" status indicators to provide instant reassurance.

### Input Fields
*   Floating labels using `label-md`. The input container should use `surface-container-low` with a `none` border, gaining a `secondary` (#0066FF) ghost border only upon focus.

### Additional Signature Component: "The Status Halo"
For smart lock states, use a large, soft radial gradient (the "Halo") behind the lock icon. **Green Halo** (`tertiary_container`) for Secured, **Soft Red Halo** (`error_container`) for Unlocked.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical margins (e.g., 80px left, 120px right) in desktop hero sections to create a custom, high-end feel.
*   **Do** use `secondary` (#0066FF) sparingly as a "laser pointer" to guide the user’s eye to the most important action.
*   **Do** leverage `backdrop-blur` on all overlay elements (modals, dropdowns) to maintain the "Glass" architecture.

### Don’t:
*   **Don’t** use 1px dividers to separate list items. Use 16px–24px of vertical whitespace (`body-lg` spacing) instead.
*   **Don’t** use pure black (#000000) for text. Always use `on-surface` (#1A1C1D) to maintain a soft, premium contrast.
*   **Don’t** use standard "Drop Shadows." If it looks like a default Photoshop effect, it is wrong. Think "Ambient Glow."