# Azure AI Gateway Scene Explorer

A static, responsive GitHub Pages site with a high-level introduction and nine animated Azure API Management AI Gateway scenarios from the October 2026 AI Gateway presentation.

## Preview

Open [index.html](index.html) directly in a browser. No installation, build, server, or API keys are needed. Fonts load from Google Fonts when available, with local fallbacks. All scene assets and application code are local.

The default opening page, `index.html#high-level-understanding`, introduces the gateway architecture, the challenges it addresses, its three capability groups, the request flow, and shared responsibilities. It appears as entry 00 before scenes 01–09.

Entry 10, `index.html#customer-questions`, adds a sample logical Azure architecture, APIM-managed and Foundry-managed integration paths, a monthly usage-based cost worksheet, production FAQs, and an architecture workshop checklist. Supporting Microsoft documentation was checked on October 29, 2026. Revalidate feature availability, preview status, networking, and prices for each customer.

Entry 11, `index.html#azure-architecture`, describes a concrete single-region private employee-assistant reference design: App Service, APIM Standard v2, Azure OpenAI, separate integration subnets and private endpoints, Entra identities, and monitoring. It includes an expandable SVG architecture diagram with local Azure service icons, a request walkthrough, resource inventory and ownership, implementation sequence, acceptance evidence, and official sample links. It is not a deployed environment or a ready-to-run template. Microsoft's supplemental network diagram loads from Microsoft Learn; the main deployment diagram is rendered locally. The Azure service icons in `assets/azure-icons` are from the [Azure icon collection](https://github.com/benc-uk/icon-collection/tree/master/azure-icons); Azure product icons are Microsoft assets. The Cognitive Services icon represents the Azure OpenAI service, and the directory icon represents Entra ID.

The cost worksheet has illustrative workload defaults but no default prices. Supply verified USD model token rates and monthly APIM and supporting-service totals. It runs locally, does not call pricing APIs or store inputs, and is not a quote. PTU, tax, support, special token discounts, and items excluded from the supplied totals require a separate estimate. For a calculation check, 1,000,000 calls with 1,000 input and 300 output tokens at hypothetical rates of $0.15 and $0.60 per million tokens produce $330 of model usage; adding hypothetical monthly APIM and supporting-service totals of $700 and $150 yields $1,180. These numbers are test assumptions, not Azure prices.

Each scene has a shareable hash URL, such as `index.html#semantic-caching`. The sidebar, previous/next links, and browser back/forward history navigate between the overview and scenes. Animation controls provide pause/play and an expanded view; reduced-motion preferences start animations paused.

## Publish On GitHub Pages

1. Push this folder's contents to your GitHub repository, including `Scenes` and the PowerPoint.
2. In the repository, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose your branch (usually `main`) and **/ (root)**, then save.
5. Open the URL GitHub provides once publication finishes, typically `https://<owner>.github.io/<repository>/`.

All asset links are relative, so repository subpaths work without configuration. For a private repository, confirm your organization's GitHub Pages publishing and access policies first. The site exposes the scene assets and downloadable presentation to whoever can access the published site; review the deck and any customer references before publishing publicly.

## Content And Maintenance

- [app.js](app.js) contains the nine scene descriptions, GIF mapping, source slide numbers, and navigation behavior.
- [styles.css](styles.css) defines the responsive layout and visual design.
- [Scenes](Scenes) contains the original 1280 x 720 GIFs. Only the current scene's GIF is loaded into the page.
- The source presentation is [Azure AI Gateway (animated).pptx](Azure%20AI%20Gateway%20(animated).pptx).

Scenario descriptions follow slides 5–13. The shared policy pipeline, responsibility boundaries, and adoption guidance follow slides 14–17, with context from slides 2–4. Implementation considerations distinguish custom patterns from built-in policies and preserve the presentation's illustrative assumptions. This is an explanatory site, not a deployable gateway configuration or a compliance assertion.