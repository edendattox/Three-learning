import "./style/main.css";
import * as THREE from "three";
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

  /*
   * scene
   */
  const scene = new THREE.Scene();

  /*
   * objects
   */

  const object1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: "#ff0000" })
  );
  object1.position.set(-2, 0, 0);

  const object2 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: "#ff0000" })
  );
  const object3 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: "#ff0000" })
  );
  object3.position.set(2, 0, 0);

  scene.add(object1, object2, object3);

  /*
   * Raycaster
   */

  const raycaster = new THREE.Raycaster();

  const rayOrigin = new THREE.Vector3(-3, 0, 0);
  const rayDirection = new THREE.Vector3(10, 0, 0);
  rayDirection.normalize();

  // raycaster.set(rayOrigin, rayDirection);

  // const intersect = raycaster.intersectObject(object2);
  // console.log(intersect);

  // const intersects = raycaster.intersectObjects([object1, object2, object3]);
  // console.log(intersects);

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

  window.addEventListener("click", () => {
    if (currentIntersects) {
      console.log("click");
    }
  });
  /*
   *  Mouse
   */

  const mouse = new THREE.Vector2();
  window.addEventListener("mousemove", () => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientX / sizes.width) * 2 + 1;
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

  let currentIntersects = null;

  //   Animations
  const tick = () => {
    /*
     ** Clock
     */
    const elapsedTime = clock.getElapsedTime();

    /*
     * update object
     */

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

    // cast a ray
    raycaster.setFromCamera(mouse, camera);

    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(1, 0, 0);

    // rayDirection.normalize();
    // raycaster.set(rayOrigin, rayDirection);

    const objectsToText = [object1, object2, object3];
    const intersects = raycaster.intersectObjects(objectsToText);

    for (const object of objectsToText) {
      object.material.color.set("#ff0000");
    }

    for (const intersect of intersects) {
      intersect.object.material.color.set("#0000ff");
    }

    if (intersects.length) {
      if (currentIntersects === null) {
        console.log("mouse enter");
      }
      currentIntersects = intersects[0];
    } else {
      if (currentIntersects) {
        console.log("mouse leave");
      }
      currentIntersects = null;
    }

    // console.log(intersects.length);

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
