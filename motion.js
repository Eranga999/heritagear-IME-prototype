(() => {
  const navigation = performance.getEntriesByType("navigation")[0];
  if (navigation?.type === "reload") {
    history.scrollRestoration = "manual";
    window.addEventListener(
      "pageshow",
      () => {
        const scrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, 0);
        history.scrollRestoration = "auto";
        document.documentElement.style.scrollBehavior = scrollBehavior;
      },
      { once: true }
    );
  }

  const isHomePage = /\/(?:index\.html)?$/.test(window.location.pathname);
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (isHomePage && !prefersReducedMotion) {
    const launchScreen = document.createElement("div");
    launchScreen.className = "launch-screen";
    launchScreen.setAttribute("aria-hidden", "true");
    launchScreen.innerHTML = `
      <div class="launch-mark">
        <img src="images/heritagear-logo-icon.png" alt="">
        <span class="launch-orbit"></span>
      </div>
      <p class="launch-title">HeritageAR</p>
      <span class="launch-caption">Heritage, brought closer.</span>
    `;
    document.body.prepend(launchScreen);
    document.body.classList.add("launch-active");

    window.setTimeout(() => {
      launchScreen.classList.add("is-leaving");
      document.body.classList.remove("launch-active");
      window.setTimeout(() => launchScreen.remove(), 500);
    }, 1500);
  }

  if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  const targets = document.querySelectorAll(
    "main > section > .container-site, main > section > .border-t > .container-site, main article, main details.faq, footer"
  );
  const siblingIndexes = new Map();
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
  );

  targets.forEach((target) => {
    const parent = target.parentElement;
    const index = siblingIndexes.get(parent) ?? 0;
    siblingIndexes.set(parent, index + 1);
    target.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 80}ms`);
    target.classList.add("scroll-reveal");
    observer.observe(target);
  });
})();
