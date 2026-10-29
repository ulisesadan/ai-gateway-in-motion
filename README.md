# Azure AI Gateway Scene Explorer

A static, responsive GitHub Pages site for the nine animated Azure API Management AI Gateway scenarios in the October 2026 Inbursa presentation.

## Preview

Open [index.html](index.html) directly in a browser. No installation, build, server, or API keys are needed. Fonts load from Google Fonts when available, with local fallbacks. All scene assets and application code are local.

Each scene has a shareable hash URL, such as `index.html#semantic-caching`. The sidebar, previous/next links, and browser back/forward history navigate between scenes. Animation controls provide pause/play and an expanded view; reduced-motion preferences start animations paused.

## Publish On GitHub Pages

1. Push this folder's contents to your GitHub repository, including `Scenes` and the PowerPoint.
2. In the repository, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose your branch (usually `main`) and **/ (root)**, then save.
5. Open the URL GitHub provides once publication finishes, typically `https://<owner>.github.io/<repository>/`.

All asset links are relative, so repository subpaths work without configuration. For a private repository, confirm your organization's GitHub Pages publishing and access policies first. The site exposes the scene assets and downloadable presentation to whoever can access the published site; review the deck and Inbursa references before publishing publicly.

## Content And Maintenance

- [app.js](app.js) contains the nine scene descriptions, GIF mapping, source slide numbers, and navigation behavior.
- [styles.css](styles.css) defines the responsive layout and visual design.
- [Scenes](Scenes) contains the original 1280 x 720 GIFs. Only the current scene's GIF is loaded into the page.
- The source presentation is [Inbursa - Azure AI Gateway (animated).pptx](Inbursa%20-%20Azure%20AI%20Gateway%20(animated).pptx).

Scenario descriptions follow slides 5–13. The shared policy pipeline, responsibility boundaries, and adoption guidance follow slides 14–17, with context from slides 2–4. Implementation considerations distinguish custom patterns from built-in policies and preserve the presentation's illustrative assumptions. This is an explanatory site, not a deployable gateway configuration or a compliance assertion.