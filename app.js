const scenes = [
  {
    id: 'centralized-ai-access', title: 'Centralized AI access & governance', nav: 'Centralized AI access', category: 'Visibility & governance',
    subtitle: 'One governed front door between every AI consumer and every approved model, agent, and tool.',
    does: 'Gives every channel a single entry point with consistent gateway policies. Azure API Management calls the models using managed identity.',
    matters: 'Web, mobile, internal applications, and employees use the same controls instead of calling model endpoints directly. Teams no longer need to duplicate governance in every application.',
    tech: ['APIM as AI gateway', 'Managed identity', 'Private endpoints', 'Entra ID-only model authentication'],
    note: 'Blocking direct model access requires network and authentication settings on the model resources. APIM alone does not prevent bypass.',
    flow: ['Web / mobile / internal apps', 'AI Gateway', 'Managed identity', 'Approved models'], slide: 5,
    alt: 'Animated isometric diagram of multiple application channels accessing approved AI models through a central API Management gateway.'
  },
  {
    id: 'authentication-authorization', title: 'Authentication & access control', nav: 'Authentication & access', category: 'Security & safety',
    subtitle: 'Verify who is calling before a request ever reaches the model.',
    does: 'Validates Microsoft Entra ID tokens on every call, checking the issuer, audience, and role claims against the API\'s access requirements.',
    matters: 'Expired or invalid tokens receive a 401 before reaching the model. Model API keys do not live in client applications; the gateway uses managed identity for backend access.',
    tech: ['validate-azure-ad-token', 'validate-jwt', 'Microsoft Entra ID', 'Managed identity'],
    note: 'This is an illustrative scenario. Configure roles, audiences, and application registrations for each application in Microsoft Entra ID. Authorization failures may return 403.',
    flow: ['Application + Entra token', 'Validate identity & claims', 'Allow or reject', 'Model'], slide: 6,
    alt: 'Animated isometric scene showing identity validation at the AI gateway, with authorized calls passing and invalid credentials rejected.'
  },
  {
    id: 'rate-limiting-quotas', title: 'Rate limiting & token quotas', nav: 'Rate limiting & quotas', category: 'Scale & resilience',
    subtitle: 'Share model capacity fairly, even when one application gets busy.',
    does: 'Enforces tokens-per-minute limits and optional token quotas per application or subscription through a centrally managed policy.',
    matters: 'One application\'s spike cannot consume the entire shared provisioned throughput (PTU) allocation. Requests over the configured limit receive 429 with Retry-After.',
    tech: ['llm-token-limit', 'APIM products', 'APIM subscriptions', 'Azure OpenAI PTU / Standard'],
    note: 'Token limits in the animation are illustrative. Set actual limits per application and environment during design, and make sure clients respect Retry-After.',
    flow: ['Application request', 'Check token allowance', 'Within limit: model', 'Over limit: 429'], slide: 7,
    alt: 'Animated isometric scene illustrating per-application token allowances and rejection of requests that exceed the configured quota.'
  },
  {
    id: 'model-routing-fallback', title: 'Model routing & fallback', nav: 'Model routing & fallback', category: 'Scale & resilience',
    subtitle: 'Keep applications connected when the primary model backend is under pressure.',
    does: 'Routes calls through a priority-based backend pool: a PTU primary and a Standard secondary deployment in another region.',
    matters: 'When configured 429 or error thresholds are reached, a circuit breaker opens and the retry policy can send requests to the secondary. Applications keep the same gateway endpoint.',
    tech: ['APIM backend pools', 'Priority-based routing', 'Circuit breaker', 'retry policy'],
    note: 'Regions, deployments, and circuit-breaker thresholds are illustrative. Configure the pool, retry conditions, and backend compatibility explicitly; fallback is not automatic without these controls.',
    flow: ['AI Gateway', 'PTU primary', 'Error / open circuit', 'Retry: Standard secondary'], slide: 8,
    alt: 'Animated isometric diagram of a primary provisioned-throughput model and a secondary regional model receiving fallback traffic.'
  },
  {
    id: 'prompt-content-validation', title: 'Prompt & content validation', nav: 'Prompt & content validation', category: 'Security & safety',
    subtitle: 'Apply a consistent safety checkpoint before prompts reach your models.',
    does: 'Screens prompts, and optionally responses, with Azure AI Content Safety using harm categories, Prompt Shields, and custom blocklists.',
    matters: 'In this scenario, flagged jailbreak or prompt-injection attempts receive a 403 at the gateway, preventing the rejected prompt from reaching the model.',
    tech: ['llm-content-safety', 'Azure AI Content Safety', 'Prompt Shields', 'Custom blocklists'],
    note: 'Configure harm categories, severity thresholds, and blocklists per API. Gateway screening complements model content filters and application controls; it cannot detect every unsafe request.',
    flow: ['Incoming prompt', 'Content Safety screening', 'Allow or block (403)', 'Model'], slide: 9,
    alt: 'Animated isometric safety checkpoint screening prompts and blocking flagged content before it reaches an AI model.'
  },
  {
    id: 'sensitive-data-protection', title: 'Sensitive data protection', nav: 'Sensitive data protection', category: 'Security & safety',
    subtitle: 'Reduce exposure of personal information before a prompt leaves the gateway.',
    does: 'A custom policy calls Azure AI Language for personally identifiable information (PII) detection, then masks detected entities with placeholders such as [PERSON] and [PHONE].',
    matters: 'Personal data is masked before the request reaches the model. In this pattern, logging is also configured to retain only redacted text.',
    tech: ['Custom policy pattern', 'send-request', 'set-body', 'Azure AI Language PII detection'],
    note: 'PII masking is a custom integration, not a built-in APIM policy. Detection coverage and redacted logging must be validated. This complements DLP, data classification, and application-level controls.',
    flow: ['Prompt with personal data', 'Detect PII', 'Replace with placeholders', 'Model / redacted logs'], slide: 10,
    alt: 'Animated isometric scene showing personal information detected and replaced with placeholders before a prompt reaches the model.'
  },
  {
    id: 'semantic-caching', title: 'Semantic caching & latency', nav: 'Semantic caching', category: 'Scale & resilience',
    subtitle: 'Answer similar questions faster without repeating the model completion.',
    does: 'Creates an embedding of the prompt and looks for similar prompts in Azure Managed Redis. A cache hit returns the previously stored answer; a miss continues to the model and can populate the cache.',
    matters: 'Repeat questions receive faster answers and cache hits avoid model completion tokens. The presentation illustrates approximately 0.3 seconds for a hit versus 2.4 seconds for a model response.',
    tech: ['llm-semantic-cache-lookup', 'llm-semantic-cache-store', 'Azure Managed Redis (RediSearch)', 'Embeddings deployment'],
    note: 'The latencies and 0.95 similarity threshold are illustrative, not guarantees. Scope cache keys so personalized answers are never shared across users or tenants. Embedding and cache operations still have costs.',
    flow: ['Prompt embedding', 'Similarity lookup', 'Hit: cached answer', 'Miss: model + store'], slide: 11,
    alt: 'Animated isometric diagram comparing a fast semantic cache hit with a slower model request for a cache miss.'
  },
  {
    id: 'token-cost-governance', title: 'Token consumption & cost governance', nav: 'Token & cost governance', category: 'Visibility & governance',
    subtitle: 'Make AI consumption visible to the teams accountable for it.',
    does: 'Emits prompt, completion, and total token metrics with dimensions for channels, applications, APIs, and subscriptions.',
    matters: 'FinOps teams can build dashboards, budgets, alerts, and chargeback views by business line, replacing opaque shared consumption with an attributable usage picture.',
    tech: ['llm-emit-token-metric', 'Application Insights', 'Azure Monitor alerts', 'Azure Monitor workbooks'],
    note: 'All figures, including the 80% budget alert, are illustrative and the scenario is fictional. Token metrics support cost attribution; they are not themselves a billing ledger or a hard spending cap.',
    flow: ['Model interaction', 'Emit token metrics', 'Attribute by channel / app', 'Dashboards & alerts'], slide: 12,
    alt: 'Animated isometric scene showing token usage attributed to business channels and feeding cost dashboards and budget alerts.'
  },
  {
    id: 'monitoring-auditability', title: 'Monitoring, observability & audit', nav: 'Monitoring & auditability', category: 'Visibility & governance',
    subtitle: 'Turn AI traffic into traceable evidence for operations, risk, and audit.',
    does: 'Sends latency, errors, policy outcomes, and optional prompt and completion logs to the configured Application Insights and Log Analytics destinations.',
    matters: 'A traceable record of gateway interactions helps operations investigate failures and gives risk and audit teams evidence of how the configured controls behaved.',
    tech: ['APIM diagnostic settings', 'Gateway + LLM logs', 'Application Insights', 'Log Analytics', 'Azure Monitor alerts'],
    note: 'Prompt and completion logging is optional. Configure redaction, access controls, sampling, and retention in line with your organization\'s privacy and data-retention policies. Logs alone do not guarantee compliance.',
    flow: ['Gateway interaction', 'Metrics & diagnostic logs', 'Log Analytics', 'Operations / risk / audit'], slide: 13,
    alt: 'Animated isometric scene of AI gateway telemetry flowing into monitoring dashboards and traceable audit records.'
  }
];

