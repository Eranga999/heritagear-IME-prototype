(() => {
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
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
