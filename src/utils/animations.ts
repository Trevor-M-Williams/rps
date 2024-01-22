type AnimatedElement = HTMLElement & {
  animationTimeouts: number[];
};

export async function initAnimations() {
  initDefaultAnimations();
  initSideNavAnimation();
  initSVGAnimation();
  init310Animation();
}

function initDefaultAnimations() {
  const elements = document.querySelectorAll('[animation]') as NodeListOf<AnimatedElement>;

  elements.forEach((element) => {
    element.style.opacity = '0';
    const value = element.getAttribute('animation') as string;

    switch (value) {
      case 'fade-in':
        handleFadeIn(element);
        break;
      case 'slide-left':
        handleSlide(element, 'left');
        break;
      case 'slide-right':
        handleSlide(element, 'right');
        break;
      case 'slide-down':
        handleSlide(element, 'down');
        break;
      case 'slide-up':
        handleSlide(element, 'up');
        break;
      case 'image-reveal-left':
        handleImageReveal(element, 'left');
        break;
      case 'image-reveal-right':
        handleImageReveal(element, 'right');
        break;
      case 'image-reveal-down':
        handleImageReveal(element, 'down');
        break;
      case 'image-reveal-up':
        handleImageReveal(element, 'up');
        break;
      case 'text-reveal':
        handleTextReveal(element);
        break;
      default:
        break;
    }
  });
}

function initSideNavAnimation() {
  const containers = document.querySelectorAll('[side-nav-container]');
  const dotsContainer = document.querySelector('.side-nav-dots');
  if (!containers || !dotsContainer) return;

  dotsContainer.innerHTML = '';

  containers.forEach((container) => {
    const dot = document.createElement('div');
    dot.classList.add('side-nav-dot');
    dotsContainer.appendChild(dot);

    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }, options);

    observer.observe(container);
  });
}

function initSVGAnimation() {
  const svg = document.querySelector('.c-about__fact--1__graph');
  if (!(svg instanceof SVGElement)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        document.querySelectorAll('.c--about__fact--1__graph__path').forEach((path) => {
          if (!(path instanceof SVGPathElement)) return;

          path.classList.remove('animate-forward', 'animate-reverse');

          if (entry.isIntersecting) {
            path.classList.add('animate-forward');
          } else {
            path.classList.add('animate-reverse');
          }
        });
      });
    },
    { threshold: [0.3] }
  );

  observer.observe(svg);
}

function init310Animation() {
  const overlay = document.querySelector('.dash-overlay');
  const label = document.querySelector('.dash-label');
  if (!overlay || !label) return;

  overlay.classList.remove('animate');
  label.classList.remove('animate');

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          overlay.classList.add('animate');
          label.classList.add('animate');
        } else {
          overlay.classList.remove('animate');
          label.classList.remove('animate');
        }
      });
    },
    { threshold: [0.1] }
  );

  observer.observe(overlay);
}

function handleFadeIn(element: AnimatedElement) {
  const delay = parseInt(element.getAttribute('delay') as string) || 0;
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          element.style.animationDelay = `${delay}ms`;
          element.classList.add('fade-in');
        } else {
          element.style.animationDelay = `0ms`;
          element.classList.remove('fade-in');
        }
      });
    },
    { threshold: [0.1] }
  );

  observer.observe(element);
}

function handleSlide(element: AnimatedElement, direction: 'left' | 'right' | 'up' | 'down') {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  element.style.display = 'inline-block';
  element.parentNode?.insertBefore(wrapper, element);
  wrapper.appendChild(element);

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          element.classList.add(`slide-${direction}`);
        } else {
          element.classList.remove(`slide-${direction}`);
          element.style.opacity = '0';
        }
      });
    },
    { threshold: [0.3] }
  );

  observer.observe(wrapper);
}

function handleImageReveal(image: AnimatedElement, direction: 'left' | 'right' | 'up' | 'down') {
  const wrapper = document.createElement('div');
  wrapper.classList.add('image-wrapper');
  image.style.display = 'inline-block';
  image.parentNode?.insertBefore(wrapper, image);
  wrapper.appendChild(image);

  const overlay = document.createElement('div');
  overlay.classList.add('image-overlay');
  wrapper.appendChild(overlay);

  // get bg color from neareast parent with bg color
  let parent = image.parentNode;
  while (parent) {
    if (!(parent instanceof HTMLElement)) break;
    const bgColor = window.getComputedStyle(parent).backgroundColor;
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
      overlay.style.backgroundColor = bgColor;
      break;
    }
    parent = parent.parentNode;
  }

  let lastScroll = window.scrollY;
  let currentScrollDirection = 'down';

  window.addEventListener('scroll', function () {
    const currentScroll = window.scrollY;
    currentScrollDirection = currentScroll > lastScroll ? 'down' : 'up';
    lastScroll = currentScroll;
  });

  const options = {
    root: null,
    threshold: 0.01,
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        image.style.opacity = '1';
        if (currentScrollDirection === 'down') {
          if (direction === 'up') {
            overlay.classList.add(`reveal-down`);
          } else {
            overlay.classList.add(`reveal-${direction}`);
          }
        } else {
          if (direction === 'down') {
            overlay.classList.add(`reveal-up`);
          } else {
            overlay.classList.add(`reveal-${direction}`);
          }
        }
      } else {
        image.style.opacity = '0';
        overlay.classList.remove(`reveal-${direction}`);
        overlay.classList.remove(`reveal-up`);
        overlay.classList.remove(`reveal-down`);
      }
    });
  }, options);

  observer.observe(image);
}

function handleTextReveal(element: AnimatedElement) {
  const lines = element.innerText.split('\n');

  element.innerHTML = lines
    .map((line) => {
      const words = line.split(' ');

      return words
        .map((word) => {
          const letters = word
            .split('')
            .map((letter) => `<span class="letter">${letter}</span>`)
            .join('');
          return `<span class="word">${letters}</span>`;
        })
        .join(' ');
    })
    .join('<br>');

  element.animationTimeouts = [];

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        const element = entry.target as AnimatedElement;
        const letters = element.querySelectorAll('.letter');
        const numLetters = letters.length;
        const delay = 750 / numLetters;

        element.animationTimeouts.forEach(clearTimeout);
        element.animationTimeouts = [];

        if (entry.isIntersecting) {
          element.style.opacity = '1';
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

  observer.observe(element);
}
