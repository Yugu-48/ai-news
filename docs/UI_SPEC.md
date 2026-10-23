# UI specification

- Existing Catppuccin-inspired light/dark CSS tokens and Geist typography remain the design foundation.
- Homepage: sticky navigation, latest headline ticker, editorial introduction, feed counts, search and topic lenses, featured cover, responsive article cards, footer.
- Topic lenses: All News, Breaking (published within 24 hours), AI Models, Research, Companies, Open Source, AI Policy, AI Hardware. Saved and Liked are browser-local lists.
- Article: source, publication date, excerpt, original-publication link, share, bookmark and related stories. Source images are optional; CSS fallbacks must remain legible.
- Responsive intent: desktop navigation on large screens, menu on narrower screens, one-column cards on phones and wider grids above that.
- Accessible behavior: keyboard focus on links and controls; bookmark/like controls are outside article links. Search and tag selector have labels.
- Route loading uses the existing skeleton card. Route errors show a retry action. Empty feeds and unmatched searches have separate states.

Known gaps: no reliable trending score and no dedicated research page. A 390px Chrome device emulation measured equal viewport and document width, opened the mobile menu, filtered Research stories, searched for an absent phrase, and toggled theme. This checks core interactions, though physical devices and multiple browsers still need review.
