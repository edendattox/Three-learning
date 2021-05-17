import "./style/main.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

function init() {
  /*
   * Loaders
   */
  const dracoLoader = new DRACOLoader();
  const gltfLoader = new GLTFLoader();
  const cubeTextureLoader = new THREE.CubeTextureLoader();

  /*
   * Debug
   */
  const gui = new dat.GUI();
  const debugObject = {};

  /*
   * Canvas
   */
  const canvas = document.querySelector(".webgl");

  /*
   * scene
   */
  const scene = new THREE.Scene();

  /*
   */

  const updateAllMaterials = () => {
    scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.material.envMapIntensity = debugObject.envMapIntensity;
        child.material.needsUpdate = true;
      }
    });
  };
  /*
   * Environment Map
   */

  const environmentMap = cubeTextureLoader.load([
    "/cube-img/posx.jpg",
    "/cube-img/negx.jpg",
    "/cube-img/posy.jpg",
    "/cube-img/negy.jpg",
    "/cube-img/posz.jpg",
    "/cube-img/negz.jpg",
  ]);

  scene.background = environmentMap;
  scene.environment = environmentMap;
  environmentMap.encoding = THREE.sRGBEncoding;

  debugObject.envMapIntensity = 5;
  gui
    .add(debugObject, "envMapIntensity")
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials);

  console.log(environmentMap);

  /*
   * models
   */

  let mixer = null;

  dracoLoader.setDecoderPath("/draco/");

  gltfLoader.setDRACOLoader(dracoLoader);

  gltfLoader.load("/model/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
    gltf.scene.scale.set(10, 10, 10);
    gltf.scene.position.set(0, -4, 0);
    gltf.scene.rotation.y = Math.PI * 0.5;
    scene.add(gltf.scene);

    gui
      .add(gltf.scene.rotation, "y")
      .min(-Math.PI)
      .max(Math.PI)
      .step(0.001)
      .name("rotation");

    updateAllMaterials();
  });

  /*
   * Lights
   */

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);

  directionalLight.position.set(0.25, 3, -2.25);
  scene.add(directionalLight);

  gui
    .add(directionalLight, "intensity")
    .min(0)
    .max(10)
    .step(0.001)
    .name("lightIntensity");
  gui
    .add(directionalLight.position, "x")
    .min(-5)
    .max(5)
    .step(0.001)
    .name("LightX");

  gui
    .add(directionalLight.position, "y")
    .min(-5)
    .max(5)
    .step(0.001)
    .name("LightY");
  gui
    .add(directionalLight.position, "z")
    .min(-5)
    .max(5)
    .step(0.001)
    .name("LightZ");

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

  camera.position.set(3, 3, 7);
  scene.add(camera);

  /**
   *  Controls
   */
  const controls = new OrbitControls(camera, canvas);

  /*
   * renderer
   */
  controls.enableDamping = true;
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.physicalCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  gui
    .add(renderer, "toneMapping", {
      No: THREE.NoToneMapping,
      Linear: THREE.LinearToneMapping,
      Reinhard: THREE.ReinhardToneMapping,
      Cineon: THREE.CineonToneMapping,
      ACESFilmic: THREE.ACESFilmicToneMapping,
    })
    .onFinishChange(() => {
      renderer.toneMapping = Number(renderer.toneMapping);
      updateAllMaterials();
    });

  /*
   * Clock
   */
  const clock = new THREE.Clock();
  let previousTime = 0;

  /*
   * Animations
   */
  const tick = () => {
    /*
     ** Clock
     */
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Update mixer
    if (mixer !== null) {
      mixer.update(deltaTime);
    }

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

/*

* Many 3d model formats, each one responding to a problem

1. What data.
2. weight Compression
3. compatibility 
4. Copyrights
5. Etc.set
https://en.wikipedia.org/wiki/List_of_file_formats#3D_graphics

* Different criteria

1. Dedicated to one software 
2. Very light but might lack specific data
3. Almost all data but are heavy
4. Open source
5. Not open <source 
6. Binary 
7. ASCII
8. Etc.

* Popular formats

1. OBJ
2. FBX
3. STL
4. PLY
5. COLLADA
6. 3DS
7. GLTF

* glTF formats

1. glTF
2. glTF binary
3. glTF Draco
4. glTF Embedded

* glTF

1. The default format
2. multiple files
3. Duck.gltf is a JSON that contains cameras, lights, scenes, materials, objects transformations, but no geometries nor textures.
4. Duck0.bin is a binary that usually contains data like the geometries
(vertices positions, UV coordinates, normals, colors, etc.).
5. DuckCM.png is the texture used

We load the Duck.gltf file and the other files should load automatically

*/
