/**
 * 포트폴리오 공통 Vanilla JavaScript 인터랙션
 * 각 기능은 해당 요소가 없는 페이지에서 조용히 종료됩니다.
 */

// 사용자가 쉽게 조절할 수 있는 설정값
const INTERACTION_SETTINGS = {
  // tiltMaxRotation: Hero 목업이 기울어지는 최대 각도(도). 값을 높이면 더 크게 기울어집니다.
  tiltMaxRotation: 4,
  // tiltMaxTranslate: 마우스에 따라 목업이 이동하는 최대 거리(px). 값을 높이면 이동 거리가 커집니다.
  tiltMaxTranslate: 4,
  // countDuration: Count-up이 0에서 최종 숫자까지 도달하는 시간(ms). 값을 높이면 더 천천히 증가합니다.
  countDuration: 900,
  // backToTopThreshold: 이 스크롤 위치(px) 이상에서 맨 위로 버튼이 나타납니다. 값을 높이면 더 늦게 나타납니다.
  backToTopThreshold: 600
};

document.addEventListener("DOMContentLoaded", function () {
  safeInit(initScrollProgress);
  safeInit(initBackToTop);
  safeInit(initHeroTilt);
  safeInit(initCountUp);
  safeInit(initAosAnimations);
  safeInit(initPrimaryNavDropdown);
  safeInit(initMobileOffcanvasNav);
  safeInit(initImageLightbox);
  safeInit(initPhotoshopViewToggle);
  safeInit(initFigmaEventCarousel);
});

