/* =========================================================
   WATER SAFE — FINAL INTERACTIVE JAVASCRIPT
   CHE110 • Group 13 • LPU
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("ready");

  /* BASIC HELPERS */
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const root = document.documentElement;
  const finePointer = window.matchMedia("(pointer:fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* HEADER + SCROLL PROGRESS */
  const header = $("#siteHeader");
  const progressBar = $("#progressBar");

  function updateScrollUI() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 30);
    }
    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }
  }

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();


  /* MOBILE MENU */
  const menuBtn = $("#menuBtn");
  const mobileNav = $("#mobileNav");

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.textContent = open ? "×" : "☰";
    });

    $$(".mobile-nav a").forEach(link => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        menuBtn.textContent = "☰";
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* SCROLL REVEAL */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  $$(".reveal").forEach(element => {
    revealObserver.observe(element);
  });


  /* HERO PARALLAX */
  const hero = $(".hero");
  const heroCard = $("#heroWaterCard");

  if (hero && heroCard && finePointer && !reducedMotion) {
    hero.addEventListener("mousemove", event => {
      const x = (event.clientX / window.innerWidth - 0.5) * 12;
      const y = (event.clientY / window.innerHeight - 0.5) * 12;
      heroCard.style.transform = `translate(${x}px, calc(-50% + ${y}px))`;
    });

    hero.addEventListener("mouseleave", () => {
      heroCard.style.transform = "translateY(-50%)";
    });
  }


  /* UNIVERSAL INFORMATION MODAL */
  const modal = document.createElement("div");
  modal.className = "info-modal";

  modal.innerHTML = `
    <div class="info-modal-backdrop" data-modal-close></div>

    <div class="info-modal-panel" role="dialog" aria-modal="true" aria-labelledby="infoModalTitle">

      <button class="info-modal-close" type="button" aria-label="Close information" data-modal-close>
        ×
      </button>

      <div class="info-modal-icon" id="infoModalIcon">
        💧
      </div>

      <span class="info-modal-category" id="infoModalCategory">
        WATER SAFETY
      </span>

      <h2 id="infoModalTitle">
        Information
      </h2>

      <div class="info-modal-body" id="infoModalBody"></div>

      <div class="info-modal-source" id="infoModalSource"></div>

    </div>
  `;

  document.body.appendChild(modal);

  const modalIcon = $("#infoModalIcon", modal);
  const modalCategory = $("#infoModalCategory", modal);
  const modalTitle = $("#infoModalTitle", modal);
  const modalBody = $("#infoModalBody", modal);
  const modalSource = $("#infoModalSource", modal);

  let previousFocus = null;


  function openInfoModal({
    title = "Water Safety",
    category = "INFORMATION",
    icon = "💧",
    content = "",
    source = ""
  }) {
    previousFocus = document.activeElement;

    modalIcon.textContent = icon;
    modalCategory.textContent = category;
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modalSource.innerHTML = source;

    modal.classList.add("open");
    document.body.classList.add("modal-open");

    setTimeout(() => {
      $(".info-modal-close", modal)?.focus();
    }, 50);
  }


  function closeInfoModal() {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }


  $$("[data-modal-close]", modal).forEach(element => {
    element.addEventListener("click", closeInfoModal);
  });


  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeInfoModal();
    }
  });


  /* UNIVERSAL CARD INFORMATION */
  const cardInformation = {

    ".hero-water-card": {
      title: "Clean water is more than hydration",
      category: "WATER & HEALTH",
      icon: "💧",
      content: `
        <p>
          Drinking water is essential for life, but safety depends
          on more than simply having access to water.
        </p>

        <p>
          A safe drinking-water system considers the source,
          treatment, distribution, storage and the hygiene practices
          of people using the water.
        </p>

        <div class="modal-highlight">
          <strong>Key idea</strong>
          <span>
            Water safety is a chain. A problem at any stage can
            affect the final drinking-water experience.
          </span>
        </div>
      `
    },

    ".hero-meta span:nth-child(1)": {
      title: "Global water access",
      category: "GLOBAL ACCESS",
      icon: "🌍",
      content: `
        <p>
          Drinking-water access differs greatly between countries,
          communities and households.
        </p>

        <p>
          The WHO/UNICEF Joint Monitoring Programme distinguishes
          between basic access and safely managed drinking water.
        </p>

        <div class="modal-highlight">
          <strong>Safely managed means</strong>
          <span>
            An improved source that is accessible on premises,
            available when needed and free from contamination.
          </span>
        </div>
      `
    },

    ".hero-meta span:nth-child(2)": {
      title: "Water quality",
      category: "WATER QUALITY",
      icon: "🔬",
      content: `
        <p>
          Water quality cannot normally be judged simply by
          looking at the water.
        </p>

        <p>
          Microbial, chemical and physical characteristics may
          require appropriate testing.
        </p>

        <div class="modal-highlight">
          <strong>Remember</strong>
          <span>
            Clear-looking water is not automatically safe water.
          </span>
        </div>
      `
    },

    ".hero-meta span:nth-child(3)": {
      title: "Prevention",
      category: "PREVENTION",
      icon: "🛡️",
      content: `
        <p>
          Prevention includes protecting water sources, maintaining
          infrastructure and practising good hygiene.
        </p>

        <p>
          At the personal level, regularly cleaning reusable bottles,
          washing hands and reporting visibly unsafe water points
          can reduce avoidable hygiene risks.
        </p>
      `
    }

  };


  /* GLOBAL FACT CARDS */
  const factDetails = [
    {
      title: "Safely managed drinking water",
      icon: "🌍",
      content: `
        <p>
          In 2022, about 73% of the world's population used
          safely managed drinking-water services according to WHO.
        </p>

        <p>
          This means billions of people still lacked water that
          met all the conditions of safe management.
        </p>

        <div class="modal-highlight">
          <strong>Definition</strong>
          <span>
            Improved source + accessible + available when needed
            + free from contamination.
          </span>
        </div>
      `
    },

    {
      title: "India's drinking-water progress",
      icon: "🇮🇳",
      content: `
        <p>
          UNICEF India's summary of the latest JMP estimates reports
          safely managed drinking-water coverage of approximately
          76.4% for India in 2024.
        </p>

        <p>
          Access and functionality are different concepts, so water
          infrastructure also needs regular maintenance and monitoring.
        </p>
      `
    },

    {
      title: "The contamination challenge",
      icon: "⚠️",
      content: `
        <p>
          Microbial contamination is one of the greatest risks to
          drinking-water safety.
        </p>

        <p>
          Contaminated water can transmit diseases including
          diarrhoea, cholera, dysentery, hepatitis A, typhoid and polio.
        </p>
      `
    }

  ];


  $$(".fact-card").forEach((card, index) => {
    const detail = factDetails[index];

    if (!detail) {
      return;
    }

    card.addEventListener("click", () => {
      openInfoModal({
        title: detail.title,
        category: "GLOBAL WATER",
        icon: detail.icon,
        content: detail.content
      });
    });

    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });
  });


  /* GENERIC CARD INFORMATION */
  Object.entries(cardInformation).forEach(([selector, detail]) => {
    const elements = $$(selector);

    elements.forEach(element => {
      element.classList.add("is-interactive");
      element.setAttribute("tabindex", "0");
      element.setAttribute("role", "button");

      element.addEventListener("click", event => {
        if (event.target.closest("a,button")) {
          return;
        }
        openInfoModal(detail);
      });

      element.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          element.click();
        }
      });
    });
  });


  /* GLOBAL WATER EXPLORER */
  const regionInfo = {

    india: {
      title: "India",
      icon: "🇮🇳",
      stat: "76.4%",
      label: "safely managed coverage in 2024",
      content: `
        <p>
          India's drinking-water access has expanded significantly,
          while quality, regularity and functionality remain important
          parts of water-safety management.
        </p>

        <div class="modal-highlight">
          <strong>Focus</strong>
          <span>
            Access, reliability, water quality and safe use all matter.
          </span>
        </div>
      `
    },

    asia: {
      title: "Asia",
      icon: "🌏",
      stat: "REGIONAL",
      label: "large and diverse water systems",
      content: `
        <p>
          Asia contains extremely diverse water systems, from
          heavily urbanised regions to remote communities.
        </p>

        <p>
          Water safety challenges therefore vary widely between
          locations.
        </p>
      `
    },

    africa: {
      title: "Africa",
      icon: "🌍",
      stat: "HIGH VARIATION",
      label: "access differs substantially by location",
      content: `
        <p>
          Drinking-water access varies substantially across African
          countries and communities.
        </p>

        <p>
          Infrastructure, climate, geography and water quality can
          all influence access.
        </p>
      `
    },

    europe: {
      title: "Europe",
      icon: "🌍",
      stat: "HIGH COVERAGE",
      label: "generally strong managed services",
      content: `
        <p>
          Many European countries have high levels of safely managed
          drinking-water services, supported by established infrastructure
          and regulation.
        </p>
      `
    },

    northamerica: {
      title: "North America",
      icon: "🌎",
      stat: "HIGH COVERAGE",
      label: "established drinking-water systems",
      content: `
        <p>
          North American drinking-water systems generally have broad
          access to managed services, although local contamination events
          and infrastructure challenges can still occur.
        </p>
      `
    },

    southamerica: {
      title: "South America",
      icon: "🌎",
      stat: "MIXED",
      label: "coverage differs across communities",
      content: `
        <p>
          Water access and quality vary across South American countries,
          cities and rural communities.
        </p>
      `
    },

    oceania: {
      title: "Oceania",
      icon: "🌊",
      stat: "VARIED",
      label: "different conditions across islands and Australia",
      content: `
        <p>
          Oceania includes highly different water systems, from
          large developed networks to small island communities.
        </p>
      `
    }

  };


  $$(".continent").forEach(continent => {
    continent.addEventListener("click", () => {
      $$(".continent").forEach(item => {
        item.classList.remove("active");
      });

      continent.classList.add("active");

      const region = continent.dataset.region;
      const detail = regionInfo[region];

      if (!detail) {
        return;
      }

      openInfoModal({
        title: detail.title,
        category: "GLOBAL WATER EXPLORER",
        icon: detail.icon,
        content: `
          <div class="explorer-stat">
            <strong>${detail.stat}</strong>
            <span>${detail.label}</span>
          </div>
          ${detail.content}
        `
      });
    });
  });


  /* WATER SOURCE EXPLORER */
  const sourceData = {

    surface: {
      title: "Surface water",
      icon: "🌊",
      description:
        "Rivers, lakes and reservoirs can provide drinking water but may be exposed to microbial and chemical contamination.",
      points: [
        "Requires appropriate treatment before drinking.",
        "Can be affected by runoff and human activity.",
        "Protection of the source is part of water safety."
      ]
    },

    ground: {
      title: "Groundwater",
      icon: "💧",
      description:
        "Groundwater can be naturally protected, but its quality can vary because of geology and contamination entering the ground.",
      points: [
        "May contain naturally occurring minerals.",
        "Can be affected by agricultural or industrial contamination.",
        "Testing helps identify chemical concerns."
      ]
    },

    rain: {
      title: "Rainwater",
      icon: "🌧️",
      description:
        "Rainwater can be collected, but collection surfaces, storage containers and surrounding conditions affect its quality.",
      points: [
        "Collection surfaces should be clean.",
        "Storage containers need regular maintenance.",
        "Treatment may be needed depending on use and quality."
      ]
    },

    reservoir: {
      title: "Reservoir water",
      icon: "🏞️",
      description:
        "Reservoirs store large quantities of water and can be important sources for treated drinking-water systems.",
      points: [
        "Source protection is important.",
        "Water quality can change with environmental conditions.",
        "Treatment and monitoring remain essential."
      ]
    },

    treated: {
      title: "Treated drinking water",
      icon: "🧪",
      description:
        "Treatment systems are designed to reduce contaminants and produce water suitable for its intended use.",
      points: [
        "Treatment should be supported by monitoring.",
        "Distribution and storage also matter.",
        "Safe handling at the point of use is still important."
      ]
    }

  };


  const sourceTabs = $$(".source-tab");
  const sourceTitle = $("#sourceTitle");
  const sourceDescription = $("#sourceDescription");
  const sourcePoints = $("#sourcePoints");

  function renderSource(key) {
    const data = sourceData[key];

    if (!data) {
      return;
    }

    sourceTabs.forEach(tab => {
      tab.classList.toggle("active", tab.dataset.source === key);
    });

    if (sourceTitle) {
      sourceTitle.innerHTML = `${data.icon} ${data.title}`;
    }

    if (sourceDescription) {
      sourceDescription.textContent = data.description;
    }

    if (sourcePoints) {
      sourcePoints.innerHTML = data.points.map(point => `<li>${point}</li>`).join("");
    }
  }


  sourceTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      renderSource(tab.dataset.source);
    });
  });


  renderSource(sourceTabs[0]?.dataset.source || "surface");


  /* WATER QUALITY LAB */
  const labSamples = {

    treated: {
      title: "Treated water sample",
      status: "REFERENCE SAMPLE",
      description:
        "A simplified example of a treated-water profile. Real drinking-water assessment requires appropriate laboratory or field testing.",
      values: {
        ph: "7.2",
        tds: "180 mg/L",
        turbidity: "0.4 NTU",
        fluoride: "0.6 mg/L",
        nitrate: "18 mg/L"
      },
      notes: [
        "Values are illustrative.",
        "pH is shown as a water-quality parameter, not a complete safety test.",
        "TDS is not itself a health-based safety cutoff."
      ]
    },

    surface: {
      title: "Surface water sample",
      status: "TREATMENT REQUIRED",
      description:
        "This illustrative sample represents water from a surface source before treatment.",
      values: {
        ph: "6.5",
        tds: "320 mg/L",
        turbidity: "8.7 NTU",
        fluoride: "0.4 mg/L",
        nitrate: "27 mg/L"
      },
      notes: [
        "Higher turbidity can indicate suspended particles.",
        "Surface water may require treatment before drinking.",
        "Microbial testing is particularly important."
      ]
    },

    nitrate: {
      title: "Nitrate concern",
      status: "CHEMICAL CONCERN",
      description:
        "This example highlights a nitrate value above the WHO guideline value of 50 mg/L as nitrate ion.",
      values: {
        ph: "7.4",
        tds: "410 mg/L",
        turbidity: "0.8 NTU",
        fluoride: "0.7 mg/L",
        nitrate: "68 mg/L"
      },
      notes: [
        "WHO guideline value for nitrate is 50 mg/L as nitrate ion.",
        "The example is intentionally simplified.",
        "Actual assessment requires representative sampling and testing."
      ]
    },

    fluoride: {
      title: "Fluoride concern",
      status: "CHEMICAL CONCERN",
      description:
        "This example highlights a fluoride value above the WHO guideline value of 1.5 mg/L.",
      values: {
        ph: "7.6",
        tds: "520 mg/L",
        turbidity: "0.6 NTU",
        fluoride: "2.1 mg/L",
        nitrate: "22 mg/L"
      },
      notes: [
        "WHO guideline value for fluoride is 1.5 mg/L.",
        "Excessive fluoride exposure over time can cause fluorosis.",
        "Actual assessment needs proper sampling and laboratory testing."
      ]
    }

  };


  const sampleButtons = $$(".sample-btn");
  const labTitle = $("#labTitle");
  const labStatus = $("#labStatus");
  const labDescription = $("#labDescription");
  const labNotes = $("#labNotes");


  function renderLab(key) {
    const sample = labSamples[key];

    if (!sample) {
      return;
    }

    sampleButtons.forEach(button => {
      button.classList.toggle("active", button.dataset.sample === key);
    });

    if (labTitle) {
      labTitle.textContent = sample.title;
    }

    if (labStatus) {
      labStatus.textContent = sample.status;
    }

    if (labDescription) {
      labDescription.textContent = sample.description;
    }

    Object.entries(sample.values).forEach(([para