import './css/globals.css';
import './css/concepts.css';

import { initAnimations } from '$utils/animations';
import { initBarba } from '$utils/barba';
import { initTornado } from 'src/concepts/tornado';
import { initWavesDark, initWavesLight } from 'src/concepts/waves';
import { fixImageQuality } from '$utils/images';

window.Webflow ||= [];
window.Webflow.push(() => {
  if (location.hostname === 'localhost' || location.hostname.includes('webflow.io')) {
    console.log('Development mode.');
  }

  main();
});

async function main() {
  if (location.pathname.includes('home-v3')) initWavesDark();
  if (location.pathname.includes('home-v4')) initWavesLight();
}
