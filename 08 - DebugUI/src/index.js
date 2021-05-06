import "./style/main.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

console.log(gsap);

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
   * Cursor
   */
  const cursor = {
    x: 0,
    y: 0,
  };

  window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
  });

  /*
   * scene
   */
  const scene = new THREE.Scene();

  const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
  const material = new THREE.MeshBasicMaterial({ color: parameters.color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = true;
  scene.add(mesh);

  /*
   * Debug
   */
  gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");

  gui.add(parameters, "spin");

  gui.add(mesh, "visible");

  gui.add(material, "wireframe");

  gui.addColor(parameters, "color").onChange(() => {
    material.color.set(parameters.color);
  });

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

  // window.addEventListener("dblclick", () => {
  //   const fullscreenElement =
  //     document.fullscreenElement || document.webkitFullScreen;

  //   if (!fullscreenElement) {
  //     if (canvas.requestFullscreen) {
  //       canvas.requestFullscreen();
  //     } else if (canvas.webkitRequestFullscreen) {
  //       canvas.webkitRequestFullscreen();
  //     }
  //   } else {
  //     document.exitFullscreen();
  //   }
  // });

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

// dat.gui library for debug ui