const icons = {
  pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 4v16M15 4v16"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m8 4 12 8-12 8Z"/></svg>',
  expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg>'
};
const main = document.querySelector('main');
const nav = document.querySelector('#scene-nav');
const menu = document.querySelector('#menu-toggle');
const sidebar = document.querySelector('#sidebar');
const backdrop = document.querySelector('#nav-backdrop');
const dialog = document.querySelector('#animation-dialog');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let currentIndex = null;

const number = index => String(index + 1).padStart(2, '0');
const asset = (scene, index) => `Scenes/${number(index)}-${scene.id}.gif`;
nav.innerHTML = '<a class="scene-link" href="#high-level-understanding"><span class="scene-number">00</span><span>High-level understanding</span><span class="nav-active" aria-hidden="true"></span></a>' + scenes.map((scene, index) => `<a class="scene-link" href="#${scene.id}"><span class="scene-number">${number(index)}</span><span>${scene.nav}</span><span class="nav-active" aria-hidden="true"></span></a>`).join('');
nav.insertAdjacentHTML('beforeend', '<a class="scene-link" href="#customer-questions"><span class="scene-number">10</span><span>Customer questions</span><span class="nav-active" aria-hidden="true"></span></a>');
nav.insertAdjacentHTML('beforeend', '<a class="scene-link" href="#azure-architecture"><span class="scene-number">11</span><span>Azure architecture</span><span class="nav-active" aria-hidden="true"></span></a>');

function setMenu(open) {
  sidebar.classList.toggle('is-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', `${open ? 'Close' : 'Open'} scene navigation`);
  backdrop.hidden = !open;
  if (matchMedia('(max-width: 760px)').matches) sidebar.inert = !open;
}

function pageLink(index, next) {
  if (index === -1 && !next) return '<a class="page-link" href="#high-level-understanding"><span aria-hidden="true">←</span><span><small>OVERVIEW / 00</small>High-level understanding</span></a>';
  if (index === scenes.length && next) return '<a class="page-link next" href="#customer-questions"><span><small>CUSTOMER GUIDE / 10</small>Customer questions</span><span aria-hidden="true">→</span></a>';
  if (index < 0 || index >= scenes.length) return '<span></span>';
  const scene = scenes[index];
  return `<a class="page-link ${next ? 'next' : ''}" href="#${scene.id}">${next ? '' : '<span aria-hidden="true">←</span>'}<span><small>${next ? 'NEXT' : 'PREVIOUS'} SCENE / ${number(index)}</small>${scene.nav}</span>${next ? '<span aria-hidden="true">→</span>' : ''}</a>`;
}

function finishNavigation(initial) {
  setMenu(false);
  if (!initial) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.focus({ preventScroll: true });
  }
  main.classList.remove('scene-enter');
  requestAnimationFrame(() => main.classList.add('scene-enter'));
}

