import p5 from 'p5';

export function initFuture() {
  const parent = document.getElementById('p5-container');
  if (!(parent instanceof HTMLElement)) return;
  parent.innerHTML = '';

  new p5((p: p5) => {
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
      console.log('init: ', p.windowWidth, p.windowHeight);
      canvas.parent('p5-container');
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
      console.log(p.windowWidth, p.windowHeight);
    };
  });
}
