# Site section artwork

Original AI-generated abstract network and satin-ribbon artwork is used throughout the public landing story, login scene, dashboard chapters, authenticated page headers and section panels, plus signature experiences.

## Nonintrusive implementation

- CSS background paint only; no new DOM overlays, z-index layers, pointer handlers or layout changes.
- Existing routes, authentication, API calls and financial logic unchanged.
- Text-side dark overlays and gentler light-theme overlays preserve readable content.
- Financial chart/table and conversation panel interiors remain opaque.
- Existing safety-state lighting and signature chapter/status colors retained.
- Fixed controls and navigation remain clear; no new animations or runtime libraries.
- High-contrast/forced-color mode removes the decorative backgrounds.

## Performance

Two original artworks, each with a smaller mobile WebP variant:

| Asset | Bytes |
| --- | ---: |
| signal-network.webp | 20,636 |
| clarity-ribbons.webp | 14,900 |
| signal-network-mobile.webp | 7,844 |
| clarity-ribbons-mobile.webp | 6,038 |
| Total shipped files | 49,418 |

Assets are local, hashed by Vite and reusable from cache. No external stock-image request is needed.

## Verification

- Production build and TypeScript passed.
- 44 route/viewport views rendered, plus light-theme and drawer views; individual visual inspection completed.
- 120 original application route/viewport checks at six widths: no horizontal overflow issues or page errors.
- Seven axe WCAG A/AA UI states: no detected violations (not a full certification).
- Drawer focus/trap/restoration, login/logout, CSV validation and analysis-to-recovery interactions passed.
- Backgrounds-on/off comparison showed no changes to section, button, input or header geometry.
- Warning/critical state lighting and forced-color fallback verified.
- A pre-existing white-on-yellow signature upload-panel contrast issue was found during visual QA and corrected with a dark foreground; affected desktop/mobile views rechecked.
