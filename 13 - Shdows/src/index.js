import "./style/main.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { MaterialLoader } from "three";

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
   * scene
   */
  const scene = new THREE.Scene();

  scene.background = new THREE.Color("black");

  /*
   *  Lights
   */

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
  directionalLight.position.set(2, 2, -1);

  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 6;
  // directionalLight.shadow.radius = 10;

  const directionalLightCameraHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera
  );
  directionalLightCameraHelper.visible = false;

  scene.add(directionalLightCameraHelper);

  // Spot Light

  const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.set(1024, 1024);

  spotLight.position.set(0, 2, 2);
  scene.add(spotLight);
  scene.add(spotLight.target);

  const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
  scene.add(spotLightCameraHelper);
  // different types of algorithms can be applied to shadow maps

  //  1. THREE.BasicShadowMap - very performant but lousy quality of
  //  2. THREE.PCFShadowMap - Less performant but smoother edges (default)
  //  3. THREE.PCFSoftShadowMap - Less performant but even softer edges
  //  4. THREE.VSMShadowMap - Less performant, more constraints, can have unexpected results

  /*
   * Lights that can receive Shadows

    PointLight
    DirectionalLight
    SpotLight
  */

  /*
   * gui controls
   */

  gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
  gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
  gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
  gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);

  scene.add(ambientLight, directionalLight);

  /*
   *  Objects
   */

  const material = new THREE.MeshStandardMaterial();
  material.roughness = 0.4;
  gui.add(material, "roughness").min(0).max(1).step(0.001);
  gui.add(material, "metalness").min(0).max(1).step(0.001);

  // Objects

  const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    material
  );
  sphere.castShadow = true;

  const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material);
  plane.receiveShadow = true;

  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = -0.7;

  scene.add(sphere, plane);

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
     * Update renderer
     */
    renderer.setSize(sizes.width, sizes.height);
  });

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.001,
    100
  );

  camera.position.set(0, 0, 3);
  camera.lookAt(sphere.position);
  scene.add(camera);

  /**
   *  Controls
   */
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /*
   * renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

    // update objects

    sphere.rotation.set(elapsedTime / 2, elapsedTime / 2, 0);

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
