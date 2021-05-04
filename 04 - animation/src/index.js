import "./style/main.css";
import * as THREE from "three";
import gsap from "gsap";

function init() {
  // scene
  const scene = new THREE.Scene();

  // red cube

  // hex color = in her color for example #ff0000 first two value are for red and middle two are for blur and last two for green.

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // sizes
  /**
   * Sizes
   */
  const sizes = {};
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  window.addEventListener("resize", () => {
    // Save sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
  });

  // camera
  // camera 1st param is field of view
  // camera 2nd param is aspect ratio

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.set(0, 0, 3);
  scene.add(camera);

  // renderer
  const canvas = document.querySelector(".webgl");
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);

  //   Gsap
  gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });
  gsap.to(mesh.position, { x: 0, duration: 1, delay: 1 });

  //   //   Time
  //   let time = Date.now();

  // Clock
  const clock = new THREE.Clock();

  //   Animations
  const tick = () => {
    //    TIme
    // const currentTime = Date.now();
    // const delta = currentTime - time;
    // time = currentTime;

    // Clock
    // const elapsedTime = clock.getElapsedTime();

    //  Update objects
    // mesh.position.x += 0.01;
    // mesh.rotation.y += 0.001 * delta;

    // we can also use Math.sin for movement or Math.cos for
    // mesh.position.y = Math.sin(elapsedTime);
    // mesh.position.x = Math.cos(elapsedTime);

    // we can use animation on camera
    // camera.position.y = Math.sin(elapsedTime);
    // camera.position.x = Math.cos(elapsedTime);
    // camera.lookAt(mesh.position);

    // mesh.rotation.y = elapsedTime * Math.PI * 2;

    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();
}

init();