function safeInit(initFunction) {
  try {
    initFunction();
  } catch (error) {
    console.error("인터랙션 초기화 오류:", error);
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isFinePointerDevice() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * AOS 2.3.1 init + CDN fallback
 * If CDN fails, show data-aos elements so content is not permanently hidden.
 * On mobile, map fade-left/right to fade-up to reduce horizontal overflow risk.
 */
function initAosAnimations() {
  var animated = document.querySelectorAll("[data-aos]");
  if (!animated.length) {
    return;
  }

  function showAosFallback() {
    animated.forEach(function (element) {
      element.classList.add("aos-animate");
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  }

  if (!window.AOS) {
    showAosFallback();
    return;
  }

  if (window.matchMedia("(max-width: 768px)").matches) {
    animated.forEach(function (element) {
      var effect = element.getAttribute("data-aos");
      if (effect === "fade-left" || effect === "fade-right") {
        element.setAttribute("data-aos", "fade-up");
      }
    });
  }

  window.AOS.init({
    duration: 700,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
    delay: 0,
    anchorPlacement: "top-bottom",
    disable: function () {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  });
}

/**
 * 화면 최상단 스크롤 진행 막대
 */
function initScrollProgress() {
  var progressRoot = document.createElement("div");
  progressRoot.className = "scroll-progress";
  progressRoot.setAttribute("aria-hidden", "true");

  var progressBar = document.createElement("div");
  progressBar.className = "scroll-progress__bar";
  progressRoot.appendChild(progressBar);
  document.body.appendChild(progressRoot);

  var ticking = false;

  function updateProgress() {
    ticking = false;

    // 현재 스크롤 위치
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    // 전체 스크롤 가능 거리 (문서 높이 - 보이는 창 높이)
    var scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
    // 0부터 1 사이의 비율로 변환 (스크롤할 영역이 없으면 0)
    var ratio = 0;
    if (scrollableDistance > 0) {
      ratio = scrollTop / scrollableDistance;
      if (ratio < 0) {
        ratio = 0;
      }
      if (ratio > 1) {
        ratio = 1;
      }
    }

    progressBar.style.transform = "scaleX(" + ratio + ")";
  }

  function onScroll() {
    // requestAnimationFrame으로 스크롤 이벤트마다 중복 그리기를 막습니다.
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateProgress();
}

/**
 * 스크롤 후 나타나는 맨 위로 이동 버튼
 */
function initBackToTop() {
  var button = document.createElement("button");
  button.type = "button";
  button.className = "back-to-top";
  button.setAttribute("aria-label", "페이지 맨 위로 이동");
  button.innerHTML = "&#8593;";
  button.setAttribute("hidden", "");
  document.body.appendChild(button);

  var ticking = false;

  function updateVisibility() {
    ticking = false;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var shouldShow = scrollTop >= INTERACTION_SETTINGS.backToTopThreshold;

    if (shouldShow) {
      button.removeAttribute("hidden");
      button.classList.add("is-visible");
      button.removeAttribute("tabindex");
    } else {
      button.classList.remove("is-visible");
      button.setAttribute("hidden", "");
      button.setAttribute("tabindex", "-1");
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateVisibility);
    }
  }

  button.addEventListener("click", function () {
    if (prefersReducedMotion()) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });
  window.addEventListener("resize", updateVisibility, { passive: true });
  updateVisibility();
}

/**
 * Home Hero 브라우저 목업 3D Tilt
 */
function initHeroTilt() {
  // Tilt applies to stage (mockup) only — text/caption stay fixed
  var tiltTarget =
    document.querySelector(".page-home .publishing-hero-visual__stage[data-hero-tilt]") ||
    document.querySelector(".page-home [data-hero-tilt]");

  if (!tiltTarget) {
    return;
  }

  if (prefersReducedMotion() || !isFinePointerDevice()) {
    return;
  }

  if (window.matchMedia("(max-width: 768px)").matches) {
    return;
  }

  var visualWrap = tiltTarget.closest(".editorial-hero-visual");
  if (visualWrap) {
    visualWrap.classList.add("editorial-hero-visual--tilt");
  }

  tiltTarget.classList.add("is-tilt-target");

  var maxRotation = INTERACTION_SETTINGS.tiltMaxRotation;
  var maxTranslate = INTERACTION_SETTINGS.tiltMaxTranslate;
  var ticking = false;
  var targetRotateX = 0;
  var targetRotateY = 0;
  var targetTranslateX = 0;
  var targetTranslateY = 0;

  function applyTransform() {
    ticking = false;
    tiltTarget.style.transform =
      "translate3d(" +
      targetTranslateX +
      "px, " +
      targetTranslateY +
      "px, 0) rotateX(" +
      targetRotateX +
      "deg) rotateY(" +
      targetRotateY +
      "deg)";
  }

  function scheduleTransform() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(applyTransform);
    }
  }

  function resetTilt() {
    targetRotateX = 0;
    targetRotateY = 0;
    targetTranslateX = 0;
    targetTranslateY = 0;
    scheduleTransform();
  }

  tiltTarget.addEventListener("pointermove", function (event) {
    var rect = tiltTarget.getBoundingClientRect();

    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var offsetX = event.clientX - centerX;
    var offsetY = event.clientY - centerY;

    var ratioX = offsetX / (rect.width / 2);
    var ratioY = offsetY / (rect.height / 2);

    if (ratioX < -1) {
      ratioX = -1;
    }
    if (ratioX > 1) {
      ratioX = 1;
    }
    if (ratioY < -1) {
      ratioY = -1;
    }
    if (ratioY > 1) {
      ratioY = 1;
    }

    targetRotateY = ratioX * maxRotation;
    targetRotateX = ratioY * -maxRotation;
    targetTranslateX = ratioX * maxTranslate;
    targetTranslateY = ratioY * maxTranslate;

    scheduleTransform();
  });

  tiltTarget.addEventListener("pointerleave", resetTilt);
}

/**
 * Home Bento 등 화면 진입 시 숫자 Count-up
 */
function initCountUp() {
  var countElements = document.querySelectorAll(".count-up[data-count]");

  if (countElements.length === 0) {
    return;
  }

  var duration = INTERACTION_SETTINGS.countDuration;

  function showFinalValue(element, finalValue) {
    var valueNode = element.querySelector(".count-up__value");
    if (valueNode) {
      valueNode.textContent = String(finalValue);
    } else {
      element.textContent = String(finalValue);
    }
  }

  function animateCount(element, finalValue) {
    var valueNode = element.querySelector(".count-up__value");
    if (!valueNode) {
      valueNode = element;
    }

    var startTime = null;

    function step(timestamp) {
      if (startTime === null) {
        startTime = timestamp;
      }

      // 경과 시간을 0~1 진행률로 바꾼 뒤 최종 숫자에 곱합니다.
      var elapsed = timestamp - startTime;
      var progress = elapsed / duration;

      if (progress >= 1) {
        valueNode.textContent = String(finalValue);
        return;
      }

      var currentValue = Math.round(finalValue * progress);
      valueNode.textContent = String(currentValue);
      window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }

  if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
    countElements.forEach(function (element) {
      var finalValue = parseInt(element.getAttribute("data-count"), 10);
      if (!isNaN(finalValue)) {
        showFinalValue(element, finalValue);
      }
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        var element = entry.target;
        var finalValue = parseInt(element.getAttribute("data-count"), 10);

        if (isNaN(finalValue)) {
          obs.unobserve(element);
          return;
        }

        animateCount(element, finalValue);
        // 한 번 실행한 뒤 observer를 해제해 스크롤 시 반복 실행을 막습니다.
        obs.unobserve(element);
      });
    },
  {
      threshold: 0.35
    }
  );

  countElements.forEach(function (element) {
    observer.observe(element);
  });
}

/**
 * Header PUBLISHING / DESIGN dropdown (PC only)
 * - PC: CSS hover/focus-within
 * - 모바일: offcanvas nav 사용 (initMobileOffcanvasNav)
 */
function initPrimaryNavDropdown() {
  var dropdowns = document.querySelectorAll(".nav-dropdown");

  if (dropdowns.length === 0) {
    return;
  }

  var desktopQuery = window.matchMedia("(min-width: 769px)");

  function isDesktopNav() {
    return desktopQuery.matches;
  }

  function closeAllDropdowns() {
    dropdowns.forEach(function (dropdown) {
      dropdown.classList.remove("is-open");
      var trigger = dropdown.querySelector(".nav-dropdown__trigger");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  function setDropdownExpanded(dropdown, expanded) {
    var trigger = dropdown.querySelector(".nav-dropdown__trigger");
    if (trigger) {
      trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
    }
  }

  dropdowns.forEach(function (dropdown) {
    dropdown.addEventListener("mouseenter", function () {
      if (isDesktopNav()) {
        setDropdownExpanded(dropdown, true);
      }
    });

    dropdown.addEventListener("mouseleave", function () {
      if (isDesktopNav() && !dropdown.contains(document.activeElement)) {
        setDropdownExpanded(dropdown, false);
      }
    });

    dropdown.addEventListener("focusin", function () {
      if (isDesktopNav()) {
        setDropdownExpanded(dropdown, true);
      }
    });

    dropdown.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (isDesktopNav() && !dropdown.contains(document.activeElement)) {
          setDropdownExpanded(dropdown, false);
        }
      }, 0);
    });
  });

  function onViewportChange() {
    if (!isDesktopNav()) {
      closeAllDropdowns();
    }
  }

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", onViewportChange);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(onViewportChange);
  }

  window.addEventListener("resize", onViewportChange, { passive: true });
}

