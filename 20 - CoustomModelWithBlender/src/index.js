import "./style/main.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

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
   * scene
   */
  const scene = new THREE.Scene();

  /*
   * models
   */

  let mixer = null;

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  // gltfLoader.load("/model/Fox/glTF/Fox.gltf", (gltf) => {
  //   mixer = new THREE.AnimationMixer(gltf.scene);

  //   const action = mixer.clipAction(gltf.animations[2]);

  //   action.play();

  //   gltf.scene.scale.set(0.025, 0.025, 0.025);
  //   scene.add(gltf.scene);
  // });

  /*
   * objects
   */

  const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: "#777777",
      metalness: 0.3,
      roughness: 0.4,
    })
  );
  floor.receiveShadow = true;
  floor.rotation.set(-Math.PI * 0.5, 0, 0);

  scene.add(floor);

  /*
   * Lights
   */

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.camera.far = 15;
  directionalLight.shadow.camera.left = -7;
  directionalLight.shadow.camera.top = 7;
  directionalLight.shadow.camera.right = 7;
  directionalLight.shadow.camera.bottom = -7;
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

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