function renderOverview() {
  return `
    <article aria-labelledby="scene-title" class="overview">
      <div class="scene-heading"><span class="eyebrow">The big picture</span><span class="scene-count">OVERVIEW / 00</span></div>
      <h1 id="scene-title">High-level understanding</h1>
      <p class="intro">Azure API Management acts as an AI Gateway: one governed entry point between the applications that use AI and the models, agents, and tools that power them.</p>
      <section class="overview-map" aria-label="High-level AI Gateway architecture">
        <div><h2 class="section-label">AI consumers</h2><p>Web & mobile channels<br>Internal applications<br>Employees & enterprise systems</p></div>
        <span class="overview-arrow" aria-hidden="true">→</span>
        <div class="overview-gateway"><h2 class="section-label">Azure API Management</h2><p><strong>AI Gateway</strong></p><p>Secure access<br>Control capacity & cost<br>Observe every interaction</p></div>
        <span class="overview-arrow" aria-hidden="true">→</span>
        <div><h2 class="section-label">Approved AI backends</h2><p>Azure OpenAI & Foundry models<br>Other supported model APIs<br>Agents & MCP tools</p></div>
      </section>
      <section class="overview-section"><h2>Why put a gateway in front of AI?</h2><p>Direct-to-model access becomes difficult to govern as more teams and channels adopt AI. A gateway moves common controls into a shared enforcement point instead of asking every application to implement them independently.</p><div class="overview-challenges"><section><h3>Scattered access</h3><p>Direct endpoint calls and copied API keys create inconsistent access controls.</p></section><section><h3>Uneven protection</h3><p>Teams may apply different safety checks, personal-data handling, and logging practices.</p></section><section><h3>Shared-capacity contention</h3><p>One application's traffic spike can consume the model capacity other channels need.</p></section><section><h3>Limited accountability</h3><p>Without per-channel token metrics and traces, spend and audit evidence are hard to attribute.</p></section></div></section>
      <section class="overview-section"><h2>Nine capabilities, three outcomes</h2><div class="overview-outcomes">${[
        { title: 'Security & safety', text: 'Who can call, and what can pass.', indices: [1, 4, 5] },
        { title: 'Scale & resilience', text: 'Fair capacity and resilient responses.', indices: [2, 3, 6] },
        { title: 'Visibility & governance', text: 'One front door with attributable usage and traceability.', indices: [0, 7, 8] }
      ].map(group => `<section><h3>${group.title}</h3><p>${group.text}</p><ul>${group.indices.map(index => `<li><a href="#${scenes[index].id}"><span class="scene-number">${number(index)}</span> ${scenes[index].nav}</a></li>`).join('')}</ul></section>`).join('')}</div></section>
      <section class="overview-section"><h2>What happens to a request?</h2><ol class="overview-request"><li><strong>Establish trust.</strong> An application calls the gateway; configured policies validate its identity and authorization.</li><li><strong>Apply guardrails.</strong> Screen content, mask detected PII through a custom integration, and enforce token limits.</li><li><strong>Find an answer.</strong> Check the semantic cache; on a miss, route to an approved backend with configured retry and fallback controls.</li><li><strong>Return with evidence.</strong> Return the response, populate eligible cache entries, and emit the configured metrics and logs.</li></ol><p>Blocked requests and cache hits can end the model path early. This is a conceptual flow, not a ready-to-deploy policy configuration.</p></section>
      <section class="overview-section"><h2>One layer, not the entire security architecture</h2><div class="details-grid"><section><h3>The gateway provides</h3><p>Central policy enforcement, identity-based model access, configured content and PII screening, token controls, routing, caching, and operational evidence.</p></section><section><h3>Your wider architecture still owns</h3><p>Identity lifecycle, network isolation, data classification and DLP, application security, model filters, privacy, retention, and compliance assessments.</p></section></div><aside class="consideration"><span aria-hidden="true">i</span><p><strong>Important boundary.</strong> APIM alone does not block direct model access or guarantee regulatory compliance. Model-side network and authentication controls prevent bypass; PII masking is a custom pattern. Logging and caching require explicit privacy controls.</p></aside></section>
      <section class="overview-section"><h2>Start small, validate end to end</h2><p>Agree the architecture with security and risk teams, choose one or two pilot use cases, and define quotas, policies, and measurable outcomes. Validate latency, token usage, blocked requests, fallback behavior, and logging in non-production before expanding.</p><p class="overview-source">Based on slides 2–4 and 14–17 of the October 2026 AI Gateway briefing. Scenarios, figures, and rollout timings are illustrative, not evidence of a deployed implementation.</p></section>
      <nav class="scene-pagination" aria-label="Adjacent scenes"><span></span>${pageLink(0, true)}</nav>
    </article>`;
}

