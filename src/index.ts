import './css/globals.css';
import './css/concepts.css';

import { initAnimations } from '$utils/animations';
import { initBarba } from '$utils/barba';
import { initFuture } from '$utils/barba';
import { initTornado } from 'src/concepts/tornado';
import { fixImageQuality } from '$utils/images';

window.Webflow ||= [];
window.Webflow.push(() => {
  if (location.hostname === 'localhost' || location.hostname.includes('webflow.io')) {
    console.log('Development mode.');
  }

  main();
});

async function main() {
  initBarba();
  initAnimations();
  fixImageQuality();

  switch (location.pathname) {
    case '/concepts/future':
      initFuture();
      break;
    case '/concepts/tornado':
      initTornado();
      break;
    default:
      break;
  }
}
