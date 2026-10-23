# AI News editorial color direction

The interface uses warm paper, dark ink, forest green for navigation/actions, and restrained clay, blue and ochre for topic markers. Serif mastheads and section headings establish a newspaper feel. Plain backgrounds, thin rules and quieter cards replace purple gradients, glowing shadows and delayed card entrances. Light is the default; an existing user's saved theme preference still applies.

Research consulted on 2026-10-12:

- [Nielsen Norman Group: Using Color to Enhance Your Design](https://www.nngroup.com/articles/color-enhance-design/) recommends a limited palette, mostly neutral surfaces, consistent accent roles, and testing the applied palette.
- [GOV.UK Design System: Colour](https://design-system.service.gov.uk/styles/colour/) emphasizes text and interactive-element contrast. Its guidance informed contrast checks, rather than copying its government brand palette.

The selected colors are a design interpretation of these principles. In the browser, light-mode body text, muted description text and primary navigation text against the paper background measured 14.50:1, 5.47:1 and 6.83:1 respectively. These checks cover those specific pairs, not every element or a complete accessibility audit. Topic names and active-link underlines make navigation understandable without relying on color alone. Reduced-motion preferences disable animated decorations.

System fonts (Segoe UI/Arial, Georgia, Consolas) avoid font downloads during builds and page loads. Article photographs remain source images when feed metadata provides them, otherwise illustrative category photographs; story metadata always comes from actual feeds.
