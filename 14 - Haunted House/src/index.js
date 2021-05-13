import "./style/main.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { MaterialLoader } from "three";

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

  // scene.background = new THREE.Color("black");

  /*
   * Fog
   */

  const fog = new THREE.Fog("#262837", 1, 15);
  scene.fog = fog;

  /*
   * Textures
   */

  const textureLoader = new THREE.TextureLoader();

  // Door texture

  const doorColorTexture = textureLoader.load(
    "/Texture/door/Door_Wood_001_basecolor.jpg"
  );
  const doorAlphaTexture = textureLoader.load(
    "/Texture/door/Door_Wood_001_opacity.jpg"
  );
  const doorAmbientOcclusionTexture = textureLoader.load(
    "/Texture/door/Door_Wood_001_ambientOcclusion.jpg"
  );
  const doorHeightTexture = textureLoader.load(
    "/Texture/door/Door_Wood_001_height.jpg"
  );
  const doorNormalTexture = textureLoader.load(
    "/Texture/door/Door_Wood_001_normal.jpg"
  );
  const doorMetalnessTexture = textureLoader.load(
    "/Texture/door/Door_Wood_001_metallic.jpg"
  );
  const doorRoughnessTexture = textureLoader.load(
    "/Texture/door/Door_Wood_001_roughness.jpg"
  );

  // Bricks Texture

  const bricksColorTexture = textureLoader.load(
    "/Texture/wall/Stylized_Bricks_001_basecolor.jpg"
  );
  const bricksAmbientOcclusionTexture = textureLoader.load(
    "/Texture/wall/Stylized_Bricks_001_ambientOcclusion.jpg"
  );
  const bricksNormalTexture = textureLoader.load(
    "/Texture/wall/Stylized_Bricks_001_normal.jpg"
  );
  const bricksRoughnessTexture = textureLoader.load(
    "/Texture/wall/Stylized_Bricks_001_roughness.jpg"
  );
  const bricksHeightTexture = textureLoader.load(
    "/Texture/wall/Stylized_Bricks_001_height.png"
  );

  //  Grass texture

  const grassColorTexture = textureLoader.load(
    "/Texture/grass/Stylized_Grass_003_basecolor.jpg"
  );
  const grassAmbientOcclusionTexture = textureLoader.load(
    "/Texture/grass/Stylized_Grass_003_ambientOcclusion.jpg"
  );
  const grassNormalTexture = textureLoader.load(
    "/Texture/grass/Stylized_Grass_003_normal.jpg"
  );
  const grassRoughnessTexture = textureLoader.load(
    "/Texture/grass/SStylized_Grass_003_roughness.jpg"
  );
  const grassHeightTexture = textureLoader.load(
    "/Texture/grass/Stylized_Grass_003_height.png"
  );

  grassColorTexture.repeat.set(8, 8);
  grassAmbientOcclusionTexture.repeat.set(8, 8);
  grassNormalTexture.repeat.set(8, 8);
  grassRoughnessTexture.repeat.set(8, 8);
  grassHeightTexture.repeat.set(8, 8);

  grassColorTexture.wrapS = THREE.RepeatWrapping;
  grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
  grassNormalTexture.wrapS = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
  grassHeightTexture.wrapS = THREE.RepeatWrapping;

  grassColorTexture.wrapT = THREE.RepeatWrapping;
  grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
  grassNormalTexture.wrapT = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
  grassHeightTexture.wrapT = THREE.RepeatWrapping;

  /*
   *  House
   */

  // Group
  const house = new THREE.Group();
  scene.add(house);

  /*
   *  Lights
   */
  const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
  gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

  const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
  moonLight.position.set(4, 5, -2);

  gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
  gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
  gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
  gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);

  // Door Light

  const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
  doorLight.position.set(0, 2.2, 2.7);
  house.add(doorLight);

  scene.add(ambientLight, moonLight);

  /*
   * Ghosts
   */

  const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
  const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
  const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
  scene.add(ghost1, ghost2, ghost3);

  // Walls

  const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
      map: bricksColorTexture,
      aoMap: bricksAmbientOcclusionTexture,
      normalMap: bricksNormalTexture,
      displacementMap: bricksHeightTexture,
      displacementScale: 0.01,
      roughnessMap: bricksRoughnessTexture,
    })
  );

  walls.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
  );

  walls.position.set(0, 2.5 / 2, 0);
  house.add(walls);

  const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: "#b35f45" })
  );

  roof.position.set(0, 3, 0);
  roof.rotation.set(0, Math.PI / 4, 0);

  house.add(roof);

  // Door

  const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
      map: doorColorTexture,
      transparent: true,
      alphaMap: doorAlphaTexture,
      aoMap: doorAmbientOcclusionTexture,
      displacementMap: doorHeightTexture,
      displacementScale: 0.1,
      normalMap: doorNormalTexture,
      metalnessMap: doorMetalnessTexture,
      roughnessMap: doorRoughnessTexture,
    })
  );

  door.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
  );
  door.position.set(0, 1, 2.03);

  house.add(door);

  // Bushes

  const bushGeometery = new THREE.SphereBufferGeometry(1, 16, 16);
  const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

  const bush1 = new THREE.Mesh(bushGeometery, bushMaterial);
  bush1.scale.set(0.5, 0.5, 0.5);
  bush1.position.set(0.8, 0.2, 2.2);

  const bush2 = new THREE.Mesh(bushGeometery, bushMaterial);
  bush2.scale.set(0.25, 0.25, 0.25);
  bush2.position.set(1.4, 0.1, 2.1);

  const bush3 = new THREE.Mesh(bushGeometery, bushMaterial);
  bush3.scale.set(0.4, 0.4, 0.4);
  bush3.position.set(-0.8, 0.1, 2.2);

  const bush4 = new THREE.Mesh(bushGeometery, bushMaterial);
  bush4.scale.set(0.15, 0.15, 0.15);
  bush4.position.set(-1, 0.25, 2.6);

  house.add(bush1, bush2, bush3, bush4);

  // Graves

  const graves = new THREE.Group();
  scene.add(graves);

  const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
  const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.set(x, 0.3, z);
    grave.rotation.set(
      0,
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4
    );
    grave.castShadow = true;

    graves.add(grave);
  }

  //  Floor
  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({
      map: grassColorTexture,
      aoMap: grassAmbientOcclusionTexture,
      normalMap: grassNormalTexture,
      displacementMap: grassHeightTexture,
      displacementScale: 0.01,
      roughnessMap: grassRoughnessTexture,
    })
  );

  plane.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
  );

  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = 0;

  scene.add(plane);

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
     * Update renderer
     */
    renderer.setSize(sizes.width, sizes.height);
  });

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.001,
    100
  );

  camera.position.set(4, 2, 3);
  scene.add(camera);

  /**
   *  Controls
   */
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /*
   * renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor("#262837");

  /*
   * Shadows
   */

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  moonLight.castShadow = true;
  doorLight.castShadow = true;
  ghost1.castShadow = true;
  ghost2.castShadow = true;
  ghost3.castShadow = true;

  walls.castShadow = true;
  bush1.castShadow = true;
  bush2.castShadow = true;
  bush3.castShadow = true;
  bush4.castShadow = true;

  plane.receiveShadow = true;

  doorLight.shadow.mapSize.width = 256;
  doorLight.shadow.mapSize.height = 256;
  doorLight.shadow.mapSize.far = 7;

  ghost1.shadow.mapSize.width = 256;
  ghost1.shadow.mapSize.height = 256;
  ghost1.shadow.mapSize.far = 7;

  ghost2.shadow.mapSize.width = 256;
  ghost2.shadow.mapSize.height = 256;
  ghost2.shadow.mapSize.far = 7;

  ghost3.shadow.mapSize.width = 256;
  ghost3.shadow.mapSize.height = 256;
  ghost3.shadow.mapSize.far = 7;

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

    // Ghosts
    const ghostAngle = elapsedTime * 0.5;
    ghost1.position.set(
      Math.cos(ghostAngle) * 4,
      Math.sin(ghostAngle) * 4,
      Math.sin(elapsedTime * 3)
    );

    const ghostAngle2 = -elapsedTime * 0.32;
    ghost2.position.set(
      Math.cos(ghostAngle2) * 5,
      Math.sin(ghostAngle2) * 5,
      Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
    );

    const ghostAngle3 = -elapsedTime * 0.18;
    ghost3.position.set(
      Math.cos(ghostAngle3) * Math.sin(elapsedTime * 0.32),
      Math.sin(ghostAngle3) * Math.sin(elapsedTime * 0.5),
      Math.sin(elapsedTime + Math.sin(elapsedTime * 2.5))
    );

    // update objects

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