/**
 * 모바일 off-canvas navigation (768px 이하)
 */
function initMobileOffcanvasNav() {
  var toggle = document.querySelector("[data-mobile-nav-toggle]");
  var panel = document.querySelector("[data-mobile-nav]");
  var overlay = document.querySelector("[data-mobile-nav-overlay]");
  var closeBtn = document.querySelector("[data-mobile-nav-close]");

  if (!toggle || !panel || !overlay) {
    return;
  }

  var mobileQuery = window.matchMedia("(max-width: 768px)");
  var photoshopDetailPages = [
    "design-review-coupon.html",
    "design-pet-banner.html",
    "design-car-camping.html",
    "design-peeling-gel.html",
    "design-agreable.html",
    "design-film.html",
    "design-summer-sale.html",
    "design-photoshop-list.html"
  ];
  var figmaDetailPages = ["design-figma-newsen.html"];

  function currentFile() {
    var path = window.location.pathname || "";
    var file = path.split("/").pop();
    return file || "index.html";
  }

  function setMobileNavCurrent() {
    var file = currentFile();
    var links = panel.querySelectorAll(".mobile-nav-list a[href]");

    links.forEach(function (link) {
      link.removeAttribute("aria-current");
      var href = link.getAttribute("href").replace("./", "");
      if (href === file) {
        link.setAttribute("aria-current", "page");
      }
    });

    if (photoshopDetailPages.indexOf(file) !== -1) {
      var photoshopLink = panel.querySelector('a[href="./design-photoshop.html"]');
      if (photoshopLink) {
        photoshopLink.setAttribute("aria-current", "page");
      }
    }

    if (figmaDetailPages.indexOf(file) !== -1) {
      var figmaLink = panel.querySelector('a[href="./design-figma.html"]');
      if (figmaLink) {
        figmaLink.setAttribute("aria-current", "page");
      }
    }
  }

  function clearLegacyScrollLockStyles() {
    document.body.style.top = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.documentElement.classList.remove("is-mobile-nav-open");
  }

  function focusWithoutScroll(element) {
    if (!element || typeof element.focus !== "function") {
      return;
    }
    try {
      element.focus({ preventScroll: true });
    } catch (error) {
      /* preventScroll unsupported — skip focus to avoid scroll jump */
    }
  }

  function isOpen() {
    return document.body.classList.contains("is-mobile-nav-open");
  }

  function getPanelFocusableElements() {
    return Array.prototype.filter.call(
      panel.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ),
      function (element) {
        return !element.hasAttribute("hidden");
      }
    );
  }

  function openNav() {
    if (!mobileQuery.matches) {
      return;
    }
    clearLegacyScrollLockStyles();
    document.body.classList.add("is-mobile-nav-open");
    toggle.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
    overlay.removeAttribute("hidden");
    overlay.setAttribute("aria-hidden", "false");
    /* Do not use inert — hide via CSS/aria only */
    panel.removeAttribute("inert");
    window.requestAnimationFrame(function () {
      var focusable = getPanelFocusableElements();
      focusWithoutScroll(closeBtn || focusable[0]);
    });
  }

  function closeNav(restoreFocus) {
    if (!isOpen()) {
      return;
    }
    document.body.classList.remove("is-mobile-nav-open");
    clearLegacyScrollLockStyles();
    toggle.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    overlay.setAttribute("hidden", "");
    overlay.setAttribute("aria-hidden", "true");
    panel.removeAttribute("inert");
    if (restoreFocus) {
      focusWithoutScroll(toggle);
    }
  }

  /* HTML may ship inert on panel; remove so open/close never freeze interaction */
  panel.removeAttribute("inert");
  clearLegacyScrollLockStyles();
  setMobileNavCurrent();

  toggle.addEventListener("click", function () {
    if (!mobileQuery.matches) {
      return;
    }
    if (isOpen()) {
      closeNav(true);
      return;
    }
    openNav();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      closeNav(true);
    });
  }

  overlay.addEventListener("click", function () {
    closeNav(true);
  });

  panel.querySelectorAll("a[href]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (mobileQuery.matches) {
        closeNav();
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      closeNav(true);
      return;
    }

    if (event.key === "Tab" && isOpen()) {
      var focusable = getPanelFocusableElements();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      var active = document.activeElement;

      if (!panel.contains(active)) {
        event.preventDefault();
        focusWithoutScroll(event.shiftKey ? last : first);
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        focusWithoutScroll(last);
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        focusWithoutScroll(first);
      }
    }
  });

  function onViewportChange() {
    if (!mobileQuery.matches && isOpen()) {
      closeNav();
    }
    setMobileNavCurrent();
  }

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", onViewportChange);
  } else if (typeof mobileQuery.addListener === "function") {
    mobileQuery.addListener(onViewportChange);
  }

  window.addEventListener("resize", onViewportChange, { passive: true });
}

