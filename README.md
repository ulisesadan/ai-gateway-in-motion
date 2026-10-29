# Azure AI Gateway Scene Explorer

A static, responsive GitHub Pages site with a high-level introduction, nine animated Azure API Management AI Gateway scenarios, customer FAQs, and a concrete Azure reference architecture.

## Preview

Open [index.html](index.html) directly in a browser. No installation, build, server, or API keys are needed. Fonts load from Google Fonts when available, with local fallbacks. All scene assets and application code are local.

The default opening page, `index.html#high-level-understanding`, introduces the gateway architecture, the challenges it addresses, its three capability groups, the request flow, and shared responsibilities. It appears as entry 00 before scenes 01–09.

Entry 10, `index.html#customer-questions`, adds a sample logical Azure architecture, APIM-managed and Foundry-managed integration paths, a monthly usage-based cost worksheet, production FAQs, and an architecture workshop checklist. Supporting Microsoft documentation was checked on October 29, 2026. Revalidate feature availability, preview status, networking, and prices for each customer.

Entry 11, `index.html#azure-architecture`, describes a concrete single-region private employee-assistant reference design: App Service, APIM Standard v2, Azure OpenAI, separate integration subnets and private endpoints, Entra identities, and monitoring. It includes an expandable SVG architecture diagram with local Azure service icons, a request walkthrough, resource inventory and ownership, implementation sequence, acceptance evidence, and official sample links. It is not a deployed environment or a ready-to-run template. Microsoft's supplemental network diagram loads from Microsoft Learn; the main deployment diagram is rendered locally. The Azure service icons in `assets/azure-icons` are from the [Azure icon collection](https://github.com/benc-uk/icon-collection/tree/master/azure-icons); Azure product icons are Microsoft assets. The Cognitive Services icon represents the Azure OpenAI service, and the directory icon represents Entra ID.

The cost worksheet has illustrative workload defaults but no default prices. Supply verified USD model token rates and monthly APIM and supporting-service totals. It runs locally, does not call pricing APIs or store inputs, and is not a quote. PTU, tax, support, special token discounts, and items excluded from the supplied totals require a separate estimate. For a calculation check, 1,000,000 calls with 1,000 input and 300 output tokens at hypothetical rates of $0.15 and $0.60 per million tokens produce $330 of model usage; adding hypothetical monthly APIM and supporting-service totals of $700 and $150 yields $1,180. These numbers are test assumptions, not Azure prices.

Each scene has a shareable hash URL, such as `index.html#semantic-caching`. The sidebar, previous/next links, and browser back/forward history navigate between the overview and scenes. Animation controls provide pause/play and an expanded view; reduced-motion preferences start animations paused.

## Publish On GitHub Pages

1. Push the site files and the `Scenes` and `assets` folders to your GitHub repository.
2. In the repository, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose your branch (usually `main`) and **/ (root)**, then save.
5. Open the URL GitHub provides once publication finishes, typically `https://<owner>.github.io/<repository>/`.

All asset links are relative, so repository subpaths work without configuration. For a private repository, confirm your organization's GitHub Pages publishing and access policies first. The site exposes its content and scene assets to whoever can access the published site; review any customer references before publishing publicly.

## Content And Maintenance

- [app.js](app.js) contains the nine scene descriptions, GIF mapping, reference guides, and navigation behavior.
- [styles.css](styles.css) defines the responsive layout and visual design.
- [Scenes](Scenes) contains the original 1280 x 720 GIFs. Only the current scene's GIF is loaded into the page.
- Further reading links point to [Microsoft Learn AI Gateway capabilities](https://learn.microsoft.com/azure/api-management/genai-gateway-capabilities), the [APIM policy reference](https://learn.microsoft.com/azure/api-management/api-management-policies), and the [Azure AI Gateway labs](https://github.com/Azure-Samples/AI-Gateway).

Implementation considerations distinguish custom patterns from built-in policies. Scenarios, figures, and adoption timings are illustrative; validate current capabilities, tier support, and policy behavior against Microsoft Learn and the linked labs. This is an explanatory site, not a deployable gateway configuration or a compliance assertion.