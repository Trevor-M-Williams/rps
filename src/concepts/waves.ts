import * as THREE from 'three';

export function initWavesDark() {
  const canvas = document.querySelector('.threejs-container');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 50);
  camera.position.set(0, 1, 2);

  const planeGeometry = new THREE.PlaneGeometry(32, 32, 800, 800);

  const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      resolution: {
        value: {
          x: window.innerWidth * window.devicePixelRatio,
          y: window.innerHeight * window.devicePixelRatio,
        },
      },
      pointSize: { value: 8.0 },
      noiseAmp1: { value: 0.9 },
      noiseFreq1: { value: 0.3 },
      spdModifier1: { value: 0.3 },
      noiseAmp2: { value: 0.9 },
      noiseFreq2: { value: 0.3 },
      spdModifier2: { value: 0.2 },
    },
    vertexShader: `
    #define PI 3.14159265359

    uniform float time;
    uniform float pointSize;
    uniform float noiseAmp1;
    uniform float noiseFreq1;
    uniform float spdModifier1;
    uniform float noiseAmp2;
    uniform float noiseFreq2;
    uniform float spdModifier2;

    // 2D Random
    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // 2D Noise
    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        // Cubic Hermine Curve
        vec2 u = f*f*(3.0-2.0*f);

        // Mix 4 corners percentages
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    mat2 rotate2d(float angle){
        return mat2(cos(angle),-sin(angle), sin(angle), cos(angle));
    }

    void main() {
      vec3 pos = position;

      // Apply noise to position.z based on your existing noise calculations
      pos.z += noise(pos.xy * noiseFreq1 + time * spdModifier1) * noiseAmp1;
      pos.z += noise(rotate2d(PI / 4.) * pos.yx * noiseFreq2 - time * spdModifier2 * 0.6) * noiseAmp2;

      vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);

      float scaleFactor = 4.0;
      float perspectiveFactor = scaleFactor / (-modelViewPosition.z * 2.0);
      gl_PointSize = pointSize * perspectiveFactor;

      gl_Position = projectionMatrix * modelViewPosition;

    }
    `,
    fragmentShader: `
    void main() {
      float distance = length(gl_PointCoord - vec2(0.5, 0.5));
      if (distance > 0.5) {
        discard; // Discard pixels outside the circle radius
      }
      gl_FragColor = vec4(0, .2, .6, 0.1);
    }
    `,
    transparent: true,
  });

  // Points mesh
  const points = new THREE.Points(planeGeometry, planeMaterial);
  points.rotation.x = -3.1415 / 2.5;
  scene.add(points);

  function animate() {
    requestAnimationFrame(animate);

    planeMaterial.uniforms.time.value = performance.now() * 0.001;

    renderer.render(scene, camera);

    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
  }

  function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  animate();
}

export function initWavesLight() {
  const canvas = document.querySelector('.threejs-container');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 50);
  camera.position.set(0, 1, 2);

  const planeGeometry = new THREE.PlaneGeometry(32, 32, 800, 800);

  const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      resolution: {
        value: {
          x: window.innerWidth * window.devicePixelRatio,
          y: window.innerHeight * window.devicePixelRatio,
        },
      },
      pointSize: { value: 8.0 },
      noiseAmp1: { value: 0.9 },
      noiseFreq1: { value: 0.3 },
      spdModifier1: { value: 0.3 },
      noiseAmp2: { value: 0.9 },
      noiseFreq2: { value: 0.3 },
      spdModifier2: { value: 0.2 },
    },
    vertexShader: `
    #define PI 3.14159265359

    uniform float time;
    uniform float pointSize;
    uniform float noiseAmp1;
    uniform float noiseFreq1;
    uniform float spdModifier1;
    uniform float noiseAmp2;
    uniform float noiseFreq2;
    uniform float spdModifier2;

    // 2D Random
    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // 2D Noise
    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        // Cubic Hermine Curve
        vec2 u = f*f*(3.0-2.0*f);

        // Mix 4 corners percentages
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    mat2 rotate2d(float angle){
        return mat2(cos(angle),-sin(angle), sin(angle), cos(angle));
    }

    void main() {
      vec3 pos = position;

      // Apply noise to position.z based on your existing noise calculations
      pos.z += noise(pos.xy * noiseFreq1 + time * spdModifier1) * noiseAmp1;
      pos.z += noise(rotate2d(PI / 4.) * pos.yx * noiseFreq2 - time * spdModifier2 * 0.6) * noiseAmp2;

      vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);

      float scaleFactor = 4.0;
      float perspectiveFactor = scaleFactor / (-modelViewPosition.z * 2.0);
      gl_PointSize = pointSize * perspectiveFactor;

      gl_Position = projectionMatrix * modelViewPosition;

    }
    `,
    fragmentShader: `
    void main() {
      float distance = length(gl_PointCoord - vec2(0.5, 0.5));
      if (distance > 0.5) {
        discard; // Discard pixels outside the circle radius
      }
      gl_FragColor = vec4(1, 1, 1, 0.02);
    }
    `,
    transparent: true,
  });

  // Points mesh
  const points = new THREE.Points(planeGeometry, planeMaterial);
  points.rotation.x = -3.1415 / 2;
  scene.add(points);

  function animate() {
    requestAnimationFrame(animate);

    planeMaterial.uniforms.time.value = performance.now() * 0.001;

    renderer.render(scene, camera);

    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
  }

  function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  animate();
}
