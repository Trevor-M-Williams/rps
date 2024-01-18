import './globals.css';
import { initBarba } from '$utils/barba';
import { initAnimations } from '$utils/animations';
import { scaleBackgroundImage } from '$utils/background-image';

window.Webflow ||= [];
window.Webflow.push(() => {
  if (location.hostname === 'localhost' || location.hostname.includes('webflow.io')) {
    console.log('Development mode.');
  }

  main();
});

async function main() {
  window.addEventListener('load', initBarba);
  window.addEventListener('load', initAnimations);
  window.addEventListener('load', scaleBackgroundImage);
  window.addEventListener('resize', scaleBackgroundImage);

  window.addEventListener('load', () => {
    const imageElements = document.querySelectorAll(
      '.animation-image'
    ) as NodeListOf<HTMLImageElement>;
    imageElements.forEach((imageElement) => {
      imageElement.removeAttribute('srcset');
      imageElement.removeAttribute('sizes');
    });
  });
}
