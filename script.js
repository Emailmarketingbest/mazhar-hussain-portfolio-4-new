// Mazher Hussain — Executive QA & Data Migration Portfolio Interactive Engine
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. "SIGNAL TO SIGN-OFF" ONE-TIME HERO REVEAL (1.6s, respects reduced motion)
  // ---------------------------------------------------------------------------
  let revealTimers = [];

  function clearRevealTimers() {
    revealTimers.forEach(t => clearTimeout(t));
    revealTimers = [];
  }

  window.triggerSignalReveal = function (forceReplay) {
    clearRevealTimers();
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s1 = document.getElementById('sigStep1');
    const s2 = document.getElementById('sigStep2');
    const s3 = document.getElementById('sigStep3');
    const c1 = document.getElementById('sigConn1');
    const c2 = document.getElementById('sigConn2');
    const portrait = document.getElementById('heroPortraitStage');

    if (!s1 || !s2 || !s3 || !c1 || !c2) return;

    if (prefersReduced && !forceReplay) {
      [s1, s2, s3].forEach(el => {
        el.classList.remove('is-lit');
        el.classList.add('is-settled');
      });
      [c1, c2].forEach(el => el.classList.add('is-lit'));
      return;
    }

    // Reset state for sequence
    [s1, s2, s3].forEach(el => {
      el.classList.remove('is-lit', 'is-settled');
    });
    [c1, c2].forEach(el => el.classList.remove('is-lit'));

    if (portrait) {
      portrait.classList.remove('sweep-active');
      void portrait.offsetWidth; // trigger reflow for one-time sweep
      portrait.classList.add('sweep-active');
    }

    // Step 1: Validate (120ms)
    revealTimers.push(setTimeout(() => {
      s1.classList.add('is-lit');
    }, 120));

    // Connector 1 + Step 2: Reconcile (580ms)
    revealTimers.push(setTimeout(() => {
      c1.classList.add('is-lit');
      s2.classList.add('is-lit');
    }, 580));

    // Connector 2 + Step 3: Release (1080ms)
    revealTimers.push(setTimeout(() => {
      c2.classList.add('is-lit');
      s3.classList.add('is-lit');
    }, 1080));

    // Settle all three checkpoints cleanly (1650ms)
    revealTimers.push(setTimeout(() => {
      [s1, s2, s3].forEach(el => {
        el.classList.remove('is-lit');
        el.classList.add('is-settled');
      });
    }, 1650));
  };

  // ---------------------------------------------------------------------------
  // 2. DARK PORTFOLIO TILES vs OFFICIAL REFERENCE LOGOS TOGGLE
  // ---------------------------------------------------------------------------
  let showingRefLogos = true;
  window.toggleOrganisationLogoMode = function () {
    showingRefLogos = !showingRefLogos;
    const tiles = document.getElementById('orgTilesGrid');
    const refs = document.getElementById('orgLogosRefGrid');
    const btn = document.getElementById('toggleLogoStyleBtn');
    if (!tiles || !refs || !btn) return;
    if (showingRefLogos) {
      tiles.classList.add('hidden');
      tiles.classList.remove('grid');
      refs.classList.remove('hidden');
      refs.classList.add('grid');
      btn.textContent = 'Showing: Official Organisation Logos (Switch to Minimal Text Tiles)';
    } else {
      refs.classList.add('hidden');
      refs.classList.remove('grid');
      tiles.classList.remove('hidden');
      tiles.classList.add('grid');
      btn.textContent = 'Showing: Minimal Text Tiles (Switch to Official Organisation Logos)';
    }
  };

  // ---------------------------------------------------------------------------
  // 3. FEATURED PROJECTS: "INSPECT MY WORK" PANELS & SHAREABLE DEEP LINKS
  // ---------------------------------------------------------------------------
  window.toggleInspectPanel = function (panelId, triggerBtn) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    const isHidden = panel.classList.contains('hidden');
    // Close all inspect panels first for clean reading
    ['inspect-paynow', 'inspect-iponz', 'inspect-onenz'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    if (isHidden) {
      panel.classList.remove('hidden');
      if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'true');
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (triggerBtn) {
      triggerBtn.setAttribute('aria-expanded', 'false');
    }
  };

  window.copyProjectLink = function (anchorId, btnEl) {
    const baseUrl = window.location.href.split('#')[0];
    const shareUrl = baseUrl + '#' + anchorId;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    if (btnEl) {
      const orig = btnEl.textContent;
      btnEl.textContent = 'Link Copied ✓';
      setTimeout(() => { btnEl.textContent = orig; }, 1800);
    }
  };

  // ---------------------------------------------------------------------------
  // 4. COMPLETE CASE STUDIES ARCHIVE & FILTER BAR (Defect #5 Fixed)
  // ---------------------------------------------------------------------------
  const CASES = {
    paynow: {
      id: 'paynow',
      category: 'payments',
      org: 'MBIE (Immigration New Zealand) · Test Lead',
      title: 'NZeTA PayNow Payment Integration (Builds 1–3)',
      summary: 'Led a five-person QA team across Web, iOS, and Android builds, validating Provider/Proxy/CRT routing, duplicate-payment prevention, and GST tax invoice reconciliation.',
      flow: '[Traveller Web / Mobile App] → [Provider / Proxy / CRT Rules] → [Windcave / PayNow Gateway] → [Webhook Settlement & GST Tax Invoice]',
      bullets: [
        'Led and coordinated a 5-person QA team across Builds 1, 2, and 3, giving programme leadership daily clarity on AC coverage, defect burndown, and release readiness.',
        'Validated complex payment routing rules (Provider, Proxy, CRT), multi-applicant fee calculations, and asynchronous webhook callback handling.',
        'Designed negative and boundary scenarios preventing duplicate payments during mobile network drops and verified automated GST tax invoice generation.'
      ],
      outcome: 'Zero critical post-release payment defects; full transparency across vendor drops and stakeholder sign-off.'
    },
    iponz: {
      id: 'iponz',
      category: 'migration',
      org: 'MBIE (IPONZ) · Data Migration Test Lead',
      title: 'IPONZ SaaS Migration & SQL Reconciliation',
      summary: 'Engineered source-to-target SQL reconciliation queries and validated transformation rules across Catalyst, OpenAPI, DocMan, and MuleSoft integrations.',
      flow: '[Legacy IP Databases] → [MuleSoft / OpenAPI ETL Rules] → [SQL Reconciliation Queries] → [Target Cloud SaaS Registry]',
      bullets: [
        'Authored SQL reconciliation suites comparing legacy source tables against target SaaS entities across record counts, field-level transformations, and lifecycle statuses.',
        'Isolated and resolved timezone date-offset and status-mapping discrepancies across trial migration loads prior to production dress rehearsal.',
        'Validated end-to-end API payloads across Catalyst, OpenAPI, DocMan document management, and MuleSoft integration layers.'
      ],
      outcome: '100% reconciled critical IP record integrity across trial loads and production cutover readiness.'
    },
    onenz: {
      id: 'onenz',
      category: 'government',
      org: 'One NZ · Technical Test Lead (NZDF, NZ Police & MSD Programme Streams)',
      title: 'One NZ Enterprise Mobility & Multi-Agency Cutover',
      summary: 'Managed E2E test and cutover risk across NZDF, MSD, and NZ Police mobility streams (programme work via One NZ) and supported live service handover.',
      flow: '[Zero-Touch Enrolment] → [MDM Security & Certificate Policies] → [Multi-Agency UAT & Cutover Gate] → [BAU Live Service Handover]',
      bullets: [
        'Directed technical testing and UAT across enterprise mobility and telecommunications streams delivered for NZDF, New Zealand Police, and MSD via One NZ.',
        'Enforced strict dress-rehearsal cutover gates, halting a scheduled release when supervised certificate renewal risks surfaced and verifying the engineering fix across physical device fleets.',
        'Managed hypercare readiness and structured handover into live BAU operations.'
      ],
      outcome: 'Protected frontline agency continuity across 15,000+ managed mobile endpoints with zero unplanned cutover outages.'
    },
    threeds: {
      id: 'threeds',
      category: 'payments',
      org: 'MBIE (Immigration New Zealand) · Test Lead',
      title: 'NZeTA Web — 3D Secure (3DS 2.0) Payment Security Enhancement',
      summary: 'Led end-to-end EMV 3DS 2.0 authentication testing across frictionless and challenge flows, step-up callbacks, and cross-browser device matrices.',
      flow: '[Cardholder Checkout] → [Datacom / Windcave 3DS 2.0 Server] → [ACS Frictionless / Challenge Step-Up] → [Authorised Settlement]',
      bullets: [
        'Tested frictionless and challenge 3DS 2.0 authentication flows across major card schemes (Visa, Mastercard, Amex) and international issuing banks.',
        'Verified fallback handling, timeout recovery, and session state integrity across desktop and mobile browsers.'
      ],
      outcome: 'Seamless 3DS 2.0 compliance and fraud-reduction posture without degrading legitimate traveller checkout conversion.'
    },
    epbr: {
      id: 'epbr',
      category: 'government',
      org: 'MBIE · Test Lead',
      title: 'MBIE EPBR Accessibility (NVDA & WCAG 2.1 AA) & Release Assurance',
      summary: 'Executed screen-reader accessibility audits (NVDA), keyboard-only navigation verification, and functional release testing.',
      flow: '[EPBR Web Portal] → [WCAG 2.1 AA & NVDA Screen Reader Audit] → [Keyboard Focus & ARIA Remediation] → [Compliant Government Release]',
      bullets: [
        'Conducted structured accessibility testing using NVDA screen reader, verifying semantic headings, ARIA live regions, focus order, and contrast compliance.',
        'Partnered with front-end developers to remediate modal focus traps and keyboard navigation defects prior to government sign-off.'
      ],
      outcome: 'Met NZ Government Web Accessibility Standards (WCAG 2.1 AA) with verified assistive-technology usability.'
    },
    doc_coop: {
      id: 'doc_coop',
      category: 'migration',
      org: 'Department of Conservation (DOC) & The Co-operative Bank · Test Lead / Senior QA',
      title: 'DOC Great Walks National Booking Platform & Core Banking Assurance',
      summary: 'High-concurrency peak booking validation for DOC Great Walks and core banking / digital channel release assurance at The Co-operative Bank.',
      flow: '[Peak Seasonal Traffic / Banking Channels] → [Booking & Payment Ledger Validation] → [Regression & UAT Governance] → [Production Release]',
      bullets: [
        'Validated DOC Great Walks national booking and payment workflows under peak seasonal opening loads.',
        'Delivered core banking, loan origination, and digital channel regression assurance at The Co-operative Bank and student system migrations at Victoria University of Wellington.'
      ],
      outcome: 'Stable national booking openings and zero-defect banking channel releases.'
    }
  };

  let activeWorkFilter = 'all';

  function renderWorkGrid() {
    const container = document.getElementById('workListContainer');
    if (!container) return;
    const items = Object.values(CASES).filter(c => activeWorkFilter === 'all' || c.category === activeWorkFilter);
    container.innerHTML = items.map(c => `
      <div class="p-4 rounded-xl bg-slate-900/75 border border-slate-800 hover:border-teal-500/40 flex flex-col justify-between gap-3 transition-all">
        <div class="space-y-1.5">
          <div class="font-mono-kicker text-[10px] text-teal-400 font-bold">${c.org}</div>
          <h4 class="font-display font-bold text-base text-white">${c.title}</h4>
          <p class="text-xs text-slate-300 leading-relaxed">${c.summary}</p>
        </div>
        <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <span class="font-mono-kicker text-[10px] text-slate-400">${c.category.toUpperCase()}</span>
          <button type="button" onclick="openCaseModal('${c.id}', this)" class="font-mono-kicker text-[11px] text-teal-300 hover:text-white font-bold">
            Read Case Study →
          </button>
        </div>
      </div>
    `).join('');
  }

  document.querySelectorAll('.work-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeWorkFilter = btn.getAttribute('data-filter') || 'all';
      document.querySelectorAll('.work-filter-btn').forEach(b => {
        const isCurrent = (b.getAttribute('data-filter') === activeWorkFilter);
        b.className = isCurrent
          ? 'work-filter-btn px-3 py-1.5 rounded-lg text-xs font-mono-kicker font-bold bg-teal-500 text-slate-950'
          : 'work-filter-btn px-3 py-1.5 rounded-lg text-xs font-mono-kicker bg-slate-900 text-slate-300 border border-slate-800 hover:border-teal-500/40';
      });
      renderWorkGrid();
    });
  });

  // ---------------------------------------------------------------------------
  // 5. CORE SKILL PILLARS (QUIET INTERACTIVE BAR)
  // ---------------------------------------------------------------------------
  const SKILL_PILLARS = {
    migration: '<strong>Data Migration &amp; SQL Reconciliation:</strong> Source-to-target schema validation, complex SQL join queries, ETL transformation rule verification, and trial-load discrepancy resolution across IPONZ SaaS and enterprise ERP/CRM migrations.',
    payments: '<strong>Payments, PayNow &amp; 3DS 2.0:</strong> End-to-end payment gateway assurance (Windcave, QuickPay, Datacom 3DS 2.0), Provider/Proxy/CRT routing rules, duplicate-payment idempotency checks, and GST tax invoice reconciliation.',
    leadership: '<strong>QA Leadership &amp; Release Governance:</strong> Leading five-person QA teams, establishing build entry/exit criteria, running daily defect triage, and presenting clear go/no-go release readiness evidence to executive stakeholders.',
    api: '<strong>API, MuleSoft &amp; Cloud Integration:</strong> Contract and payload validation across OpenAPI, REST/SOAP, MuleSoft ESB, Catalyst, and DocMan document services with Postman and automated integration checks.',
    mobile: '<strong>Enterprise Mobility &amp; MDM:</strong> Cross-platform iOS/Android assurance, zero-touch fleet enrolment, certificate-based VPN authentication, and multi-agency cutover governance across 15,000+ endpoints.',
    automation: '<strong>Automation, Accessibility (WCAG) &amp; AI QA:</strong> Risk-based regression automation, NVDA screen-reader &amp; WCAG 2.1 AA compliance audits, and human-in-the-loop review of AI/Copilot-generated test suites.'
  };

  window.selectSkillPillar = function (key, btnEl) {
    const readout = document.getElementById('skillPillarReadout');
    if (readout && SKILL_PILLARS[key]) {
      readout.innerHTML = SKILL_PILLARS[key];
    }
    document.querySelectorAll('.skill-pillar-btn').forEach(b => {
      b.className = 'skill-pillar-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:border-teal-500/40';
    });
    if (btnEl) {
      btnEl.className = 'skill-pillar-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500/20 border border-teal-400/50 text-teal-200';
    }
  };

  // ---------------------------------------------------------------------------
  // 6. QA LAB INTERACTIVE SCENARIO & ARCHITECTURE NODES
  // ---------------------------------------------------------------------------
  const LAB_NODES = [
    {
      title: '01 · Web & Mobile Channels Inspection:',
      desc: 'Verified responsive UI, keyboard focus order, and iOS/Android parity across NZeTA Web and mobile app builds (28/28 checks passed).'
    },
    {
      title: '02 · Payment Gateway & 3DS 2.0 Inspection:',
      desc: 'Validated Provider, Proxy, and CRT routing rules across PayNow, Windcave, and Datacom 3DS 2.0. Isolated asynchronous callback collision when mobile network switches from Wi-Fi to 4G mid-transaction.'
    },
    {
      title: '03 · Data & Ledger Reconciliation Inspection:',
      desc: 'Executed SQL settlement queries reconciling gateway transaction IDs, NZ GST invoice amounts, and target SaaS application statuses (100% ledger parity).'
    },
    {
      title: '04 · UAT & Cutover Sign-Off Inspection:',
      desc: 'Enforced release gate criteria: blocked premature release when P1 payment race condition was active, then signed off release once idempotency lock passed regression.'
    }
  ];

  window.inspectLabNode = function (idx, btnEl) {
    const item = LAB_NODES[idx];
    if (!item) return;
    document.getElementById('nodeTitle').textContent = item.title;
    document.getElementById('nodeDesc').textContent = ' ' + item.desc;
  };

  window.runQaLabScenario = function (mode) {
    const left = document.getElementById('simMetricLeft');
    const right = document.getElementById('simMetricRight');
    const bar = document.getElementById('simProgressBar');
    const status = document.getElementById('simStatusLabel');
    const reasoning = document.getElementById('qaLabReasoningText');
    const n2 = document.getElementById('labNode2Status');
    const n4 = document.getElementById('labNode4Status');

    if (mode === 'nogo') {
      left.textContent = 'AC COVERAGE: 83 / 84 (98.8%)';
      right.textContent = 'RECOMMENDATION: NO-GO (HOLD RELEASE)';
      right.className = 'px-2.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 font-mono-kicker text-xs text-rose-300 font-bold';
      bar.className = 'h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-300';
      bar.style.width = '88%';
      status.innerHTML = '<strong>Active Defect (Sev-1 / P1):</strong> Under 4G packet loss, tapping “Pay Now” twice within 1.8s triggers a race condition between the Windcave webhook callback and the client polling loop—resulting in a confirmed bank debit while the application status remains <code class="text-rose-300">PENDING_PAYMENT</code>.';
      reasoning.innerHTML = 'Even though 98.8% of functional tests pass, any defect that takes a customer's payment without issuing their visa/application receipt—or risks a double charge—is an immediate <strong>Release Blocker (No-Go)</strong>. I recommend holding cutover for 24 hours while engineering enforces an idempotency key on the payment session ID and implements a webhook-first state lock.';
      if (n2) { n2.textContent = '1 P1 Webhook Race Condition'; n2.className = 'text-[11px] text-rose-300'; }
      if (n4) { n4.textContent = 'Gate Held Pending P1 Fix'; n4.className = 'text-[11px] text-amber-300'; }
    } else {
      left.textContent = 'AC COVERAGE: 84 / 84 (100% VERIFIED)';
      right.textContent = 'RECOMMENDATION: GO (SIGNED OFF)';
      right.className = 'px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 font-mono-kicker text-xs text-emerald-300 font-bold';
      bar.className = 'h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300';
      bar.style.width = '100%';
      status.innerHTML = '<strong>Fix Verified in Build 03:</strong> Session idempotency token and webhook state lock verified across 40+ simulated network-drop retry transactions on iOS, Android, and Web. Zero duplicate charges; 100% SQL settlement &amp; GST invoice match.';
      reasoning.innerHTML = 'With the P1 payment race condition resolved, regression checks green across all 5 testers, and SQL reconciliation confirming 100% ledger parity, the release meets all exit criteria for <strong>Formal Go Sign-Off</strong>.';
      if (n2) { n2.textContent = 'Idempotency Lock Verified ✓'; n2.className = 'text-[11px] text-emerald-400'; }
      if (n4) { n4.textContent = 'Signed Off for Production ✓'; n4.className = 'text-[11px] text-emerald-400'; }
    }
  };

  // ---------------------------------------------------------------------------
  // 7. 9-COUNTRY PROFESSIONAL STORY + SEPARATE AUSTRALIA & INDIA VISUALS
  // ---------------------------------------------------------------------------
  const COUNTRY_DATA = {
    'SAUDI ARABIA': {
      title: '01 · Saudi Arabia (Career Start — Enterprise Systems & IT Consulting)',
      badge: '01 · CAREER ORIGIN',
      text: 'Where my international IT & QA career began (2012–2016) at Al-elM / Jarir Investment and GulfNet Solutions—building foundational expertise in enterprise systems analysis, ERP/CRM validation, and structured software testing.'
    },
    'USA': {
      title: '02 · United States (International Work & Project Travel)',
      badge: '02 · PROJECT TRAVEL',
      text: 'Collaborated across US technology vendor ecosystems, cloud platforms, and global enterprise stakeholders during international project delivery.'
    },
    'UAE': {
      title: '03 · United Arab Emirates (Middle East Hub & Project Travel)',
      badge: '03 · PROJECT TRAVEL',
      text: 'Delivered regional systems coordination, stakeholder workshops, and cross-border enterprise QA alignment across the Gulf corridor.'
    },
    'EGYPT': {
      title: '04 · Egypt (MENA Regional Work & Project Travel)',
      badge: '04 · PROJECT TRAVEL',
      text: 'Supported cross-regional engineering teams, localization validation, and enterprise integration testing across MENA operations.'
    },
    'QATAR': {
      title: '05 · Qatar (Gulf Enterprise Work & Project Travel)',
      badge: '05 · PROJECT TRAVEL',
      text: 'Executed on-site client coordination, UAT readiness, and enterprise application assurance for regional Gulf initiatives.'
    },
    'OMAN': {
      title: '06 · Oman (Regional Work & Project Travel)',
      badge: '06 · PROJECT TRAVEL',
      text: 'Conducted regional rollout validation, stakeholder training, and operational handover assurance across Oman engagements.'
    },
    'SINGAPORE': {
      title: '07 · Singapore (APAC Financial & Digital Gateway Travel)',
      badge: '07 · PROJECT TRAVEL',
      text: 'Aligned with APAC payment gateway standards (including PayNow ecosystems), regional cloud infrastructure, and cross-border digital assurance.'
    },
    'MALAYSIA': {
      title: '08 · Malaysia (APAC Delivery & Project Travel)',
      badge: '08 · PROJECT TRAVEL',
      text: 'Worked across Southeast Asian technology delivery centres and regional vendor streams supporting APAC transformation programmes.'
    },
    'NEW ZEALAND': {
      title: '09 · New Zealand (Wellington — Long-Term Home Base & Principal Delivery)',
      badge: '09 · HOME BASE & DELIVERY',
      text: 'Long-term professional base in Wellington delivering enterprise test leadership, data migration assurance, and release governance across MBIE (NZeTA PayNow, 3DS 2.0, IPONZ SaaS Migration, EPBR), One NZ (NZDF, NZ Police, MSD programme streams), DOC, The Co-operative Bank, and Victoria University of Wellington.'
    },
    'AUSTRALIA': {
      title: 'Australia (Brisbane Base / Subclass 444 Work Rights — Separate from 9-Country Count)',
      badge: 'WORK RIGHTS (NZ CITIZEN)',
      text: 'As a New Zealand citizen, I hold full Australian work rights (Subclass 444 Special Category eligibility on arrival) for Brisbane or trans-Tasman roles. Kept separate on the map so the nine-country count strictly reflects documented career delivery locations.'
    },
    'INDIA': {
      title: 'India (Personal & Family Travel — Separate from 9-Country Professional Count)',
      badge: 'PERSONAL TRAVEL',
      text: 'Included separately as personal and family heritage travel rather than a project delivery location, keeping the nine-country professional count accurate.'
    }
  };

  window.selectCountry = function (name) {
    const key = String(name || '').toUpperCase();
    const data = COUNTRY_DATA[key];
    if (!data) return;
    document.getElementById('countryDetailTitle').textContent = data.title;
    document.getElementById('countryDetailBadge').textContent = data.badge;
    document.getElementById('countryDetailText').textContent = data.text;

    document.querySelectorAll('.country-card-btn').forEach(btn => {
      const isMatch = (btn.getAttribute('data-country') === key);
      if (isMatch) {
        btn.classList.add('border-teal-400', 'bg-teal-500/15');
        btn.classList.remove('border-slate-800');
      } else {
        btn.classList.remove('border-teal-400', 'bg-teal-500/15');
        btn.classList.add('border-slate-800');
      }
    });
  };

  // ---------------------------------------------------------------------------
  // 8. 7-STAGE CAREER TIMELINE (MBIE strictly Test Lead / Data Migration Test Lead)
  // ---------------------------------------------------------------------------
  const ERAS = [
    {
      num: '01',
      period: 'APR 2012 – DEC 2014 · SAUDI ARABIA',
      title: 'IT Consulting / Systems Analysis',
      org: 'Al-elM / Jarir Investment · Saudi Arabia',
      desc: 'Built core foundations in enterprise systems analysis, requirements traceability, and structured business process validation across commercial operations.',
      pills: ['Systems Analysis', 'Requirements Traceability', 'ERP & Workflow QA']
    },
    {
      num: '02',
      period: 'MAY 2015 – MAR 2016 · SAUDI ARABIA',
      title: 'Test Lead',
      org: 'GulfNet Solutions · Saudi Arabia',
      desc: 'Stepped into formal Test Lead responsibility—coordinating test plans, defect triage, and UAT sign-off for enterprise client application rollouts.',
      pills: ['Test Leadership', 'UAT Coordination', 'Defect Governance']
    },
    {
      num: '03',
      period: 'JUN 2016 – JAN 2018 · WELLINGTON, NZ',
      title: 'Senior Applications Test Analyst',
      org: 'Victoria University of Wellington (VUW) · Direct Employment',
      desc: 'Delivered end-to-end application testing, student platform upgrades, and integration assurance across university-wide digital systems.',
      pills: ['Higher Education Systems', 'Integration Testing', 'Release Readiness']
    },
    {
      num: '04',
      period: 'JAN 2018 – JAN 2019 · WELLINGTON, NZ',
      title: 'Test Lead / QA Analyst',
      org: 'Department of Conservation (DOC) & Wilkinson & Son’s Chemist',
      desc: 'Led booking and payment assurance on the DOC Great Walks national platform and validated retail POS/ERP workflows for Wilkinson & Son’s Chemist.',
      pills: ['DOC Great Walks', 'Digital Payments', 'High-Concurrency Booking']
    },
    {
      num: '05',
      period: 'JAN 2019 – AUG 2019 · WELLINGTON, NZ',
      title: 'Banking + Telecom Testing',
      org: 'The Co-operative Bank · Direct Contract Engagement',
      desc: 'Executed core banking, regulatory compliance, and digital banking channel regression and release assurance.',
      pills: ['Core Banking QA', 'Financial Compliance', 'Digital Channels']
    },
    {
      num: '06',
      period: 'AUG 2019 – AUG 2025 · WELLINGTON, NZ',
      title: 'Technical Test Lead',
      org: 'One NZ · Direct Employment (Delivering NZDF, NZ Police & MSD Programme Streams)',
      desc: 'Six-year tenure leading enterprise mobility, MDM security, and multi-agency government cutover assurance across NZDF, New Zealand Police, and MSD programme work via One NZ.',
      pills: ['Technical Test Lead', 'Enterprise Mobility & MDM', 'Multi-Agency Cutover']
    },
    {
      num: '07',
      period: 'SEP 2025 – PRESENT · WELLINGTON, NZ',
      title: 'Test Lead / Data Migration Test Lead',
      org: 'Ministry of Business, Innovation and Employment (MBIE) · Direct Engagement',
      desc: 'Leading a five-person QA team across NZeTA PayNow (Builds 1–3) and 3DS 2.0 payment security, while driving SQL data migration reconciliation, transformation-rule verification, and WCAG 2.1 AA accessibility testing across IPONZ SaaS and EPBR programmes.',
      pills: ['5-Person QA Team Lead', 'SQL Data Reconciliation', 'NZeTA PayNow & 3DS 2.0', 'IPONZ SaaS Migration']
    }
  ];

  function renderTimelineScrubber(activeIdx) {
    const container = document.getElementById('eraScrubber');
    if (!container) return;
    container.innerHTML = ERAS.map((e, i) => {
      const isCurrent = (i === activeIdx);
      return `
        <button
          type="button"
          onclick="selectEra(${i})"
          class="era-btn text-left p-3 rounded-xl border transition-all ${
            isCurrent
              ? 'bg-teal-500/20 border-teal-400 text-white shadow-lg shadow-teal-500/10'
              : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-teal-500/40'
          }"
        >
          <div class="flex items-center justify-between">
            <span class="font-display font-black text-lg ${isCurrent ? 'text-teal-300' : 'text-slate-400'}">${e.num}</span>
            <span class="font-mono-kicker text-[9px] ${isCurrent ? 'text-teal-200' : 'text-slate-400'}">${e.period.split('·')[0].trim()}</span>
          </div>
          <div class="font-display font-bold text-xs text-white mt-1 line-clamp-2">${e.title}</div>
        </button>
      `;
    }).join('');
  }

  window.selectEra = function (idx) {
    const e = ERAS[idx];
    if (!e) return;
    renderTimelineScrubber(idx);
    document.getElementById('eraNumBadge').textContent = e.num;
    document.getElementById('eraPeriod').textContent = e.period;
    document.getElementById('eraTitle').textContent = e.title;
    document.getElementById('eraOrg').textContent = e.org;
    document.getElementById('eraDesc').textContent = e.desc;
    document.getElementById('eraFocusPills').innerHTML = e.pills.map(
      p => `<span class="px-2.5 py-1 rounded-md bg-teal-500/15 border border-teal-500/30">${p}</span>`
    ).join('');
  };

  // ---------------------------------------------------------------------------
  // 9. STRICT MODAL ACCESSIBILITY, FOCUS TRAP & ESCAPE HANDLING (Defects #2, #3, #4, #5)
  // ---------------------------------------------------------------------------
  let activeModalEl = null;
  let lastFocusedTrigger = null;

  function setBackgroundInert(isInert) {
    const main = document.getElementById('mainContent');
    const header = document.getElementById('siteHeader');
    [main, header].forEach(el => {
      if (!el) return;
      if (isInert) {
        el.setAttribute('aria-hidden', 'true');
        el.setAttribute('inert', '');
      } else {
        el.removeAttribute('aria-hidden');
        el.removeAttribute('inert');
      }
    });
  }

  function getFocusableElements(container) {
    if (!container) return [];
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => el.offsetParent !== null && !el.classList.contains('hidden'));
  }

  // Open / Close Case Study Modal (Preserves activeWorkFilter - Fixes Defect #5)
  window.openCaseModal = function (caseId, triggerEl) {
    const c = CASES[caseId];
    if (!c) return;
    if (triggerEl) lastFocusedTrigger = triggerEl;
    document.getElementById('modalOrg').textContent = c.org;
    document.getElementById('modalTitle').textContent = c.title;
    document.getElementById('modalFlow').textContent = c.flow;
    document.getElementById('modalBullets').innerHTML = c.bullets.map(b => `<li>${b}</li>`).join('');
    document.getElementById('modalOutcome').textContent = c.outcome;

    const modal = document.getElementById('caseModal');
    modal.classList.remove('hidden');
    activeModalEl = modal;
    setBackgroundInert(true);
    const closeBtn = document.getElementById('closeCaseModalBtn');
    if (closeBtn) closeBtn.focus();
  };

  window.closeCaseModal = function () {
    const modal = document.getElementById('caseModal');
    if (modal) modal.classList.add('hidden');
    activeModalEl = null;
    setBackgroundInert(false);
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  };

  // Open / Close CV Preview Modal (Fixes Defect #2 & #4)
  window.openCvModal = function (triggerEl) {
    if (triggerEl) lastFocusedTrigger = triggerEl;
    const modal = document.getElementById('cvPreviewModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    activeModalEl = modal;
    setBackgroundInert(true);
    const closeBtn = document.getElementById('closeCvModalBtn');
    if (closeBtn) closeBtn.focus();
  };

  window.closeCvModal = function () {
    const modal = document.getElementById('cvPreviewModal');
    if (modal) modal.classList.add('hidden');
    activeModalEl = null;
    setBackgroundInert(false);
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  };

  // Quick Search Command Palette (Includes ALL 11 Countries - Fixes Defect #3)
  const CMD_ITEMS = [
    { label: 'Featured Project: NZeTA PayNow Integration (MBIE)', category: 'Selected Work', keywords: 'nzeta paynow mbie payments windcave quickpay 5-person team lead builds', action: () => { closeCmdPalette(); openCaseModal('paynow'); } },
    { label: 'Featured Project: IPONZ SaaS Migration & SQL Reconciliation (MBIE)', category: 'Selected Work', keywords: 'iponz saas migration sql reconciliation mbie data migration test lead mulesoft openapi', action: () => { closeCmdPalette(); openCaseModal('iponz'); } },
    { label: 'Featured Project: One NZ Enterprise Mobility (NZDF, Police, MSD)', category: 'Selected Work', keywords: 'one nz enterprise mobility nzdf police msd cutover mdm uat', action: () => { closeCmdPalette(); openCaseModal('onenz'); } },
    { label: 'Case Study: NZeTA Web — 3D Secure (3DS 2.0) Enhancement', category: 'Case Study', keywords: '3ds 2.0 security datacom payment authentication mbie', action: () => { closeCmdPalette(); openCaseModal('threeds'); } },
    { label: 'Case Study: MBIE EPBR Accessibility (NVDA & WCAG 2.1 AA)', category: 'Case Study', keywords: 'epbr accessibility wcag nvda screen reader mbie', action: () => { closeCmdPalette(); openCaseModal('epbr'); } },
    { label: 'Case Study: DOC Great Walks & The Co-operative Bank', category: 'Case Study', keywords: 'doc department of conservation great walks co-operative bank vuw', action: () => { closeCmdPalette(); openCaseModal('doc_coop'); } },
    { label: 'QA Lab: Release Gate Scenario & AI-Assisted Test Design', category: 'QA Lab', keywords: 'qa lab simulator release gate no-go copilot ai test design', action: () => { closeCmdPalette(); document.getElementById('qa-lab').scrollIntoView({ behavior: 'smooth' }); } },
    // All 11 Countries searchable!
    { label: 'Country: 01 Saudi Arabia — Career Start (Al-elM / GulfNet)', category: 'Country', keywords: 'saudi arabia riyadh middle east career start country', action: () => { closeCmdPalette(); document.getElementById('global-footprint').scrollIntoView({ behavior: 'smooth' }); selectCountry('SAUDI ARABIA'); } },
    { label: 'Country: 02 USA (United States) — International Project Travel', category: 'Country', keywords: 'usa united states america international work travel country', action: () => { closeCmdPalette(); document.getElementById('global-footprint').scrollIntoView({ behavior: 'smooth' }); selectCountry('USA'); } },
    { label: 'Country: 03 UAE (United Arab Emirates) — International Project Travel', category: 'Country', keywords: 'uae united arab emirates dubai abu dhabi work travel country', action: () => { closeCmdPalette(); document.getElementById('global-footprint').scrollIntoView({ behavior: 'smooth' }); selectCountry('UAE'); } },
    { label: 'Country: 04 Egypt — MENA Work & Project Travel', category: 'Country', keywords: 'egypt cairo mena international work travel country', action: () => { closeCmdPalette(); document.getElementById('global-footprint').scrollIntoView({ behavior: 'smooth' }); selectCountry('EGYPT'); } },
    { label: 'Country: 05 Qatar — Gulf Work & Project Travel', category: 'Country', keywords: 'qatar doha gulf international work travel country', action: () => { closeCmdPalette(); document.getElementById('global-footprint').scrollIntoView({ behavior: 'smooth' }); selectCountry('QATAR'); } },
    { label: 'Country: 06 Oman — Regional Work & Project Travel', category: 'Country', keywords: 'oman muscat gulf international work travel country', action: () => { closeCmdPalette(); document.getElementById('global-footprint').scrollIntoView({ behavior: 'smooth' }); selectCountry('OMAN'); } },
    { label: 'Country: 07 Singapore — APAC Gateway & Project Travel', category: 'Country', keywords: 'singapore apac paynow international work travel country', action: () => { closeCmdPalette(); document.getElementById('global-footprint').scrollIntoView({ behavior: 'smooth' }); selectCountry('SINGAPORE'); } },
    { label: 'Country: 08 Malaysia — APAC Delivery & Project Travel', category: 'Country', keywords: 'malaysia kuala lumpur apac international work travel country', action: () => { closeCmdPalette(); document.getElementById('global-footprint').scrollIntoView({ behavior: 'smooth' }); selectCountry('MALAYSIA'); } },
    { label: 'Country: 09 New Zealand — Wellington Home Base & Delivery', category: 'Country', keywords: 'new zealand nz wellington home base mbie one nz country', action: () => { closeCmdPalette(); document.getElementById('global-footprint').scrollIntoView({ behavior: 'smooth' }); selectCountry('NEW ZEALAND'); } },
    { label: 'Country: Australia — Work Rights (NZ Citizen / Brisbane Base)', category: 'Country', keywords: 'australia brisbane work rights subclass 444 country', action: () => { closeCmdPalette(); document.getElementById('global-footprint').scrollIntoView({ behavior: 'smooth' }); selectCountry('AUSTRALIA'); } },
    { label: 'Country: India — Personal & Family Travel', category: 'Country', keywords: 'india personal travel country', action: () => { closeCmdPalette(); document.getElementById('global-footprint').scrollIntoView({ behavior: 'smooth' }); selectCountry('INDIA'); } },
    { label: 'Download CV: Executive Master CV & Summary', category: 'Action', keywords: 'cv resume download pdf executive', action: () => { closeCmdPalette(); openCvModal(); } }
  ];

  let filteredCmdItems = CMD_ITEMS.slice();

  function renderCmdResults(query) {
    const q = String(query || '').trim().toLowerCase();
    filteredCmdItems = CMD_ITEMS.filter(item => {
      if (!q) return true;
      return item.label.toLowerCase().includes(q) || item.keywords.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    });
    const list = document.getElementById('cmdResultsList');
    if (!list) return;
    if (filteredCmdItems.length === 0) {
      list.innerHTML = `<div class="p-4 text-xs text-slate-400 text-center">No matching results found. Try searching NZeTA, IPONZ, Singapore, Egypt, Malaysia, or USA.</div>`;
      return;
    }
    list.innerHTML = filteredCmdItems.map((item, idx) => `
      <button
        type="button"
        role="option"
        data-cmd-idx="${idx}"
        class="cmd-result-btn w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-teal-500/15 focus:bg-teal-500/20 flex items-center justify-between gap-2 transition-colors"
      >
        <span class="text-xs sm:text-sm text-slate-100 font-medium">${item.label}</span>
        <span class="font-mono-kicker text-[10px] text-teal-300 shrink-0">${item.category}</span>
      </button>
    `).join('');

    list.querySelectorAll('.cmd-result-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = Number(btn.getAttribute('data-cmd-idx'));
        if (filteredCmdItems[i]) filteredCmdItems[i].action();
      });
    });
  }

  window.openCmdPalette = function (triggerEl) {
    if (triggerEl) lastFocusedTrigger = triggerEl;
    const modal = document.getElementById('cmdPaletteModal');
    const input = document.getElementById('cmdSearchInput');
    if (!modal || !input) return;
    modal.classList.remove('hidden');
    activeModalEl = modal;
    setBackgroundInert(true);
    input.value = '';
    renderCmdResults('');
    input.focus();
  };

  window.closeCmdPalette = function () {
    const modal = document.getElementById('cmdPaletteModal');
    if (modal) modal.classList.add('hidden');
    activeModalEl = null;
    setBackgroundInert(false);
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  };

  // Global Keydown Handler (Capture phase = true so Escape ALWAYS closes active modal & Tab is strictly trapped!)
  window.addEventListener('keydown', function (e) {
    // Shortcut Ctrl+K / Cmd+K to open search
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (activeModalEl === document.getElementById('cmdPaletteModal')) {
        closeCmdPalette();
      } else {
        openCmdPalette(document.activeElement);
      }
      return;
    }

    if (!activeModalEl) return;

    // Escape key closes whichever modal is active (even if focus is on ESC ✕ button — Fixes Defect #4!)
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      if (activeModalEl.id === 'cvPreviewModal') closeCvModal();
      else if (activeModalEl.id === 'caseModal') closeCaseModal();
      else if (activeModalEl.id === 'cmdPaletteModal') closeCmdPalette();
      return;
    }

    // Strict Focus Trap on Tab / Shift+Tab (Fixes Defect #2!)
    if (e.key === 'Tab') {
      const focusables = getFocusableElements(activeModalEl);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement;

      if (e.shiftKey) {
        if (current === first || !activeModalEl.contains(current)) {
          e.preventDefault();
          e.stopPropagation();
          last.focus();
        }
      } else {
        if (current === last || !activeModalEl.contains(current)) {
          e.preventDefault();
          e.stopPropagation();
          first.focus();
        }
      }
    }
  }, true);

  // Copy Email helper
  window.copyEmailAddress = function (btnEl) {
    const email = 'mazher.khaja313@outlook.co.nz';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
    const label = document.getElementById('footerEmailLabel');
    if (label) {
      label.textContent = 'Copied: mazher.khaja313@outlook.co.nz ✓';
      setTimeout(() => { label.textContent = 'Copy Email Address'; }, 2000);
    }
  };

  // Initialize UI on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    renderWorkGrid();
    selectEra(6); // Default to Stage 07: MBIE Test Lead / Data Migration Test Lead
    triggerSignalReveal(false);

    // Search button & input listeners
    const openSearchBtn = document.getElementById('openCmdPaletteBtn');
    if (openSearchBtn) {
      openSearchBtn.addEventListener('click', function () {
        openCmdPalette(openSearchBtn);
      });
    }

    const searchInput = document.getElementById('cmdSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        renderCmdResults(searchInput.value);
      });
      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && filteredCmdItems.length > 0) {
          e.preventDefault();
          filteredCmdItems[0].action();
        }
      });
    }

    // Mobile Menu Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const mobileMenuBtnLabel = document.getElementById('mobileMenuBtnLabel');
    if (mobileMenuBtn && mobileNavDrawer) {
      mobileMenuBtn.addEventListener('click', function () {
        const isOpen = !mobileNavDrawer.classList.contains('hidden');
        if (isOpen) {
          mobileNavDrawer.classList.add('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          if (mobileMenuBtnLabel) mobileMenuBtnLabel.textContent = 'Menu ☰';
        } else {
          mobileNavDrawer.classList.remove('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'true');
          if (mobileMenuBtnLabel) mobileMenuBtnLabel.textContent = 'Close ✕';
        }
      });
      mobileNavDrawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileNavDrawer.classList.add('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          if (mobileMenuBtnLabel) mobileMenuBtnLabel.textContent = 'Menu ☰';
        });
      });
    }

    // Scroll Progress Bar
    window.addEventListener('scroll', function () {
      const bar = document.getElementById('progressBar');
      if (!bar) return;
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      bar.style.width = scrolled + '%';
    }, { passive: true });
  });
})();
