/* ════════════════════════════════════════════════════════════
   LK LUXURY KREST — MAIN SCRIPT
   Structure mirrors the HTML document order:
   1. Element References
   2. Header — Hamburger Menu Toggle
   3. Header — Search Overlay
   4. Hero — Scroll-to-Work (Intro Button)
   5. Hero — Video Switcher + Slider + Auto-Advance
   6. Trust — Animated Stat Counters
   7. Work — Slider, Filters & Progress Bar
   8. Wizard — "New Project" Request Modal
   ════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  /* ──────────────────────────────────────────────────────────
     1. ELEMENT REFERENCES
     ────────────────────────────────────────────────────────── */
  // Header
  const menuBtn = document.querySelector(".navbar__menu-btn");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const header = document.querySelector(".site-header");

  // Hero
  const introButton = document.getElementById("introButton");
  const heroSection = document.getElementById("hero");
  const workSection = document.getElementById("work");
  const heroSlider = document.getElementById("hero-slider");
  const heroCards = document.querySelectorAll(".hero__card");
  const heroVideos = document.querySelectorAll(".hero__video");
  const heroDotsWrap = document.getElementById("hero-dots");

  // Trust
  const trustSection = document.querySelector(".trust");
  const trustNumbers = document.querySelectorAll(".trust__number");

  // Work
  const workSlider = document.getElementById("work-slider");
  const workProgress = document.getElementById("work-progress");
  const workFilters = document.querySelectorAll(".work__filter");
  const workCards = document.querySelectorAll(".work__card");
  const newWebsiteBtn = document.querySelector(".work__cta-btn");

  // Wizard
  const wizardOverlay = document.getElementById("wizard-overlay");
  const wizardCloseBtn = document.getElementById("wizard-close");
  const ctaCard = document.querySelector(".work__card--cta");
  const wizardTypeButtons = document.querySelectorAll(".wizard__type");
  const next1 = document.getElementById("next-1");
  const next2 = document.getElementById("next-2");
  const inputName = document.getElementById("input-name");
  const inputProject = document.getElementById("input-project");
  const inputContact = document.getElementById("input-contact");

  /* ──────────────────────────────────────────────────────────
     2. HEADER — HAMBURGER MENU TOGGLE
     ────────────────────────────────────────────────────────── */
  function toggleMenu() {
    menuBtn.classList.toggle("active");
    dropdownMenu.classList.toggle("show");
  }
  menuBtn?.addEventListener("click", toggleMenu);

  // Close the dropdown when clicking anywhere outside of it
  document.addEventListener("click", (e) => {
    const clickedOutside = !menuBtn.contains(e.target) && !dropdownMenu.contains(e.target);
    if (clickedOutside) {
      dropdownMenu.classList.remove("show");
      menuBtn.classList.remove("active");
    }
  });

  /* ──────────────────────────────────────────────────────────
     3. HEADER — SEARCH OVERLAY
     ────────────────────────────────────────────────────────── */
  const searchToggleBtn = document.getElementById("searchToggleBtn");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInput = document.querySelector(".search-overlay__input");

  function toggleSearchOverlay() {
    const isActive = searchOverlay.classList.toggle("search-overlay--active");
    searchToggleBtn.classList.toggle("active", isActive);
    searchToggleBtn.setAttribute("aria-label", isActive ? "Close search" : "Search");
    if (isActive) searchInput.focus();
  }
  searchToggleBtn?.addEventListener("click", toggleSearchOverlay);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchOverlay.classList.contains("search-overlay--active")) {
      toggleSearchOverlay();
    }
  });

  /* ── SEARCH OVERLAY 2 ── */

  const searchTrigger = document.getElementById("searchTrigger");
  const searchClose = document.getElementById("searchClose");
  const emptyState = document.getElementById("emptyState");
  const emptyQuery = document.getElementById("emptyQuery");
  const productGrid = document.getElementById("productGrid");
  const recentSearchesEl = document.getElementById("recentSearches");
  const filterTabs = document.querySelectorAll(".search-filters__tab");
  const productCards = document.querySelectorAll(".product-card");
  const ghostEl = document.getElementById("searchGhost");

  /* ── Suggested Terms ── */
  // Replace/extend this list with your real project names, client names, and industries
  const suggestedTerms = [
    "VERD — Botanical Atelier",
    "Northgate Consulting",
    "Studio Marin",
    "E-commerce",
    "Corporate",
    "Portfolio",
    "Fragrance brand",
    "Architecture firm",
    "Consulting website",
    "Website design",
    "Web development"
  ];

  let currentSuggestion = "";

  /* ── Measure text width with the input's actual font (canvas trick) ── */
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  function measureTextWidth(text) {
    measureCtx.font = getComputedStyle(searchInput).font;
    return measureCtx.measureText(text).width;
  }

  /* Re-centers the typed+suggestion block as a single unit, so the visible
   input text and the greyed-out suggestion line up exactly instead of
   each being centered independently (which drifts as the suggestion grows). */
  function alignInputAndGhost(query, match) {
    if (!match) {
      searchInput.style.textAlign = "center";
      searchInput.style.paddingLeft = "";
      ghostEl.style.textAlign = "center";
      ghostEl.style.paddingLeft = "";
      return;
    }
    const wrapWidth = searchInput.parentElement.clientWidth;
    const fullWidth = measureTextWidth(match);
    const offset = Math.max(0, (wrapWidth - fullWidth) / 2);
    searchInput.style.textAlign = "left";
    searchInput.style.paddingLeft = offset + "px";
    ghostEl.style.textAlign = "left";
    ghostEl.style.paddingLeft = offset + "px";
  }

  /* ── Open / Close ── */
  function openSearch() {
    searchOverlay.classList.add("search-overlay--active");
    document.body.style.overflow = "hidden";
    renderRecentSearches();
    setTimeout(() => searchInput.focus(), 300);
  }

  function closeSearch() {
    searchOverlay.classList.remove("search-overlay--active");
    document.body.style.overflow = "";
    searchInput.value = "";
    emptyState.classList.remove("search-overlay__empty--visible");
    currentSuggestion = "";
    ghostEl.innerHTML = "";
    alignInputAndGhost("", null);
  }

  searchTrigger?.addEventListener("click", openSearch);
  searchClose?.addEventListener("click", closeSearch);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchOverlay.classList.contains("search-overlay--active")) {
      closeSearch();
    }
  });

  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  /* ── Recent Searches (localStorage) ── */
  function getRecentSearches() {
    return JSON.parse(localStorage.getItem("studio_recent_searches") || "[]");
  }

  function saveRecentSearch(term) {
    if (!term.trim()) return;
    let recent = getRecentSearches().filter((t) => t.toLowerCase() !== term.toLowerCase());
    recent.unshift(term);
    recent = recent.slice(0, 5);
    localStorage.setItem("studio_recent_searches", JSON.stringify(recent));
  }

  function removeRecentSearch(term) {
    const recent = getRecentSearches().filter((t) => t !== term);
    localStorage.setItem("studio_recent_searches", JSON.stringify(recent));
    renderRecentSearches();
  }

  function renderRecentSearches() {
    const recent = getRecentSearches();
    recentSearchesEl.innerHTML = "";
    if (recent.length === 0) {
      recentSearchesEl.classList.remove("recent-searches--visible");
      return;
    }
    recentSearchesEl.classList.add("recent-searches--visible");

    const title = document.createElement("p");
    title.className = "popular-searches__title";
    title.style.fontSize = "14px";
    title.style.letterSpacing = "3px";
    title.style.marginBottom = "6px";
    title.textContent = "Recent";
    recentSearchesEl.appendChild(title);

    recent.forEach((term) => {
      const item = document.createElement("div");
      item.className = "recent-searches__item";
      item.innerHTML = `<span>${term}</span><button aria-label="Remove">✕</button>`;
      item.querySelector("button").addEventListener("click", () => removeRecentSearch(term));
      item.querySelector("span").addEventListener("click", () => {
        searchInput.value = term;
        searchInput.dispatchEvent(new Event("input"));
      });
      recentSearchesEl.appendChild(item);
    });
  }

  /* ── Ghost-text autocomplete (suggestion rendered inline inside the field) ── */
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderGhost(query) {
    if (!query) {
      currentSuggestion = "";
      ghostEl.innerHTML = "";
      alignInputAndGhost(query, null);
      return;
    }

    const q = query.toLowerCase();
    // Only complete when the suggestion actually starts with what was typed —
    // that's what makes a ghost/inline completion make sense.
    const match = suggestedTerms.find((term) => term.toLowerCase().startsWith(q) && term.length > query.length);

    if (!match) {
      currentSuggestion = "";
      ghostEl.innerHTML = "";
      alignInputAndGhost(query, null);
      return;
    }

    currentSuggestion = match;
    const typedPart = match.slice(0, query.length);
    const restPart = match.slice(query.length);
    // First span mirrors the typed text but stays invisible, so it just
    // reserves the space — the second span (the real suggestion) then
    // lines up right after the caret.
    ghostEl.innerHTML = `<span>${escapeHtml(typedPart)}</span><span>${escapeHtml(restPart)}</span>`;
    alignInputAndGhost(query, match);
  }

  function acceptGhostSuggestion() {
    if (!currentSuggestion) return false;
    searchInput.value = currentSuggestion;
    ghostEl.innerHTML = "";
    currentSuggestion = "";
    searchInput.dispatchEvent(new Event("input"));
    // Move caret to the end
    const len = searchInput.value.length;
    searchInput.setSelectionRange(len, len);
    return true;
  }

  /* ── Search Input -> Suggestions + Empty State + Save on Enter ── */
  searchInput.addEventListener("input", () => {
    const query = searchInput.value;
    renderGhost(query);
    const trimmedQuery = query.trim();

    if (trimmedQuery.length > 0) {
      // Demo: treat any query with no matching project name as "no results"
      const matches = Array.from(productCards).some((card) =>
        card.querySelector(".product-card__name").textContent.toLowerCase().includes(trimmedQuery.toLowerCase())
      );
      if (!matches) {
        emptyQuery.textContent = trimmedQuery;
        emptyState.classList.add("search-overlay__empty--visible");
      } else {
        emptyState.classList.remove("search-overlay__empty--visible");
      }
    } else {
      emptyState.classList.remove("search-overlay__empty--visible");
    }
  });

  searchInput.addEventListener("keydown", (e) => {
    const caretAtEnd = searchInput.selectionStart === searchInput.value.length;

    // Tab, or → pressed with the caret at the end, accepts the ghost suggestion
    if (currentSuggestion && caretAtEnd && (e.key === "Tab" || e.key === "ArrowRight")) {
      e.preventDefault();
      acceptGhostSuggestion();
      return;
    }

    if (e.key === "Enter") {
      if (currentSuggestion) {
        acceptGhostSuggestion();
      }
      if (searchInput.value.trim()) {
        saveRecentSearch(searchInput.value.trim());
      }
    }
  });

  /* ── Category Filters ── */
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("search-filters__tab--active"));
      tab.classList.add("search-filters__tab--active");
      const filter = tab.dataset.filter;

      productCards.forEach((card) => {
        if (filter === "all" || card.dataset.category === filter) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* ── Skeleton Loading Demo (simulates fetch delay) ── */
  function showSkeletonThenLoad() {
    productGrid.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const skeleton = document.createElement("div");
      skeleton.className = "product-card product-card--skeleton";
      skeleton.innerHTML = `
            <div class="product-card__image"></div>
            <div class="product-card__info">
                <h4 class="product-card__name">Loading name</h4>
                <span class="product-card__price">Loading</span>
            </div>
        `;
      productGrid.appendChild(skeleton);
    }
    // Simulated network delay — replace with real fetch in production
    setTimeout(() => {
      location.reload(); // demo only: reload to restore real cards
    }, 1200);
  }
  // Uncomment to test on page load:
  // showSkeletonThenLoad();

  /* ──────────────────────────────────────────────────────────
     4. HERO — SCROLL-TO-WORK (INTRO BUTTON)
     "Explore Now" now scrolls down to the Work section.
     ────────────────────────────────────────────────────────── */
  function scrollToWork(e) {
    if (!introButton || !workSection) return;
    e.preventDefault();
    const headerOffset = header?.offsetHeight || 0;
    const elementPosition = workSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
  introButton?.addEventListener("click", scrollToWork);

  /* ──────────────────────────────────────────────────────────
     5. HERO — VIDEO SWITCHER + SLIDER + AUTO-ADVANCE
     Keeps the active project card, active background video,
     and active dot all in sync with each other.
     ────────────────────────────────────────────────────────── */
  let heroCurrentIndex = 0;
  let heroAutoTimer = null;
  let heroIsScrolling = false;

  // Build one dot per hero card
  heroCards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "hero__dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goToHeroCard(i));
    heroDotsWrap?.appendChild(dot);
  });
  const heroDots = document.querySelectorAll(".hero__dot");

  // Switch the active card, video, and dot to the given index
  function goToHeroCard(index) {
    if (index === heroCurrentIndex) return;

    heroCards[heroCurrentIndex]?.classList.remove("active");
    heroCards[index]?.classList.add("active");

    heroVideos[heroCurrentIndex]?.classList.remove("active");
    const nextVideo = heroVideos[index];
    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
      nextVideo.classList.add("active");
    }

    heroDots[heroCurrentIndex]?.classList.remove("active");
    heroDots[index]?.classList.add("active");

    heroCurrentIndex = index;
    centerHeroCard(index);
  }

  // Smoothly scroll the slider so the given card is centered
  function centerHeroCard(index) {
    if (!heroSlider || !heroCards[index]) return;
    heroIsScrolling = true;
    const card = heroCards[index];
    const offset = card.offsetLeft - heroSlider.offsetWidth / 2 + card.offsetWidth / 2;
    heroSlider.scrollTo({ left: offset, behavior: "smooth" });
    setTimeout(() => {
      heroIsScrolling = false;
    }, 600);
  }

  // Auto-advance to the next card every 3 seconds
  function startHeroAuto() {
    heroAutoTimer = setInterval(() => {
      const next = (heroCurrentIndex + 1) % heroCards.length;
      goToHeroCard(next);
    }, 3000);
  }
  function stopHeroAuto() {
    clearInterval(heroAutoTimer);
  }

  // Find which card is closest to the center of the slider viewport
  function getCardInCenter() {
    if (!heroSlider) return 0;
    const sliderCenter = heroSlider.scrollLeft + heroSlider.offsetWidth / 2;
    let closest = 0;
    let minDistance = Infinity;
    heroCards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(sliderCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closest = i;
      }
    });
    return closest;
  }

  // When the user manually scrolls the slider, sync the active
  // card/video/dot to whichever card ends up centered
  heroSlider?.addEventListener("scroll", () => {
    if (heroIsScrolling) return;
    clearTimeout(heroSlider._scrollEndTimer);
    heroSlider._scrollEndTimer = setTimeout(() => {
      const centered = getCardInCenter();
      if (centered !== heroCurrentIndex) {
        heroCards[heroCurrentIndex]?.classList.remove("active");
        heroVideos[heroCurrentIndex]?.classList.remove("active");
        heroDots[heroCurrentIndex]?.classList.remove("active");

        heroCurrentIndex = centered;

        heroCards[heroCurrentIndex]?.classList.add("active");
        heroDots[heroCurrentIndex]?.classList.add("active");

        const video = heroVideos[heroCurrentIndex];
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
          video.classList.add("active");
        }
      }
    }, 150);
  });

  // Pause auto-advance while the user is interacting with the slider
  heroSlider?.addEventListener("mouseenter", stopHeroAuto);
  heroSlider?.addEventListener("mouseleave", startHeroAuto);
  heroSlider?.addEventListener("touchstart", stopHeroAuto, { passive: true });
  heroSlider?.addEventListener("touchend", startHeroAuto, { passive: true });

  // Initialize hero state once everything has loaded
  window.addEventListener("load", () => {
    if (!heroCards.length) return;

    heroCards[0]?.classList.add("active");
    const firstVideo = heroVideos[0];
    if (firstVideo) {
      firstVideo.classList.add("active");
      firstVideo.play().catch(() => {});
    }

    centerHeroCard(0);
    startHeroAuto();
  });

  /* ──────────────────────────────────────────────────────────
     6. TRUST — ANIMATED STAT COUNTERS
     Counts up from 0 to each stat's target once the section
     scrolls into view (runs only once).
     ────────────────────────────────────────────────────────── */
  let trustCountStarted = false;

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target) + (progress === 1 ? "+" : "");
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (trustSection) {
    const trustObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !trustCountStarted) {
          trustCountStarted = true;
          trustNumbers.forEach(animateCount);
          trustObserver.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    trustObserver.observe(trustSection);
  }

  /* ──────────────────────────────────────────────────────────
     7. WORK — SLIDER, FILTERS & PROGRESS BAR
     ────────────────────────────────────────────────────────── */
  function updateWorkProgress() {
    const max = workSlider.scrollWidth - workSlider.clientWidth;
    workProgress.style.width = (max > 0 ? (workSlider.scrollLeft / max) * 100 : 0) + "%";
  }

  // Exposed globally so the inline onclick="" arrow buttons in the
  // markup can call it directly
  function scrollSlider(direction) {
    const cardWidth = workSlider.querySelector(".work__card, .work__card--cta")?.offsetWidth || 220;
    workSlider.scrollBy({ left: direction * (cardWidth + 10), behavior: "smooth" });
  }
  window.scrollSlider = scrollSlider;

  workSlider.addEventListener("scroll", updateWorkProgress);
  window.addEventListener("resize", updateWorkProgress);

  // Center the third card on load and sync the progress bar
  window.addEventListener("load", () => {
    const cards = workSlider.querySelectorAll(".work__card");
    if (!cards.length) return;
    const card = cards[2];
    workSlider.scrollLeft = card.offsetLeft - workSlider.offsetWidth / 2 + card.offsetWidth / 2;
    updateWorkProgress();
  });

  // Filter the project cards by category
  workFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      workFilters.forEach((f) => {
        f.classList.remove("active");
        f.classList.add("dimmed");
      });
      filter.classList.add("active");
      filter.classList.remove("dimmed");

      const selectedCategory = filter.textContent.trim().toLowerCase().replace(/\s+/g, "-");
      workCards.forEach((card) => {
        const matchesFilter = selectedCategory === "websites" || card.dataset.category === selectedCategory;
        card.classList.toggle("hidden", !matchesFilter);
      });

      workSlider.scrollLeft = 0;
      updateWorkProgress();
    });
  });

  /* ──────────────────────────────────────────────────────────
     8. WIZARD — "NEW PROJECT" REQUEST MODAL
     3-step flow: pick a project type → enter contact details
     → confirmation screen.
     Opened from either the "+ Your Project" CTA card in the
     slider, or the "New Website Now" button below the slider.
     ────────────────────────────────────────────────────────── */
  let wizardSelectedType = "";

  function openWizard() {
    wizardOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeWizard() {
    wizardOverlay.classList.remove("open");
    document.body.style.overflow = "";
    goToWizardStep(1);

    wizardTypeButtons.forEach((btn) => btn.classList.remove("selected"));
    next1.disabled = true;

    inputName.value = "";
    inputProject.value = "";
    inputContact.value = "";
    next2.disabled = true;

    wizardSelectedType = "";
  }

  function goToWizardStep(stepNumber) {
    document.querySelectorAll(".wizard__step").forEach((step) => step.classList.remove("active"));
    document.getElementById("step-" + stepNumber).classList.add("active");

    ["dot-1", "dot-2", "dot-3"].forEach((id, i) => {
      document.getElementById(id).classList.toggle("done", i < stepNumber);
    });
  }

  ctaCard.addEventListener("click", openWizard);
  newWebsiteBtn?.addEventListener("click", openWizard);
  wizardCloseBtn.addEventListener("click", closeWizard);
  wizardOverlay.addEventListener("click", (e) => {
    if (e.target === wizardOverlay) closeWizard();
  });

  // Step 1: project type selection
  wizardTypeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      wizardTypeButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      wizardSelectedType = btn.dataset.type;
      next1.disabled = false;
    });
  });
  next1.addEventListener("click", () => goToWizardStep(2));

  // Step 2: contact details
  function checkWizardStep2() {
    next2.disabled = !(inputName.value.trim() && inputProject.value.trim() && inputContact.value.trim());
  }
  [inputName, inputProject, inputContact].forEach((input) => input.addEventListener("input", checkWizardStep2));

  next2.addEventListener("click", () => {
    // Reserved for sending the request (e.g. via WhatsApp deep link):
    // const message = `New Project Request:%0AType: ${wizardSelectedType}%0AName: ${inputName.value}%0AProject: ${inputProject.value}%0AContact: ${inputContact.value}`;
    // window.open("https://wa.me/YOUR_NUMBER?text=" + message, "_blank");
    goToWizardStep(3);
  });
});
