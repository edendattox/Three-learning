import "./style/main.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function init() {
  const image = new Image();

  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = () => {
    console.log("on Start");
  };

  loadingManager.onLoaded = () => {
    console.log("loading started");
  };

  loadingManager.onProgress = () => {
    console.log("loading Progress");
  };

  loadingManager.onError = () => {
    console.log("loading error");
  };
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const colorTexture = textureLoader.load(
    "/Texture/door/Door_Wood_001_basecolor.jpg"
  );
  const Material = textureLoader.load("/Texture/door/Material_843.png");
  const roughness = textureLoader.load(
    "/Texture/door/Door_Wood_001_roughness.jpg"
  );
  const opacity = textureLoader.load("/Texture/door/Door_Wood_001_opacity.jpg");
  const normal = textureLoader.load("/Texture/door/Door_Wood_001_normal.jpg");
  const metallic = textureLoader.load(
    "/Texture/door/Door_Wood_001_metallic.jpg"
  );
  const height = textureLoader.load("/Texture/door/Door_Wood_001_height.png");
  const ambientOcclusion = textureLoader.load(
    "/Texture/door/Door_Wood_001_ambientOcclusion.jpg"
  );

  // colorTexture.repeat.set(2, 3);
  // colorTexture.wrapS = THREE.MirrorRepeatWrapping;
  // colorTexture.wrapT = THREE.MirrorRepeatWrapping;

  // colorTexture.offset.set(0.5, 0.5);

  // colorTexture.rotation = Math.PI / 4;
  // colorTexture.center.set(0.5, 0.5);

  colorTexture.minFilter = THREE.NearestFilter;
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

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
  });

  /*
   * scene
   */
  const scene = new THREE.Scene();

  const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
  console.log(geometry.attributes.uv);
  const material = new THREE.MeshBasicMaterial({
    map: colorTexture,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = true;
  scene.add(mesh);

  /**
   * Sizes
   */

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
