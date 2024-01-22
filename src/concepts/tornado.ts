export function initTornado() {
  const tornado = document.querySelector('.tornado');
  if (!(tornado instanceof HTMLElement)) return;

  const numRects = 40;
  const delay = 0.1;
  const period = 2;

  for (let i = 0; i < numRects; i++) {
    const rect = document.createElement('div');
    rect.classList.add('rectangle');
    tornado.appendChild(rect);

    const spacing = tornado.offsetHeight / numRects;
    const rectWidth = map(i, 0, numRects - 1, 60, 40);

    rect.style.width = `${rectWidth}vw`;
    rect.style.top = `${i * spacing}px`;
    rect.style.animation = `wave ${period}s ease-in-out infinite alternate ${-i * delay}s`;
  }

  function map(value: number, start1: number, stop1: number, start2: number, stop2: number) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }
}
