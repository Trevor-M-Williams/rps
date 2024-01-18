export function scaleBackgroundImage() {
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
