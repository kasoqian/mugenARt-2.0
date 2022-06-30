const prevent = (e: Event) => e.preventDefault();

export function fixBody() {
  document.addEventListener('touchmove', prevent, {
    capture: true,
    passive: false,
  });
}

export function unFixBody() {
  document.removeEventListener('touchmove', prevent, {
    capture: true,
  });
}
