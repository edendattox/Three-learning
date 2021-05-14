import "./style/main.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

function init() {
  const gui = new dat.GUI({ closed: true });

  gui.hide();

  const parameters = {
    color: 0xff0000,
    spin: () => {
      gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
    },
  };

  /*
   * Canvas
   */
  const canvas = document.querySelector(".webgl");

  /*
   * Texture
   */

  const textureLoader = new THREE.TextureLoader();
  const start = textureLoader.load(
    "/particles/PNG (Black background)/star_01.png"
  );

  /*
   * scene
   */
  const scene = new THREE.Scene();

  /*
   * Particles
   */

  // Geometery

  const particlesGeometry = new THREE.BufferGeometry();
  const count = 5000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // Material

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.3,
    sizeAttenuation: true,
    map: start,
    // color: "red",
  });
  particlesMaterial.transparent = true;
  particlesMaterial.alphaMap = start;
  // particlesMaterial.alphaTest = 0.001;
  // particlesMaterial.depthTest = false;
  particlesMaterial.depthWrite = true;
  particlesMaterial.blending = THREE.AdditiveBlending;
  particlesMaterial.vertexColors = true;

  // Points

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);

  scene.add(particles);

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  window.addEventListener("resize", () => {
    /*
     * Save sizes
     */
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    /*
     * Update camera
     */
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    /*
     * Update renderer
     */
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.001,
    100
  );

  camera.position.set(0, 0, 3);
  scene.add(camera);

  /**
   *  Controls
   */
  const controls = new OrbitControls(camera, canvas);

  /*
   *  Adding Damping
   */
  controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);

  // Clock
  const clock = new THREE.Clock();

  //   Animations
  const tick = () => {
    /*
     ** Clock
     */
    const elapsedTime = clock.getElapsedTime();

    /*
     * Particles
     */

    // particles.rotation.set(elapsedTime / 2, elapsedTime / 2, 0);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const x = particlesGeometry.attributes.position.array[i3];
      particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
        elapsedTime + x
      );
    }

    particlesGeometry.attributes.position.needsUpdate = true;

    /*
     * Update Controls
     */
    controls.update();

    /*
     * Render
     */
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();
}

init();

// https://www.kenney.nl/assets/particle-pack