/**
 * 이미지 확대 보기 (data-lightbox-image)
 * - 트리거가 없는 페이지에서는 조용히 종료합니다.
 */
function initImageLightbox() {
  var triggers = document.querySelectorAll("[data-lightbox-image]");

  if (triggers.length === 0) {
    return;
  }

  var dialog = document.createElement("dialog");
  dialog.className = "image-lightbox__dialog";
  dialog.setAttribute("aria-label", "이미지 확대 보기");

  var content = document.createElement("div");
  content.className = "image-lightbox__content";

  var closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "image-lightbox__close";
  closeButton.setAttribute("aria-label", "이미지 확대 닫기");
  closeButton.innerHTML = "&times;";

  var caption = document.createElement("p");
  caption.className = "image-lightbox__caption";

  var image = document.createElement("img");
  image.className = "image-lightbox__image";
  image.setAttribute("alt", "");

  content.appendChild(closeButton);
  content.appendChild(caption);
  content.appendChild(image);
  dialog.appendChild(content);
  document.body.appendChild(dialog);

  var lastFocusedElement = null;

  function resetLightboxState() {
    document.body.classList.remove("is-lightbox-open");
    image.removeAttribute("src");
    image.alt = "";

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }

    lastFocusedElement = null;
  }

  function closeLightbox() {
    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
      return;
    }

    if (dialog.hasAttribute("open")) {
      dialog.removeAttribute("open");
      resetLightboxState();
    }
  }

  function openLightbox(trigger) {
    var imageSrc = trigger.getAttribute("data-lightbox-image");
    if (!imageSrc) {
      return;
    }

    var captionText = trigger.getAttribute("data-lightbox-caption") || "";
    var imageAlt = trigger.getAttribute("data-lightbox-alt") || captionText || "확대 이미지";

    image.src = imageSrc;
    image.alt = imageAlt;
    caption.textContent = captionText;
    caption.hidden = captionText.length === 0;

    lastFocusedElement = document.activeElement;
    document.body.classList.add("is-lightbox-open");

    if (typeof dialog.showModal === "function") {
      try {
        dialog.showModal();
      } catch (error) {
        dialog.setAttribute("open", "");
      }
    } else {
      dialog.setAttribute("open", "");
    }
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openLightbox(trigger);
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      closeLightbox();
    }
  });

  dialog.addEventListener("close", resetLightboxState);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}

