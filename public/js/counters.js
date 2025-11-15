const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animateCounts = (elements) => {
  const duration = prefersReducedMotion ? 0 : 1800;

  elements.forEach((counter) => {
    const target = Number(counter.getAttribute('data-count-target'));
    if (Number.isNaN(target)) return;

    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = duration === 0 ? 1 : Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(progress * target);
      counter.textContent = currentValue.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  });
};

export const initCounters = () => {
  const counters = document.querySelectorAll('[data-count-target]');
  if (!counters.length) return;

  window.addEventListener(
    'load',
    () => {
      animateCounts(counters);
    },
    { once: true }
  );
};
