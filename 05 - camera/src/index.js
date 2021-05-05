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

  window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
    // console.log(cursor.x, cursor.y);
  });

  // scene
  const scene = new THREE.Scene();

  // red cube

  // hex color = in her color for example #ff0000 first two value are for red and middle two are for blur and last two for green.

  const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // sizes
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

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
  });

  /* camera prespective camera
   * camera 1st param is field of view
   * camera 2nd param is aspect ratio
   * camera 3rd param is near
   * camera 4th param is far
   */
  /**
   *  orthographic camera
   **/
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.001,
    100
  );

  /*   const aspectRatio = sizes.width / sizes.height;
   *   const camera = new THREE.OrthographicCamera(
   *     -1 * aspectRatio,
   *     1 * aspectRatio,
   *     -1,
   *     1,
   *     0.1,
   *     100
   *   );
   */
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

  //   controls.target.set(0, 1, 0);
  //   controls.update();

  // renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);

  /*
   *  Gsap
   */

  /* gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });
   *  gsap.to(mesh.position, { x: 0, duration: 1, delay: 1 });
   */

  //   //   Time
  //   let time = Date.now();

  // Clock
  const clock = new THREE.Clock();

  //   Animations
  const tick = () => {
    /*    Time
     * const currentTime = Date.now();
     * const delta = currentTime - time;
     * time = currentTime;
     */

    /*
     ** Clock
     */
    const elapsedTime = clock.getElapsedTime();

    /*
     *   Update objects
     */
    // mesh.position.x += 0.01;
    // mesh.rotation.y = elapsedTime;

    /*
     *  we can also use Math.sin for movement or Math.cos for
     */
    /*
     mesh.position.y = Math.sin(elapsedTime);
     mesh.position.x = Math.cos(elapsedTime);
     /

    / we can use animation on camera

      camera.position.y = Math.sin(elapsedTime);
      camera.position.x = Math.cos(elapsedTime);

    / camera.lookAt(mesh.position);

    // mesh.rotation.y = elapsedTime * Math.PI * 2;

    /*
     *  update Camera
     */

    /* camera.position.x = -cursor.x * 3;
     * camera.position.y = cursor.y * 3;
     */

    // camera.position.set(
    //   Math.sin(cursor.x * Math.PI * 2) * 3,
    //   cursor.y * 5,
    //   -Math.cos(cursor.x * Math.PI * 2) * 3
    // );
    // camera.lookAt(mesh.position);
    // camera.position.z = cursor.z * 3;

    /*
     * Update Controls
     */
    controls.update();

    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();
}

init();