function renderCustomerQuestions() {
  const costInputs = [
    { name: 'calls', label: 'Model calls / month', value: '1000000', step: '1' },
    { name: 'inputTokens', label: 'Average input tokens / call', value: '1000', step: '1' },
    { name: 'outputTokens', label: 'Average output tokens / call', value: '300', step: '1' },
    { name: 'inputRate', label: 'Input price / 1M tokens (USD)', value: '', step: 'any' },
    { name: 'outputRate', label: 'Output price / 1M tokens (USD)', value: '', step: 'any' },
    { name: 'gateway', label: 'Total APIM / month (USD)', value: '', step: 'any' },
    { name: 'supporting', label: 'Other services / month (USD)', value: '', step: 'any' }
  ];
  const questions = [
    ['Can we reuse an existing API Management instance?', 'Often, yes. For an APIM-managed integration, validate the instance\'s supported policies, networking, available capacity, isolation needs, and operational ownership. The Foundry portal association path has additional requirements: the existing instance must be a supported v2 tier in the same tenant and subscription as the Foundry resource, and the operator needs the required permissions. Separate production and non-production where the risk model requires it.'],
    ['Which APIM tier should we choose?', 'Choose from the required features, not only request volume. Developer is for non-production and has no production SLA. Standard v2 supports outbound virtual network integration and inbound gateway private endpoints; Premium v2 also supports virtual network injection and zone redundancy. Availability, AI policy support, capacity, and limits vary by tier and region. Confirm the current feature matrix before selecting or pricing a SKU.'],
    ['Can the architecture be private end to end?', 'Yes, with a supported tier and a designed network path. A common pattern uses private connectivity from enterprise clients to the APIM gateway, outbound connectivity from APIM to model private endpoints, private DNS resolution, and restricted model public access. Private client access and private backend access are separate configurations. Public customer channels normally reach an application backend first; the application backend can call the private gateway. Model authentication and network controls must prevent bypass.'],
    ['Does model fallback also make the gateway highly available?', 'No. A secondary model protects against some backend failures, not an outage of the gateway itself. Design gateway availability, DNS or traffic management, capacity, and regional failover separately. Premium v2 supports zone redundancy, while built-in multi-region deployment is not currently available in v2 tiers. Validate the appropriate classic-tier or multi-instance design when multi-region gateway resilience is required. Test failover and confirm that approved data geographies are respected.'],
    ['How much latency does the gateway add? Does streaming still work?', 'There is no universal overhead figure. Token validation, policy execution, network hops, content-safety calls, PII detection, and embedding lookups have different costs. Measure p50, p95, time to first token, and streaming duration using representative prompts and concurrency. Validate streaming support and buffering behavior for the selected API, model, and policies; do not assume that a policy tested on a non-streaming response behaves identically on a stream.'],
    ['Are our prompts stored, or used to train models?', 'Gateway logging and model-provider data handling are different concerns. Prompt and completion logging in APIM is optional; configure redaction, sampling, retention, and access controls explicitly. Separately review the selected provider\'s terms, model deployment type, data processing geography, and applicable abuse-monitoring rules. Do not assume every Foundry catalog model has identical data-handling terms. Semantic caches also store answers and need tenant or user scoping and expiration.'],
    ['Where do RAG, agents, and MCP tools fit?', 'Retrieval-augmented generation (RAG) and agent orchestration remain in the application or agent service. That service calls approved model and tool endpoints through the gateway where configured. APIM can govern model APIs and supported MCP or agent interfaces; it does not automatically govern traffic that bypasses it. Search indexes, data stores, document-level authorization, tool permissions, and evaluations remain separate controls and costs.'],
    ['Do token quotas guarantee a hard financial budget?', 'No. Token limits constrain configured traffic counters; actual charges also depend on model prices, input versus output tokens, provisioned capacity, retries, tools, and supporting services. Azure budget alerts are notifications, not a universal spending stop. Establish per-application limits, alert owners, escalation actions, and a tested disable or containment process. Track actual billing alongside gateway token metrics.'],
    ['Who operates this, and what changes in the applications?', 'A platform team typically owns APIM, shared policies, model onboarding, network paths, and telemetry. Application teams own prompts, authorization context, retries, evaluations, and end-user behavior. For imported model APIs, clients normally change the endpoint and authentication configuration while preserving a compatible API contract. Verify the base path, deployment mapping, headers, API version, timeouts, streaming, and SDK behavior in a pilot.'],
    ['What should we prove before production?', 'Demonstrate authorized access and rejection, no direct model bypass, fair token allocation, model and gateway failure behavior, tenant-safe caching, PII handling, acceptable p95 latency, and traceability without sensitive-data leakage. Agree SLOs, load-test results, capacity headroom, cost attribution, incident ownership, retention, change control, and rollback criteria with security, risk, and operations.']
  ];
  return `
    <article aria-labelledby="scene-title" class="overview customer-guide">
      <div class="scene-heading"><span class="eyebrow">From concept to customer decisions</span><span class="scene-count">CUSTOMER GUIDE / 10</span></div>
      <h1 id="scene-title">Customer questions</h1>
      <p class="intro">A practical reference for architecture, expected cost, Microsoft Foundry integration, and the decisions that turn an AI Gateway concept into a production plan.</p>
      <section class="overview-section"><h2>What could the Azure architecture look like?</h2><p>A sample logical architecture for an enterprise application using Azure OpenAI models in Microsoft Foundry. Components marked optional are added only when the scenario needs them.</p>
        <figure class="reference-architecture">
          <div class="architecture-identity"><strong>Microsoft Entra ID</strong><span>Client identity → APIM token validation · APIM managed identity → model access</span></div>
          <div class="overview-map"><div><h3 class="section-label">Application layer</h3><p>Web / mobile experiences<br>Enterprise application backend<br>Employee assistants</p></div><span class="overview-arrow" aria-hidden="true">→</span><div class="overview-gateway"><h3 class="section-label">Azure API Management</h3><p><strong>AI Gateway</strong></p><p>Identity & policy enforcement<br>Token limits & backend pools<br>Metrics & diagnostics</p></div><span class="overview-arrow" aria-hidden="true">→</span><div><h3 class="section-label">Microsoft Foundry</h3><p>Azure OpenAI deployment<br>Primary model endpoint<br>Optional secondary deployment</p></div></div>
          <div class="architecture-support"><section><h3>Optional policy dependencies</h3><p>Azure AI Content Safety<br>Azure AI Language for custom PII masking<br>Azure Managed Redis + embeddings for caching</p></section><section><h3>Observability</h3><p>Application Insights + Log Analytics<br>Azure Monitor alerts and workbooks<br>Configured privacy and retention controls</p></section><section><h3>Private deployment option</h3><p>Tier-appropriate APIM networking<br>Model private endpoints + private DNS<br>Restricted public access on model resources</p></section></div>
          <figcaption class="overview-source">Logical connections, not a subnet or deployment diagram. Response traffic follows the reverse path. Supporting services are called or receive telemetry only when configured.</figcaption>
        </figure>
        <aside class="consideration"><span aria-hidden="true">i</span><p><strong>Scope matters.</strong> The gateway governs traffic that flows through it. Application hosting, RAG search, data stores, agent execution, private connectivity, and regional resilience must be designed and budgeted separately. This sample is illustrative, not evidence of an implemented customer architecture.</p></aside>
      </section>
      <section class="overview-section"><h2>How does it integrate with Microsoft Foundry?</h2><div class="details-grid"><section><h3>Path A · Configure in API Management</h3><ol class="guide-steps"><li>Deploy an approved model in Foundry.</li><li>Import its API into APIM using the Microsoft Foundry import experience and select the compatible API contract.</li><li>Configure and verify the backend managed identity and model access. For Azure OpenAI, the documented inference role is Cognitive Services OpenAI User, scoped to the model resource.</li><li>Validate the client token separately, then apply the required token, routing, safety, and telemetry policies.</li><li>Point the application at the APIM API endpoint and test the complete request path.</li></ol></section><section><h3>Path B · Associate in Foundry</h3><p>The integrated AI Gateway experience in Foundry is marked <strong>preview</strong> in the capability guidance. In Foundry, use Manage → AI Gateway to create or associate an eligible APIM instance, then enable the relevant projects.</p><p>Reusing an instance requires a supported v2 tier in the same tenant and subscription, plus the required permissions. Existing projects must be enabled explicitly. Confirm current prerequisites, networking, and preview terms before production.</p></section></div><p>APIM is the governance gateway; Foundry supplies the model and agent development environment and associated services. Creating a Foundry project alone does not make arbitrary application traffic pass through APIM.</p><div class="references"><a href="https://learn.microsoft.com/azure/api-management/azure-ai-foundry-api" target="_blank" rel="noopener noreferrer">Import a Foundry API ↗</a><a href="https://learn.microsoft.com/azure/foundry/configuration/enable-ai-api-management-gateway-portal" target="_blank" rel="noopener noreferrer">Foundry gateway setup ↗</a><a href="https://learn.microsoft.com/azure/api-management/api-management-authenticate-authorize-ai-apis" target="_blank" rel="noopener noreferrer">Authentication guidance ↗</a></div></section>
      <section class="overview-section"><h2>What should we expect to pay?</h2><p>There is no single AI Gateway price for every architecture. AI Gateway capabilities extend APIM rather than replacing model billing. Build an estimate for the selected region, currency, SKU, model deployment type, usage, and commercial agreement.</p>
        <div class="cost-table-wrapper"><table class="cost-table"><caption>Monthly cost components</caption><thead><tr><th scope="col">Component</th><th scope="col">What drives the charge</th><th scope="col">Planning decision</th></tr></thead><tbody>
          <tr><th scope="row">API Management</th><td>Tier, units, running time, requests or overages where applicable, and additional gateways.</td><td>Price the total configured gateway footprint, including non-production and resilience.</td></tr>
          <tr><th scope="row">Model inference</th><td>Input and output tokens for usage-based deployments, or provisioned capacity and commitment terms.</td><td>Compare pay-as-you-go with PTU at realistic utilization. They are different billing models.</td></tr>
          <tr><th scope="row">Optional AI controls</th><td>Content Safety, Language PII detection, embeddings, and Redis capacity or usage.</td><td>Add only the services required by the policies; cache hits do not eliminate every cost.</td></tr>
          <tr><th scope="row">Monitoring</th><td>Log ingestion, retention, export, alerts, and related telemetry charges.</td><td>Forecast volume with privacy-aware sampling and retention settings.</td></tr>
          <tr><th scope="row">Network & application</th><td>Private endpoints, data processing, DNS, inter-region transfer, application hosting, search, tools, and storage.</td><td>Include the surrounding workload and operational costs, not just APIM.</td></tr>
        </tbody></table></div>
        <h3>Usage-based monthly worksheet</h3><p>The workload defaults below are illustrative. Supply verified USD prices and monthly service totals from your quote or Azure Pricing Calculator; use 0 only for a cost you have deliberately excluded. No live prices are fetched or stored.</p>
        <form id="cost-form" class="cost-form" aria-label="Monthly cost assumptions">${costInputs.map(field => `<label for="cost-${field.name}">${field.label}<input id="cost-${field.name}" name="${field.name}" type="number" min="0" step="${field.step}" value="${field.value}" ${field.value === '' ? 'placeholder="Verified price"' : ''} required></label>`).join('')}</form>
        <div class="cost-result"><h3>Calculated monthly subtotal</h3><output id="cost-result" for="cost-calls cost-inputTokens cost-outputTokens cost-inputRate cost-outputRate cost-gateway cost-supporting" aria-live="polite">Enter all price fields to calculate a subtotal.</output></div>
        <p class="cost-formula">Model cost = calls × (input tokens × input price + output tokens × output price) ÷ 1,000,000.<br>Subtotal = model cost + APIM + other services.</p>
        <aside class="consideration"><span aria-hidden="true">i</span><p><strong>Not a quote.</strong> This simple worksheet assumes one usage-based model and average billable tokens; it does not model PTU, cached-input discounts, batch rates, or multiple model prices. Count billable calls, including retries and agent steps, and include RAG context in input tokens. It excludes tax, support, and any items omitted from your service totals.</p></aside>
        <div class="references"><a href="https://azure.microsoft.com/pricing/calculator/" target="_blank" rel="noopener noreferrer">Azure Pricing Calculator ↗</a><a href="https://azure.microsoft.com/pricing/details/api-management/" target="_blank" rel="noopener noreferrer">APIM pricing ↗</a><a href="https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/" target="_blank" rel="noopener noreferrer">Azure OpenAI pricing ↗</a></div>
      </section>
      <section class="overview-section"><h2>Common questions before production</h2>${questions.map(([question, answer]) => `<details class="context-section"><summary>${question}</summary><div class="context-body"><p>${answer}</p></div></details>`).join('')}</section>
      <section class="overview-section"><h2>What to bring to the architecture workshop</h2><ul class="guide-checklist"><li>Approved use cases, caller identities, data classifications, and permitted data geographies.</li><li>Model and API choices, monthly calls, average tokens, peak concurrency, and streaming requirements.</li><li>Availability targets, network constraints, expected growth, and existing APIM capacity.</li><li>Commercial rates, chargeback ownership, logging and retention requirements, and pilot acceptance criteria.</li></ul><p class="overview-source">Supplementary customer guidance checked against Microsoft documentation on October 29, 2026. Features, preview status, regional availability, and prices can change. This page extends the source presentation; it is not a customer-specific design, compliance assessment, or price quote.</p><div class="references"><a href="https://learn.microsoft.com/azure/api-management/genai-gateway-capabilities" target="_blank" rel="noopener noreferrer">AI Gateway capabilities ↗</a><a href="https://learn.microsoft.com/azure/api-management/v2-service-tiers-overview" target="_blank" rel="noopener noreferrer">APIM v2 tiers & networking ↗</a><a href="https://learn.microsoft.com/azure/api-management/api-management-features" target="_blank" rel="noopener noreferrer">Tier feature comparison ↗</a></div></section>
      <nav class="scene-pagination" aria-label="Adjacent scenes">${pageLink(scenes.length - 1, false)}<a class="page-link next" href="#azure-architecture"><span><small>REFERENCE ARCHITECTURE / 11</small>Azure architecture</span><span aria-hidden="true">→</span></a></nav>
    </article>`;
}