/**
 * Photoshop Works — 같은 페이지에서 카드형/목록형 전환
 * offcanvas · lightbox와 독립. AOS가 있으면 view 전환 후 refresh.
 */
function initPhotoshopViewToggle() {
  var root = document.querySelector("[data-photoshop-view-root]");
  if (!root) {
    return;
  }

  var buttons = root.querySelectorAll("[data-view]");
  var panels = root.querySelectorAll("[data-view-panel]");
  if (!buttons.length || !panels.length) {
    return;
  }

  function setView(view) {
    panels.forEach(function (panel) {
      var active = panel.getAttribute("data-view-panel") === view;
      if (active) {
        panel.hidden = false;
        panel.setAttribute("aria-hidden", "false");
      } else {
        panel.hidden = true;
        panel.setAttribute("aria-hidden", "true");
      }
    });

    buttons.forEach(function (button) {
      var pressed = button.getAttribute("data-view") === view;
      button.setAttribute("aria-pressed", pressed ? "true" : "false");
    });

    root.setAttribute("data-active-view", view);
    root.classList.toggle("is-list-view", view === "list");
    root.classList.toggle("is-grid-view", view === "grid");

    if (window.AOS && typeof window.AOS.refreshHard === "function") {
      window.AOS.refreshHard();
    } else if (window.AOS && typeof window.AOS.refresh === "function") {
      window.AOS.refresh();
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var view = button.getAttribute("data-view");
      if (!view) {
        return;
      }
      setView(view);
    });
  });

  setView(root.getAttribute("data-active-view") || "grid");
}
/**
 * Figma event carousel — distinct preview cards with auto-rotate
 */
function initFigmaEventCarousel() {
  var carousels = document.querySelectorAll("[data-figma-event-carousel]");
  if (!carousels.length) {
    return;
  }

  var AUTO_MS = 4000;
  var reduceMotion = prefersReducedMotion();

  carousels.forEach(function (carousel) {
    var slides = carousel.querySelectorAll("[data-figma-carousel-slide]");
    var prevBtn = carousel.querySelector("[data-figma-carousel-prev]");
    var nextBtn = carousel.querySelector("[data-figma-carousel-next]");
    var counter = carousel.querySelector("[data-figma-carousel-counter]");
    var dotsRoot = carousel.querySelector("[data-figma-carousel-dots]");

    if (!slides.length) {
      return;
    }

    var total = slides.length;
    var index = 0;
    var dots = [];
    var timerId = null;
    var paused = false;

    function setSlide(nextIndex) {
      index = ((nextIndex % total) + total) % total;

      slides.forEach(function (slide, i) {
        var active = i === index;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
        if (active) {
          slide.removeAttribute("hidden");
        } else {
          slide.setAttribute("hidden", "");
        }
      });

      if (counter) {
        counter.textContent = index + 1 + " / " + total;
      }

      dots.forEach(function (dot, i) {
        var selected = i === index;
        dot.classList.toggle("is-active", selected);
        dot.setAttribute("aria-selected", selected ? "true" : "false");
        dot.tabIndex = selected ? 0 : -1;
      });
    }

    function stopAuto() {
      if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    function startAuto() {
      stopAuto();
      if (reduceMotion || paused || document.hidden) {
        return;
      }
      timerId = window.setInterval(function () {
        setSlide(index + 1);
      }, AUTO_MS);
    }

    function pauseAuto() {
      paused = true;
      stopAuto();
    }

    function resumeAuto() {
      paused = false;
      startAuto();
    }

    function goTo(nextIndex) {
      setSlide(nextIndex);
      if (!reduceMotion && !paused && !document.hidden) {
        startAuto();
      }
    }

    if (dotsRoot) {
      slides.forEach(function (_slide, i) {
        var labels = ["Hero", "Device Guide", "FAQ and Info"];
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "figma-event-carousel__dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", labels[i] || i + 1 + "번째 카드");
        dot.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          goTo(i);
        });
        dotsRoot.appendChild(dot);
        dots.push(dot);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        goTo(index - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        goTo(index + 1);
      });
    }

    carousel.addEventListener("mouseenter", pauseAuto);
    carousel.addEventListener("mouseleave", resumeAuto);
    carousel.addEventListener("focusin", pauseAuto);
    carousel.addEventListener("focusout", function (event) {
      if (!carousel.contains(event.relatedTarget)) {
        resumeAuto();
      }
    });

    carousel.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      }
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopAuto();
      } else if (!paused && !reduceMotion) {
        startAuto();
      }
    });

    setSlide(0);
    startAuto();
  });
}
