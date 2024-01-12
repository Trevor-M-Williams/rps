import './globals.css';

type AnimatedElement = HTMLElement & {
  animationTimeouts: number[];
};

window.Webflow ||= [];
window.Webflow.push(() => {
  if (location.hostname === 'localhost' || location.hostname.includes('webflow.io')) {
    console.log('Development mode.');
  }

  main();
});

function main() {
  window.addEventListener('load', scaleBackgroundImage);
  window.addEventListener('resize', scaleBackgroundImage);

  window.addEventListener('load', initTextAnimation);
}

function scaleBackgroundImage() {
  const container = document.querySelector('.bg-image-container');
  if (!(container instanceof HTMLElement)) return;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const viewportAR = viewportWidth / viewportHeight;
  const imageAR = 16 / 9; // Aspect Ratio of the image

  let scale;

  if (viewportAR > imageAR) {
    // If viewport is wider than image aspect ratio
    scale = viewportWidth / (viewportHeight * imageAR);
  } else {
    // If viewport is taller
    scale = viewportHeight / (viewportWidth / imageAR);
  }

  container.style.transform = `scale(${scale})`;
}

function initTextAnimation() {
  const elements = document.querySelectorAll('[text-animation]') as NodeListOf<AnimatedElement>;

  elements.forEach((element) => {
    const words = element.innerText.split(' ');

    element.innerHTML = words
      .map((word) => {
        // Wrapping each word in a span, and each letter of the word in another span
        const letters = word
          .split('')
          .map((letter) => `<span class="letter">${letter}</span>`)
          .join('');
        return `<span class="word">${letters}</span>`;
      })
      .join(' ');

    // Store timeouts for each element
    element.animationTimeouts = [];
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        const element = entry.target as AnimatedElement;
        const letters = element.querySelectorAll('.letter');

        let animationSpeed = parseInt(element.getAttribute('text-animation') as string) || 4;
        animationSpeed = Math.max(1, Math.min(10, animationSpeed));
        let delay = 200 / animationSpeed ** 2;

        // Clear any existing timeouts when scrolling in or out of view
        element.animationTimeouts.forEach(clearTimeout);
        element.animationTimeouts = [];

        if (entry.isIntersecting) {
          letters.forEach((letter, index) => {
            const timeout = setTimeout(() => {
              letter.classList.add('animate');
            }, delay * index);

            element.animationTimeouts.push(timeout);
          });
        } else {
          letters.forEach((letter) => {
            letter.classList.remove('animate');
          });
        }
      });
    },
    { threshold: [0.1] }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}
