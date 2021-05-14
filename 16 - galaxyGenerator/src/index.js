import "./style/main.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

function init() {
  /*
   * Debug
   */
  const gui = new dat.GUI();

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
   * Galaxy
   */

  const parameters = {};
  parameters.count = 100000;
  parameters.size = 0.01;
  parameters.radius = 5;
  parameters.branches = 6;
  parameters.spin = 1;
  parameters.randomness = 0.2;
  parameters.randomnessPower = 4.2;
  parameters.insideColor = "#ff6030";
  parameters.outsideColor = "#1b3984";

  let geometry = null;
  let material = null;
  let points = null;

  const generate = () => {
    /*
     * Geometery
     */
    if (points !== null) {
      geometry.dispose();
      material.dispose();
      scene.remove(points);
    }

    geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;

      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle =
        ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomY =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomZ =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);

      positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);

      colors[i3 + 0] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    /*
     * Material
     */

    material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    /*
     * Points
     */
    points = new THREE.Points(geometry, material);
    scene.add(points);
  };

  generate();

  gui
    .add(parameters, "count")
    .min(100)
    .max(100000)
    .step(100)
    .onFinishChange(generate);
  gui
    .add(parameters, "size")
    .min(0.001)
    .max(0.1)
    .step(0.001)
    .onFinishChange(generate);
  gui.add(parameters, "radius").min(1).max(20).step(1).onFinishChange(generate);
  gui
    .add(parameters, "branches")
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(generate);
  gui
    .add(parameters, "spin")
    .min(-5)
    .max(5)
    .step(0.001)
    .onFinishChange(generate);
  gui
    .add(parameters, "randomness")
    .min(0)
    .max(2)
    .step(0.001)
    .onFinishChange(generate);
  gui
    .add(parameters, "randomnessPower")
    .min(1)
    .max(10)
    .step(0.001)
    .onFinishChange(generate);
  gui.addColor(parameters, "insideColor").onFinishChange(generate);
  gui.addColor(parameters, "outsideColor").onFinishChange(generate);

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

  camera.position.set(0, 10, 10);
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

    points.rotation.set(0, -elapsedTime / 2, 0);

    // particles.rotation.set(elapsedTime / 2, elapsedTime / 2, 0);

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
