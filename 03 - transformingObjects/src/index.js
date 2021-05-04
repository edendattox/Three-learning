import "./style/main.css";
import * as THREE from "three";

function init() {
  // scene
  const scene = new THREE.Scene();

  // Objects
  const group = new THREE.Group();
  group.position.set(0, 1, 0);
  group.scale.set(0, 2, 0);
  group.rotation.set(0, 1, 0);
  scene.add(group);

  const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );

  group.add(cube1);

  const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
  );

  cube2.position.set(-1.4, 0, 0);

  group.add(cube2);

  const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );

  cube3.position.set(1.4, 0, 0);

  group.add(cube3);

  // Axes helper
  const axesHelper = new THREE.AxisHelper(2);
  scene.add(axesHelper);

  // sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // camera
  // camera 1st param is field of view
  // camera 2nd param is aspect ratio

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.set(0, 0, 3);
  scene.add(camera);

  // renderer
  const canvas = document.querySelector(".webgl");
  console.log(canvas);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);

  renderer.render(scene, camera);
}

init();
