import "./style/main.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

function init() {
  const gui = new dat.GUI();

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

  /*
   * axesHelper
   */

  const axesHelper = new THREE.AxesHelper();
  // scene.add(axesHelper);

  /*
   * Texture
   */

  const textureLoader = new THREE.TextureLoader();

  const blue = textureLoader.load(
    "https://raw.githubusercontent.com/nidorx/matcaps/master/thumbnail/36C8FA_176ACB_24A7EF_1D93EC.jpg"
  );

  /*
   * Fonts
   */

  const fontLoader = new THREE.FontLoader();

  fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new THREE.TextBufferGeometry("Eden Dattox", {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 2,
    });
    textGeometry.center();

    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.z - 0.02) * 0.5
    // );

    const material = new THREE.MeshNormalMaterial();

    // material.matcap = blue;
    // textMaterial.wireframe = true;
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.3, 20, 45);

    for (let i = 0; i < 200; i++) {
      const donut = new THREE.Mesh(donutGeometry, material);

      donut.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );

      donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      const scale = Math.random();
      donut.scale.set(scale, scale, scale);
      scene.add(donut);
    }
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

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.001,
    100
  );

  camera.position.set(0, 0, 3);
  // camera.lookAt(fontLoader.position);
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

    // cube.rotation.set(elapsedTime / 2, elapsedTime / 2, 0);

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
