import "./style/main.css";
import * as THREE from "three";

// import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function init() {
  //   console.log(OrbitControls);

  /*
   * Canvas
   */
  const canvas = document.querySelector(".webgl");

  /*
   * Cursor
   */
  const cursor = {
    x: 0,
    y: 0,
  };

  // window.addEventListener("mousemove", (event) => {
  //   cursor.x = event.clientX / sizes.width - 0.5;
  //   cursor.y = event.clientY / sizes.height - 0.5;
  //   // console.log(cursor.x, cursor.y);
  // });

  /*
   * scene
   */
  const scene = new THREE.Scene();

  /*
   *  Object
   */

  // const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);

  // const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2);

  const geometry = new THREE.BufferGeometry();

  const count = 5000;
  const positionsArray = new Float32Array(count * 3 * 3);

  for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 4;
  }

  const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
  geometry.setAttribute("position", positionsAttribute);

  // const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);

  // const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

  // geometry.setAttribute("position", positionsAttribute);

  // // first vertices

  // positionsArray[0] = 0;
  // positionsArray[1] = 0;
  // positionsArray[2] = 0;

  // // second vertices

  // positionsArray[3] = 0;
  // positionsArray[4] = 1;
  // positionsArray[5] = 0;

  // // third vertices

  // positionsArray[6] = 1;
  // positionsArray[7] = 0;
  // positionsArray[8] = 0;

  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
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

  window.addEventListener("dblclick", () => {
    const fullscreenElement =
      document.fullscreenElement || document.webkitFullScreen;

    if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
      } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
  });

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.001,
    100
  );

  camera.position.set(0, 0, 3);
  camera.lookAt(mesh.position);
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
