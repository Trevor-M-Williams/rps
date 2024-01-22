import '../css/globals.css';

import barba, { type ITransitionData } from '@barba/core';
import { restartWebflow } from '@finsweet/ts-utils';
import { gsap } from 'gsap';
import { initAnimations } from '$utils/animations';
import { initFuture } from '../concepts/future';
import { initTornado } from '../concepts/tornado';

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

  // barba.prefetch('/concepts/future');

  barba.hooks.beforeEnter(async () => {
    console.log('before enter');

    await initAnimations();
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
};

const handleEnter = async (data: ITransitionData) => {
  console.log('enter');
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
