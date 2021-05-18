import "./style/main.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertex from "./shaders/test/vertex.glsl";
import fragment from "./shaders/test/fragment.glsl";

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
  const flagTexture = textureLoader.load("/Texture/flag.jpg");

  /*
   * scene
   */
  const scene = new THREE.Scene();

  scene.background = new THREE.Color("black");

  /*
   *  Objects
   */

  const plane = new THREE.PlaneBufferGeometry(3, 3, 40, 40);

  const count = plane.attributes.position.count;
  const randoms = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    randoms[i] = Math.random();
  }

  plane.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uFrequency: {
        value: new THREE.Vector2(10, 5),
      },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("orange") },
      uTexture: { value: flagTexture },
    },
    // wireframe: true,
    // transparent: true,
  });

  gui
    .add(material.uniforms.uFrequency.value, "x")
    .min(0)
    .max(20)
    .step(0.01)
    .name("frequencyX");
  gui
    .add(material.uniforms.uFrequency.value, "y")
    .min(0)
    .max(20)
    .step(0.01)
    .name("frequencyY");

  const mesh = new THREE.Mesh(plane, material);

  mesh.scale.y = 2 / 3;

  scene.add(mesh);

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

  /*
   * renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);

  /*
   *  Clock
   */
  const clock = new THREE.Clock();

  /*
   *  Animations
   */
  const tick = () => {
    /*
     ** Clock
     */
    const elapsedTime = clock.getElapsedTime();

    // update Materials
    material.uniforms.uTime.value = elapsedTime;

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
