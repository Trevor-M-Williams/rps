import barba, { type ITransitionData } from '@barba/core';
import p5 from 'p5';
import { gsap } from 'gsap';
import { initAnimations } from '$utils/animations';
import { initTornado } from 'src/concepts/tornado';
import { restartWebflow } from '@finsweet/ts-utils';

let sketch: p5 | null;

const NUM_SLIDES = 4;
const DURATION = 1;
const DELAY = 0.1;
const HUE = 200;

const slides: HTMLElement[] = [];

for (let i = 0; i <= NUM_SLIDES; i++) {
  const div = document.createElement('div');
  div.classList.add('slide');
  div.style.backgroundColor = `hsl(${HUE}, 25%, ${40 - (i * 20) / NUM_SLIDES}%)`;
  slides.push(div);
  document.body.appendChild(div);
}

export function initBarba() {
  document.body.setAttribute('data-barba', 'wrapper');

  barba.init({
    cacheIgnore: true,
    prefetchIgnore: true,
    transitions: [
      {
        name: 'slide-transition',
        once: async () => {
          await restartWebflow();
        },
        leave: async (data: ITransitionData) => {
          await handleLeave(data);
        },
        enter: async (data: ITransitionData) => {
          await handleEnter(data);
        },
      },
    ],
  });

  barba.hooks.beforeEnter(async () => {
    await initAnimations();
    if (location.pathname === '/concepts/future') initFuture();
    else if (location.pathname === '/concepts/tornado') initTornado();
  });

  barba.hooks.after(async () => {
    await restartWebflow();
  });
}

const handleLeave = async (data: ITransitionData) => {
  gsap.set([slides], { left: '0%', width: '0%' });

  const animations = slides.map((slide, index) => {
    return gsap.to(slide, {
      width: '100%',
      duration: DURATION,
      ease: 'power2.inOut',
      delay: index * DELAY,
    });
  });

  await Promise.all(animations);

  gsap.to(data.current.container, { position: 'fixed', opacity: 0, duration: 0 });

  await restartWebflow();

  if (data.current.url.path === '/concepts/future' && sketch) {
    sketch.remove();
    sketch = null;
  }
};

const handleEnter = async (data: ITransitionData) => {
  gsap.set(data.next.container, { opacity: 1 });

  window.scrollTo(0, 0);

  gsap.set(slides, {
    right: '0%',
    left: 'auto',
    width: '100%',
  });

  const animations = slides.map((slide) => {
    return gsap.to(slide, {
      width: '0%',
      duration: DURATION,
      ease: 'power2.inOut',
    });
  });

  await Promise.all(animations);

  await restartWebflow();
};

export function initFuture() {
  sketch = new p5((p: p5) => {
    let t = 0;
    const r = 0;
    const g = 42;
    const b = 95;

    const particleSize = 4;
    const pathRadius = 50;
    const gridIncrement = 30;
    const timeIncrement = 0.002;

    const initialShift = 1;
    const backgroundOpacity = 100;

    p.setup = () => {
      let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas.parent('future-hero');
      p.noStroke();
      p.background(r, g, b);
      p.fill(255, 255, 255, 25);
    };

    p.draw = () => {
      p.background(r, g, b, backgroundOpacity);

      const yShift = 5 * p.sin((p.PI * t) / 5 + initialShift);
      const xShift = 4;

      for (let x = -50; x <= p.width + 50; x = x + gridIncrement) {
        for (let y = -50; y <= p.height + 50; y = y + gridIncrement) {
          const angle = xShift * (x / p.width) + yShift * (y / p.height);

          const myX = x + pathRadius * p.cos(2 * p.PI * t + angle);
          const myY = y + pathRadius * p.sin(2 * p.PI * t + angle * 1.5);

          p.ellipse(myX, myY, particleSize);
        }
      }

      t = t + timeIncrement;
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  });
}