function renderAzureArchitecture() {
  const resources = [
    ['Application', 'App Service plan + web app', 'app-ai-assistant', 'Application team', 'Hosts the employee UI and server-side model client. Use a tier supporting private endpoints and VNet integration; size and scale after load testing.'],
    ['Governance', 'API Management · Standard v2', 'apim-ai-gateway', 'API platform team', 'Imports the Azure OpenAI API; validates caller tokens, applies per-application token limits, selects backends, and emits telemetry. This is a starting SKU, not a production capacity recommendation.'],
    ['Inference', 'Azure OpenAI resource + model deployment', 'aoai-assistant / assistant-model', 'AI platform team', 'Provides the approved model endpoint managed through Foundry. Select model version, deployment type, region, quota, and content filters explicitly. Foundry is not an extra proxy in the request path.'],
    ['Network', 'VNet, 3 subnets, 3 private endpoints + private DNS', 'vnet-ai / snet-app / snet-apim / snet-pe', 'Network team', 'Separate App Service outbound integration, APIM outbound integration, and private endpoints. Add or reuse corporate VPN / ExpressRoute and hybrid DNS resolution.'],
    ['Identity', 'Microsoft Entra ID + 2 managed identities', 'App identity + gateway identity', 'Identity / security team', 'Employees sign in to the app. The app identity calls the gateway; only the gateway identity receives model inference access in this sample. Configure the API audience, app roles, and assignments.'],
    ['Operations', 'Application Insights + Log Analytics + alerts', 'appi-ai / law-ai', 'Operations / platform team', 'Collect request correlation, errors, latency, policy outcomes, and token metrics. Define ingestion, retention, access, and alert ownership; prompt and completion bodies are not enabled by default in this design.']
  ];
  return `
    <article aria-labelledby="scene-title" class="overview deployment-guide">
      <div class="scene-heading"><span class="eyebrow">A concrete implementation example</span><span class="scene-count">ARCHITECTURE / 11</span></div>
      <h1 id="scene-title">Azure reference architecture</h1>
      <p class="intro">A private employee assistant with a governed model endpoint: the customer deploys an application, a shared API Management gateway, an Azure OpenAI deployment, private connectivity, identity controls, and monitoring.</p>
      <aside class="consideration"><span aria-hidden="true">i</span><p><strong>Reference design, not a live deployment.</strong> This sample combines documented Azure networking and authentication patterns. It assumes one region, one approved model, an existing corporate network connection, and no document retrieval. Resource names are examples. Validate the design, regional support, capacity, and commercial terms before implementation.</p></aside>
      <section class="overview-section"><h2>The application-to-model path</h2><p>An employee asks the assistant to summarize synthetic meeting notes. The browser never receives a model key and never calls the model directly.</p>
        <figure class="deployment-topology" aria-label="Private employee assistant deployment and request path">
          <div class="topology-band"><strong>Microsoft Entra ID</strong><span>Employee sign-in · application-to-gateway authorization · gateway-to-model managed identity</span></div>
          <div class="topology-client"><strong>01 · Employee browser</strong><span>Corporate network → existing VPN / ExpressRoute → private application endpoint</span></div>
          <div class="topology-boundary"><h3>Azure workload · one subscription / one region</h3><div class="topology-path">
            <section><span class="topology-step">02 · APPLICATION</span><h3>Azure App Service</h3><p>Employee UI + backend<br>Inbound app private endpoint<br>Outbound VNet integration</p><code>app-ai-assistant</code></section>
            <span class="topology-connector">HTTPS →<small>APIM private endpoint</small></span>
            <section class="topology-gateway"><span class="topology-step">03 · AI GATEWAY</span><h3>API Management</h3><p>Standard v2 · managed identity<br>Caller validation + token limits<br>Outbound VNet integration</p><code>apim-ai-gateway</code></section>
            <span class="topology-connector">HTTPS →<small>Model private endpoint</small></span>
            <section><span class="topology-step">04 · INFERENCE</span><h3>Azure OpenAI</h3><p>Approved model deployment<br>Model-side content filters<br>Public network access disabled</p><code>aoai-assistant</code></section>
          </div><div class="topology-network"><strong>VNet: vnet-ai</strong><span>snet-app: application egress</span><span>snet-apim: dedicated gateway egress</span><span>snet-pe: app, APIM, and model private endpoints</span></div></div>
          <div class="topology-band topology-telemetry"><strong>05 · Operations</strong><span>App + gateway telemetry → Application Insights / Log Analytics → Azure Monitor alerts</span></div>
          <figcaption class="overview-source">Arrows show the HTTPS request direction; responses return along the same path. App Service, APIM, and Azure OpenAI are managed services, not VMs placed in these subnets. Integration subnets provide outbound access; private endpoints provide inbound private IPs. Telemetry connectivity and service dependencies require separate configuration.</figcaption>
        </figure>
      </section>
      <section class="overview-section"><h2>Follow one request</h2><ol class="guide-steps"><li><strong>Employee → application.</strong> Corporate DNS resolves the app hostname to its private endpoint. The employee signs in with Entra ID; the app enforces the employee's business permissions.</li><li><strong>Application → gateway.</strong> The backend obtains an Entra access token for the gateway API using its managed identity. App Service VNet integration reaches the APIM private endpoint. APIM validates tenant, audience, allowed caller, and required application role.</li><li><strong>Gateway policy execution.</strong> APIM assigns a trusted application identifier for token counters and telemetry, enforces configured limits, and selects the imported model backend. Do not trust an arbitrary client-supplied application header for attribution.</li><li><strong>Gateway → model.</strong> APIM obtains a separate managed-identity token for Azure OpenAI. Its dedicated outbound integration subnet reaches the model private endpoint. Assign Cognitive Services OpenAI User to the gateway identity at the model resource scope.</li><li><strong>Response + operational evidence.</strong> The model returns the answer through APIM and the application. Correlate requests and record latency, errors, and token usage without recording prompt bodies unless specifically approved.</li></ol><p><strong>Two authorization boundaries:</strong> user access to the application is not the same as application access to APIM, and neither automatically grants direct access to the model. This design attributes model traffic by application; per-user gateway authorization requires an explicitly designed delegated-token flow.</p></section>
      <section class="overview-section"><h2>What the customer actually deploys</h2><div class="cost-table-wrapper"><table class="cost-table"><caption>Sample resource inventory and ownership</caption><thead><tr><th scope="col">Layer</th><th scope="col">Azure resources / sample names</th><th scope="col">Implementation responsibility</th></tr></thead><tbody>${resources.map(([layer, service, name, owner, description]) => `<tr><th scope="row">${layer}</th><td><strong>${service}</strong><br><code>${name}</code></td><td><strong>${owner}</strong><br>${description}</td></tr>`).join('')}</tbody></table></div><p>An existing shared APIM instance, network hub, DNS resolver, or monitoring workspace can be reused after capacity and isolation review. Create separate non-production resources and identities; do not test failure scenarios against production.</p></section>
      <section class="overview-section"><h2>Private networking: the important distinction</h2><div class="details-grid"><section><h3>Inbound: private endpoints</h3><p>Create private endpoints for the application, APIM gateway, and Azure OpenAI in the non-delegated endpoint subnet. Approve connections, configure private DNS, and test name resolution before disabling public access on each service.</p><p>Use the default service hostnames with private DNS resolution. For this Azure OpenAI endpoint, relevant zones include <code>privatelink.azurewebsites.net</code>, <code>privatelink.azure-api.net</code>, and <code>privatelink.openai.azure.com</code>. Verify zones against the selected resource type and endpoint.</p></section><section><h3>Outbound: dedicated integration subnets</h3><p>App Service uses its own delegated integration subnet. APIM Standard v2 uses a different, dedicated subnet delegated to <code>Microsoft.Web/serverFarms</code>; Microsoft documents /27 minimum and /24 recommended for growth.</p><p>Link private DNS zones to the workload VNet and configure corporate DNS forwarding through an existing resolver or Azure DNS Private Resolver. Allow required platform, identity, DNS, and telemetry dependencies; private model routing does not mean every service dependency is private.</p></section></div>
        <figure class="official-topology"><img src="https://learn.microsoft.com/en-us/azure/api-management/media/private-endpoint/private-endpoint.png" width="1200" loading="lazy" alt="Microsoft documentation diagram showing Standard v2 API Management with an inbound private endpoint and outbound virtual network integration to private backends."><figcaption class="overview-source">Microsoft's documented Standard v2 network topology. This illustrates the gateway networking pattern, not the complete employee-assistant deployment. <a href="https://learn.microsoft.com/azure/api-management/private-endpoint" target="_blank" rel="noopener noreferrer">Source: API Management private endpoints ↗</a></figcaption></figure>
        <aside class="consideration"><span aria-hidden="true">i</span><p><strong>A private endpoint is not authorization.</strong> Keep model access least-privileged, disable local-key authentication where supported after validating identity access, and restrict network paths. Disable public gateway access only after its private endpoint works. The APIM private endpoint covers the gateway, not every management or developer-portal endpoint.</p></aside>
      </section>
      <section class="overview-section"><h2>Start with the foundation; add only what you need</h2><div class="details-grid"><section><h3>Included in this sample</h3><ul class="guide-checklist"><li>Employee sign-in and application authorization.</li><li>Private application, gateway, and model request path.</li><li>Managed identities, caller validation, token limits, and operational telemetry.</li><li>One approved model deployment with model-side content filters.</li></ul></section><section><h3>Separate design extensions</h3><ul class="guide-checklist"><li>RAG: Azure AI Search, storage, ingestion, and document-level authorization.</li><li>Gateway safety screening / custom PII masking: Content Safety or Language integrations with their own networking and latency budgets.</li><li>Semantic caching: Redis, embeddings, isolation, expiry, and privacy controls.</li><li>Backend fallback: additional model capacity and compatibility testing. Multi-region gateway resilience is a separate architecture.</li></ul></section></div><p>Not every animated capability is enabled by deploying APIM. Each requires explicit policy configuration, dependencies, and acceptance tests. This single-region Standard v2 example does not claim zone redundancy or regional disaster recovery; choose a different tier or topology when availability objectives require it.</p></section>
      <section class="overview-section"><h2>Implementation sequence and acceptance evidence</h2><ol class="guide-steps"><li><strong>Agree the workload.</strong> Confirm region and data geography, model version, request volumes, peak concurrency, streaming, latency targets, and recovery objectives. Price the complete inventory using the <a href="#customer-questions">cost guidance in tab 10</a>.</li><li><strong>Build the network foundation.</strong> Allocate subnets, configure NSGs and DNS, establish corporate connectivity, and verify private endpoint resolution from the app and corporate network.</li><li><strong>Provision application, gateway, and model.</strong> Use reviewed infrastructure as code, managed identities, role assignments, and separate production / non-production parameters. Import the model API and configure its backend authentication.</li><li><strong>Apply and test policies.</strong> Prove allowed calls succeed, missing or incorrect tokens fail, limits behave as intended, and unauthorized direct model calls are denied. Validate retries and streaming with the actual client.</li><li><strong>Enable operations and release gates.</strong> Verify traces and token metrics, privacy-safe diagnostics, alert delivery, load-test results, budgets, deployment approvals, and rollback. Assign an owner to every operational signal.</li></ol><p><strong>Deliverables:</strong> reviewed resource diagram and inventory, infrastructure definitions, APIM API and policy configuration, role-assignment matrix, DNS / network rules, a tested application configuration, dashboards, and an operations runbook. This page describes those deliverables; it does not provision them.</p></section>
      <section class="overview-section"><h2>Documented patterns and executable samples</h2><p>The architecture above is a composed reference example, not a claim that one Microsoft template deploys this exact resource set. Use the official networking and identity guidance for the design, and the Azure AI Gateway labs for executable policy examples. Lab defaults may differ from this private deployment.</p><div class="references"><a href="https://learn.microsoft.com/azure/api-management/integrate-vnet-outbound" target="_blank" rel="noopener noreferrer">APIM outbound VNet integration ↗</a><a href="https://learn.microsoft.com/azure/api-management/private-endpoint" target="_blank" rel="noopener noreferrer">APIM private endpoints ↗</a><a href="https://learn.microsoft.com/azure/api-management/api-management-authenticate-authorize-ai-apis" target="_blank" rel="noopener noreferrer">Model authentication & authorization ↗</a><a href="https://learn.microsoft.com/azure/app-service/overview-private-endpoint" target="_blank" rel="noopener noreferrer">App Service private endpoints ↗</a><a href="https://github.com/Azure-Samples/AI-Gateway" target="_blank" rel="noopener noreferrer">Azure AI Gateway labs & Bicep samples ↗</a></div><p class="overview-source">Reference guidance checked October 29, 2026. Validate current regional availability, feature support, limits, and pricing during design review. No customer deployment or compliance certification is implied.</p></section>
      <nav class="scene-pagination" aria-label="Adjacent scenes"><a class="page-link" href="#customer-questions"><span aria-hidden="true">←</span><span><small>CUSTOMER GUIDE / 10</small>Customer questions</span></a><span></span></nav>
    </article>`;
}

