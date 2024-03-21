import './css/globals.css';

import { initWavesLight } from 'src/waves';

window.Webflow ||= [];
window.Webflow.push(() => {
  if (location.hostname === 'localhost' || location.hostname.includes('webflow.io')) {
    console.log('Development mode.');
  }

  main();
});

async function main() {
  initWavesLight();
}
