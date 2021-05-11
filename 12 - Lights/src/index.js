import "./style/main.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

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

  scene.background = new THREE.Color("black");

  /*
   *  Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

  const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
  directionalLight.position.set(1, 0.25, 0);

  const hemisphere = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);

  const pointLight = new THREE.PointLight(0xff9000, 0.5);
  pointLight.position.set(0, 2, 0);

  const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
  rectAreaLight.position.set(-1.5, 0, 1.5);
  rectAreaLight.lookAt(new THREE.Vector3());

  const spotLight = new THREE.SpotLight(
    0x78ff00,
    0.5,
    10,
    Math.PI * 0.1,
    0.25,
    1
  );
  spotLight.position.set(0, 2, 3);

  scene.add(
    ambientLight,
    directionalLight,
    hemisphere,
    pointLight,
    rectAreaLight,
    spotLight
  );

  /*
   * Helpers
   */

  const hemisphereLightHelper = new THREE.HemisphereLightHelper(
    hemisphere,
    0.1
  );

  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    0.2
  );

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);

  const spotLightHelper = new THREE.SpotLightHelper(spotLight);

  window.requestAnimationFrame(() => {
    spotLightHelper.update();
  });

  const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);

  window.requestAnimationFrame(() => {
    rectAreaLightHelper.position.copy(rectAreaLight.position);
    rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion);
    rectAreaLightHelper.update;
  });

  scene.add(
    hemisphereLightHelper,
    directionalLightHelper,
    pointLightHelper,
    spotLightHelper,
    rectAreaLightHelper
  );

  /*
  * Minimal cost 
    
  AmbientLight
  HemisphereLight

  Moderate cost

  DirectionalLight
  PointLight

  High cost

  spotLight
  RectAreaLight
  */

  /*
   * rectAreaLight only work MeshStandardMaterial and MeshPhysicalMaterial
   */

  /*
   *  Objects
   */

  const material = new THREE.MeshStandardMaterial();
  // material.metalness = 0.7;
  material.roughness = 0.4;

  // gui.add(material, "metalness").min(0).max(1).step(0.0001);
  // gui.add(material, "roughness").min(0).max(1).step(0.0001);
  // gui.add(material, "aoMapIntensity").min(0).max(3).step(0.0001);
  // gui.add(material, "aoMapIntensity").min(0).max(3).step(0.0001);
  // gui.add(material, "displacementScale").min(0).max(3).step(0.0001);
  // gui.add(material, "wireframe");

  // Objects

  const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    material
  );

  sphere.position.set(-1.5, 0, 0);

  const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
    material
  );

  const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64),
    material
  );

  torus.position.x = 1.5;

  const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material);
  // plane.rotation.set(-Math.PI * 0.5, -0.65, 0);
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = -0.7;

  scene.add(sphere, cube, torus, plane);

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

    sphere.rotation.set(elapsedTime / 2, elapsedTime / 2, 0);
    cube.rotation.set(elapsedTime / 2, elapsedTime / 2, 0);
    torus.rotation.set(elapsedTime / 2, elapsedTime / 2, 0);

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
