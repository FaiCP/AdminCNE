# Design System Specification: Atmospheric Precision

## 1. Overview & Creative North Star
**Creative North Star: The Nocturnal Command Center**

This design system is engineered to evoke a sense of high-stakes precision and sophisticated calm. Moving away from the sterile, flat "SaaS-standard" aesthetic, we prioritize **Atmospheric Depth**. By utilizing a palette of deep midnight obsidians and ethereal lavenders, the UI mimics a premium hardware interface or a high-end editorial digital experience. 

The system rejects traditional structural scaffolding—such as rigid grid lines and high-contrast borders—in favor of **Tonal Layering**. Importance is conveyed through luminosity and subtle "glows" rather than containment. The result is a layout that feels expansive, integrated, and intentionally curated, where every element appears to float within a cohesive, dark-matter environment.

---

## 2. Colors
Our color philosophy centers on the interaction between deep shadows and soft, radioactive light.

### Color Tokens (Material Design Scale)
*   **Background:** `#0c0e15` (Deep Midnight)
*   **Primary:** `#a8a4ff` (Soft Lavender)
*   **Surface Tiers:** 
    *   `surface_container_lowest`: `#000000`
    *   `surface_container_low`: `#11131b`
    *   `surface_container`: `#171922`
    *   `surface_container_high`: `#1d1f28`
    *   `surface_container_highest`: `#23252f`

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections or cards. 
Structure must be achieved through background shifts. For example, a card (`surface_container_highest`) should sit directly on the background (`surface`) without a stroke. The contrast in value provides all the necessary information for the eye to perceive the boundary.

### Signature Textures & Glass
To achieve the premium "TICS" feel, use **Glassmorphism** for navigational overlays or floating tooltips. Use a semi-transparent `surface_variant` with a 12px–20px backdrop-blur. Main CTAs should utilize a subtle linear gradient from `primary` (#a8a4ff) to `primary_container` (#9994ff) at a 135-degree angle to create a "liquid light" effect.

---

## 3. Typography
The system uses a dual-font approach to balance authoritative presence with technical clarity.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "tech-humanist" feel. Use `display-lg` and `headline-md` to create clear editorial focal points. Keep letter-spacing tight (-0.02em) for large headings.
*   **Body & Labels (Inter):** The workhorse font. Inter’s tall x-height ensures maximum readability on dark backgrounds. Use `body-md` for general content and `label-sm` (uppercase with 0.05em tracking) for secondary metadata to create a "control panel" feel.

**Hierarchy Note:** Use color to drive emphasis. Titles should use `on_surface` (#e7e7f1), while secondary descriptions must drop to `on_surface_variant` (#aaaab4) to create a visual "recession" in the layout.

---

## 4. Elevation & Depth
Depth is not an afterthought; it is the primary structural tool.

*   **The Layering Principle:** Stacking follows a "Lower is Deeper" logic. The main page background is `surface`. Interactive elements or primary cards should "rise" by using `surface_container_high`.
*   **Ambient Shadows:** Traditional shadows are banned. If a floating element requires lift, use a diffuse shadow: `blur: 40px`, `y: 12px`, `opacity: 6%`, with the shadow color set to `surface_container_lowest`.
*   **The "Ghost Border" Fallback:** In rare accessibility cases where a border is required, use the `outline_variant` token at **15% opacity**. This creates a "glint" effect rather than a hard line.
*   **Soft Glows:** High-priority cards (like the "Active Inventory" in the TICS panel) can use a very subtle inner-shadow or outer-glow using the `primary` color at 5% opacity to signify focus.

---

## 5. Components

### Cards
*   **Style:** Large `xl` (1.5rem) corner radius. No borders.
*   **Interaction:** On hover, transition the background from `surface_container_high` to `surface_container_highest` and increase the icon's luminosity.
*   **Content:** Forbid divider lines. Use `spacing-6` (2rem) vertical whitespace to separate header text from body content.

### Buttons
*   **Primary:** Gradient fill (Primary to Primary Container), white text (`on_primary_fixed`), `md` (0.75rem) roundedness.
*   **Secondary:** Ghost style. No fill, `outline_variant` (at 20% opacity) border, `primary` text color.

### Icons
*   **Container:** Icons should live within a "Soft Glass" container—a `sm` (0.25rem) or `md` (0.75rem) rounded box with a subtle lavender tint (`primary_dim` at 10% opacity).
*   **Weight:** Use "Light" or "Regular" weights to maintain the editorial aesthetic.

### Input Fields
*   **Visual:** `surface_container_low` background with a `surface_container_highest` bottom-border (2px) only. This creates a "form-as-architecture" look. Focus state transitions the bottom border to `primary`.

### Navigation (The Header)
*   Keep the background transparent or `surface_container_low` with a backdrop-blur. Use `title-sm` for nav links, ensuring ample `spacing-8` between items.

---

## 6. Do's and Don'ts

### Do
*   **DO** use intentional asymmetry. A perfectly centered grid often feels like a template. Offset a headline or leave a column empty to create breathing room.
*   **DO** use the `primary` color sparingly. It is a "signal" color—use it for icons, active states, and CTAs only.
*   **DO** rely on the `surface` hierarchy to define content groups instead of boxes-within-boxes.

### Don't
*   **DON'T** use pure white (#FFFFFF) for text. It vibrates too harshly against the midnight background. Use `on_surface` (#e7e7f1).
*   **DON'T** use 1px borders or lines. If you feel you need a line, use a 32px whitespace gap instead.
*   **DON'T** use high-contrast shadows. If a shadow is "visible" as a shape, it is too dark. It should be felt, not seen.