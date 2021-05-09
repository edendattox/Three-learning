import "./style/main.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
   * Cursor
   */
  const cursor = {
    x: 0,
    y: 0,
  };

  /*
   * Texture
   */

  const textureLoader = new THREE.TextureLoader();
  const cubeTextureLoader = new THREE.CubeTextureLoader();

  const doorBase = textureLoader.load(
    "/Texture/door/Door_Wood_001_basecolor.jpg"
  );

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

  const golden = textureLoader.load(
    "https://raw.githubusercontent.com/nidorx/matcaps/master/thumbnail/36220C_C6C391_8C844A_8B7B4C.jpg"
  );

  const blue = textureLoader.load(
    "https://raw.githubusercontent.com/nidorx/matcaps/master/thumbnail/36C8FA_176ACB_24A7EF_1D93EC.jpg"
  );

  const black = textureLoader.load(
    "https://raw.githubusercontent.com/nidorx/matcaps/master/thumbnail/1B1B1B_999999_575757_747474.jpg"
  );

  const stone = textureLoader.load(
    "https://raw.githubusercontent.com/nidorx/matcaps/master/palette/36312E_726461_59504D_645C5C-palette.png"
  );

  const metal = textureLoader.load(
    "https://raw.githubusercontent.com/nidorx/matcaps/master/thumbnail/C7C7D7_4C4E5A_818393_6C6C74.jpg"
  );

  const shine = textureLoader.load(
    "https://raw.githubusercontent.com/nidorx/matcaps/master/thumbnail/6E7181_D1CFDF_ABAFC7_B4BCCE.jpg"
  );

  const environmentTexture = cubeTextureLoader.load({});

  /*
   * scene
   */
  const scene = new THREE.Scene();

  scene.background = new THREE.Color("white");

  /*
   *  Object
   */

  // const material = new THREE.MeshBasicMaterial({
  //   color: "pink",
  // });

  // material.map = black;
  // // material.wireframe = true;
  // // material.opacity = 0.5;
  // // material.transparent = true;
  // // material.alphaMap = stone;
  // // material.side = THREE.DoubleSide;

  // const material = new THREE.MeshNormalMaterial();
  // material.flatShading = true;

  // const material = new THREE.MeshMatcapMaterial();
  // material.matcap = golden;

  // const material = new THREE.MeshDepthMaterial();
  // material.wireframe = true;

  // const material = new THREE.MeshLambertMaterial();

  // const material = new THREE.MeshPhongMaterial();
  // material.shininess = 100;
  // material.specular = new THREE.Color(0x1188ff);

  // const material = new THREE.MeshToonMaterial();

  const material = new THREE.MeshStandardMaterial();
  material.metalness = 0.7;
  material.roughness = 0.2;
  // material.aoMap = ambientOcclusion;
  // material.aoMapIntensity = 2;
  // material.map = doorBase;
  // material.displacementMap = height;
  // material.displacementScale = 0.12;
  // // material.wireframe = true;
  // material.metalnessMap = roughness;
  // material.metalnessMap = metallic;
  // material.normalMap = normal;
  // material.normalScale.set(0.5, 0.5);
  // material.alphaMap = opacity;
  // material.transparent = true;

  gui.add(material, "metalness").min(0).max(1).step(0.0001);
  gui.add(material, "roughness").min(0).max(1).step(0.0001);
  gui.add(material, "aoMapIntensity").min(0).max(3).step(0.0001);
  gui.add(material, "aoMapIntensity").min(0).max(3).step(0.0001);
  gui.add(material, "displacementScale").min(0).max(3).step(0.0001);
  gui.add(material, "wireframe");

  const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 64, 64),
    material
  );

  sphere.geometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
  );

  sphere.position.set(-1.5, 0, 0);

  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1, 100, 100),
    material
  );

  plane.geometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
  );

  console.log(plane.geometry.attributes.uv.array);

  // plane.position.set(0, 0, 0);

  const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.1, 64, 128),
    material
  );

  torus.geometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
  );

  torus.position.x = 1.5;

  scene.add(sphere, plane, torus);

  /*
   *  Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(2, 3, 4);
  scene.add(pointLight);

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
  camera.lookAt(sphere.position);
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

    // update objects

    // sphere.rotation.set(elapsedTime / 2, elapsedTime / 2, 0);
    // plane.rotation.set(elapsedTime / 2, elapsedTime / 2, 0);
    // torus.rotation.set(elapsedTime / 2, elapsedTime / 2, 0);

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
