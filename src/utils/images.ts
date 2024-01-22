export function fixImageQuality() {
  // TODO: get elements by attribute
  const imageElements = document.querySelectorAll(
    '.animation-image'
  ) as NodeListOf<HTMLImageElement>;
  imageElements.forEach((imageElement) => {
    imageElement.removeAttribute('srcset');
    imageElement.removeAttribute('sizes');
  });
}