function initializeCostWorksheet() {
  const form = document.querySelector('#cost-form');
  const result = document.querySelector('#cost-result');
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', () => {
    const fields = [...form.querySelectorAll('input')];
    if (fields.some(field => field.value === '' || !field.validity.valid || !Number.isFinite(field.valueAsNumber))) {
      result.textContent = 'Enter valid, non-negative values in every field.';
      return;
    }
    const values = Object.fromEntries(fields.map(field => [field.name, field.valueAsNumber]));
    const model = values.calls * (values.inputTokens * values.inputRate + values.outputTokens * values.outputRate) / 1000000;
    const total = model + values.gateway + values.supporting;
    if (!Number.isFinite(total)) {
      result.textContent = 'These assumptions exceed the calculation range.';
      return;
    }
    const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    result.textContent = `${usd.format(total)} / month · Model: ${usd.format(model)} · APIM: ${usd.format(values.gateway)} · Other: ${usd.format(values.supporting)}`;
  });
}

function render() {
  const id = location.hash.slice(1);
  let index = id === 'azure-architecture' ? scenes.length + 1 : id === 'customer-questions' ? scenes.length : scenes.findIndex(scene => scene.id === id);
  if (index === -1) {
    history.replaceState(null, '', '#high-level-understanding');
  }
  if (index === currentIndex) return;
  const initial = currentIndex === null;
  currentIndex = index;
  [...nav.children].forEach((link, navIndex) => {
    if (navIndex === index + 1) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
    link.querySelector('.nav-active').textContent = navIndex === index + 1 ? '›' : '';
  });
  if (index === -1) {
    document.title = 'High-level understanding | Azure AI Gateway';
    document.querySelector('#breadcrumb-scene').textContent = 'Overview';
    main.innerHTML = renderOverview();
    finishNavigation(initial);
    return;
  }
  if (index === scenes.length + 1) {
    document.title = 'Azure architecture | Azure AI Gateway';
    document.querySelector('#breadcrumb-scene').textContent = 'Reference architecture';
    main.innerHTML = renderAzureArchitecture();
    finishNavigation(initial);
    return;
  }
  if (index === scenes.length) {
    document.title = 'Customer questions | Azure AI Gateway';
    document.querySelector('#breadcrumb-scene').textContent = 'Customer guide';
    main.innerHTML = renderCustomerQuestions();
    initializeCostWorksheet();
    finishNavigation(initial);
    return;
  }
  const scene = scenes[index];
  document.title = `${scene.nav} | Azure AI Gateway`;
  document.querySelector('#breadcrumb-scene').textContent = `Scene ${number(index)}`;
  main.innerHTML = `
    <article aria-labelledby="scene-title">
      <div class="scene-heading"><span class="eyebrow">${scene.category}</span><span class="scene-count">SCENE ${number(index)} <span aria-hidden="true">/</span> 09</span></div>
      <h1 id="scene-title">${scene.title}</h1>
      <p class="intro">${scene.subtitle}</p>
      <figure style="margin:0">
        <div class="animation-region">
          <div class="animation-toolbar"><span class="animation-label"><span class="status-dot"></span>SCENE ${number(index)} / ANIMATED ARCHITECTURE</span><div class="tools"><button class="icon-button" id="toggle-animation" aria-label="Pause animation" title="Pause animation" aria-pressed="false">${icons.pause}</button><button class="icon-button" id="expand-animation" aria-label="Expand animation" title="Expand animation">${icons.expand}</button></div></div>
          <div class="animation-stage"><img id="scene-image" src="${asset(scene, index)}" alt="${scene.alt}" width="1280" height="720" decoding="async"><canvas id="scene-still" width="1280" height="720" role="img" aria-label="${scene.alt} Paused." hidden></canvas><div class="image-error" hidden><p>The animation could not be loaded.</p><a href="${asset(scene, index)}">Open scene GIF</a></div></div>
        </div>
        <figcaption class="figure-caption"><span>Isometric architecture scene</span><span>CAPABILITY ${number(index)} / SLIDE ${scene.slide}</span></figcaption>
      </figure>
      <div class="details-grid"><section><h2 class="section-label">What it does</h2><p>${scene.does}</p></section><section><h2 class="section-label">Why it matters</h2><p>${scene.matters}</p></section></div>
      <section class="implementation"><h2 class="section-label">Enabled by</h2><div class="chips">${scene.tech.map(item => `<span class="chip">${item}</span>`).join('')}</div></section>
      <aside class="consideration"><span aria-hidden="true">i</span><p><strong>Design consideration.</strong> ${scene.note}</p></aside>
      <section class="flow-section"><h2 class="section-label">Scenario at a glance</h2><div class="flow">${scene.flow.map((step, stepIndex) => `${stepIndex ? '<span class="flow-arrow" aria-hidden="true">→</span>' : ''}<span class="flow-step ${stepIndex === 1 ? 'highlight' : ''}">${step}</span>`).join('')}</div></section>
      <details class="context-section"><summary>The bigger picture: one ordered policy pipeline</summary><div class="context-body"><p>The reference pipeline in slide 14 connects these capabilities into a single request and response path.</p><h3 class="section-label">Inbound</h3><div class="pipeline">Validate token → Content safety → PII masking (custom) → Token limit → Cache lookup → Route backend → Foundry model</div><h3 class="section-label">Outbound</h3><div class="pipeline">Cache store → Emit token metrics → Log & trace → Return to channel</div><p>This is the presentation's conceptual reference flow. Cache hits and blocked requests can short-circuit the model path; actual policy placement and execution must be validated for the API.</p></div></details>
      <details class="context-section"><summary>Shared responsibility & adoption</summary><div class="context-body"><div class="context-columns"><section><h3>One layer in defense-in-depth</h3><p>The gateway centralizes policy enforcement, identity checks, configured screening, traffic controls, and audit evidence. It does not by itself guarantee CNBV or Banxico compliance, prevent every data leak, or replace identity management, DLP, model filters, and application security.</p></section><section><h3>A phased path to production</h3><ul><li>Weeks 0–6: gateway foundation, identity, token limits, metrics, and logging.</li><li>Weeks 6–12: content safety, backend resilience, and FAQ caching.</li><li>Week 12+: PII masking, chargeback, agents and MCP tools, and an operating model.</li></ul></section></div><p>Timings are indicative. Start with an architecture workshop, select 1–2 pilot use cases, agree quotas and KPIs, validate in non-production, then review results before rollout. Compliance depends on end-to-end controls and assessments.</p></div></details>
      <details class="context-section"><summary>Source & further reading</summary><div class="context-body"><p>Adapted from <em>Azure AI Gateway (animated)</em>, Sebastian Adan, Sr. Cloud Solution Architect, Microsoft Mexico, October 2026. This scene corresponds to slide ${scene.slide}; shared context comes from slides 2–4 and 14–17. The scenarios and figures are illustrative, not evidence of a deployed customer implementation.</p><div class="references"><a href="Azure%20AI%20Gateway%20(animated).pptx" download>Download the presentation ↗</a><a href="https://learn.microsoft.com/azure/api-management/genai-gateway-capabilities" target="_blank" rel="noopener noreferrer">AI Gateway documentation ↗</a><a href="https://learn.microsoft.com/azure/api-management/api-management-policies" target="_blank" rel="noopener noreferrer">APIM policy reference ↗</a></div></div></details>
      <nav class="scene-pagination" aria-label="Adjacent scenes">${pageLink(index - 1, false)}${pageLink(index + 1, true)}</nav>
    </article>`;
  const image = document.querySelector('#scene-image');
  const still = document.querySelector('#scene-still');
  const toggle = document.querySelector('#toggle-animation');
  let paused = false;
  const pause = () => {
    if (!image.complete || !image.naturalWidth) return;
    paused = !paused;
    if (paused) still.getContext('2d').drawImage(image, 0, 0, 1280, 720);
    image.hidden = paused;
    still.hidden = !paused;
    toggle.innerHTML = paused ? icons.play : icons.pause;
    toggle.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} animation`);
    toggle.title = `${paused ? 'Play' : 'Pause'} animation`;
    toggle.setAttribute('aria-pressed', String(paused));
  };
  image.addEventListener('load', () => { if (reducedMotion.matches && !paused) pause(); });
  if (image.complete && reducedMotion.matches) pause();
  image.addEventListener('error', () => {
    image.hidden = true;
    document.querySelector('.image-error').hidden = false;
    toggle.disabled = true;
    document.querySelector('#expand-animation').disabled = true;
  });
  toggle.addEventListener('click', pause);
  document.querySelector('#expand-animation').addEventListener('click', () => {
    const expanded = document.querySelector('#expanded-animation');
    expanded.replaceChildren();
    document.querySelector('#dialog-title').textContent = scene.title;
    if (paused) {
      const copy = still.cloneNode();
      copy.removeAttribute('id');
      copy.getContext('2d').drawImage(still, 0, 0);
      expanded.append(copy);
    } else {
      expanded.append(image.cloneNode());
      expanded.firstChild.removeAttribute('id');
    }
    dialog.showModal();
  });
  finishNavigation(initial);
}

menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  main.focus();
  main.scrollIntoView();
});
backdrop.addEventListener('click', () => { setMenu(false); menu.focus(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && dialog.open) {
    event.preventDefault();
    dialog.close();
    return;
  }
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); }
});
matchMedia('(max-width: 760px)').addEventListener('change', () => {
  setMenu(false);
  sidebar.inert = matchMedia('(max-width: 760px)').matches;
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => document.querySelector('#expanded-animation').replaceChildren());
window.addEventListener('hashchange', render);
render();