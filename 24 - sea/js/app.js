import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import fragment from "./shaders/fragment";
import vertex from "./shaders/vertex";
import * as dat from "dat.gui";

export default class sketch {
  constructor(options) {
    this.time = 0;
    this.scene = new THREE.Scene();
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      10
    );
    this.camera.position.set(0, 2, 3);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xffffff, 1);

    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.play();
    this.settings();
    this.setupResize();
    this.addObjects();
    this.render();
  }

  settings() {
    let that = this;
    this.gui = new dat.GUI();

    this.settings = {
      wave: 0,
      x: 1,
      y: 3,
      waveSpeed: 0.75,
      depthColor: "#186691",
      surfaceColor: "#9bd8ff",
      offset: 0.08,
      multiplier: 5,
    };
    this.gui.add(this.settings, "wave", 0, 1, 0.01).name("wave");
    this.gui.add(this.settings, "x", 0, 10, 0.01).name("frequencyX");
    this.gui.add(this.settings, "y", 0, 10, 0.01).name("frequencyY");
    this.gui.add(this.settings, "offset", 0, 10, 0.01).name("offset");
    this.gui.add(this.settings, "multiplier", 0, 10, 0.01).name("multiplier");
    this.gui.add(this.settings, "waveSpeed", 0, 10, 0.01).name("waveSpeed");
    this.gui
      .addColor(this.settings, "depthColor")
      .name("depthColor")
      .onChange(() => {
        this.material.uniforms.uDepthColor.value.set(this.settings.depthColor);
      });
    this.gui
      .addColor(this.settings, "surfaceColor")
      .name("surfaceColor")
      .onChange(() => {
        this.material.uniforms.uSurfaceColor.value.set(
          this.settings.surfaceColor
        );
      });
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;

    this.geometry = new THREE.PlaneBufferGeometry(3, 3, 128, 128);
    this.material = new THREE.MeshNormalMaterial();
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        uTime: { value: 0 },
        uWaveFrequency: { value: new THREE.Vector2(4, 1.5) },
        uWave: { value: 0.2 },
        uWaveSpeed: { value: 0.75 },

        uDepthColor: { value: new THREE.Color(this.settings.depthColor) },
        uSurfaceColor: {
          value: new THREE.Color(this.settings.surfaceColor),
        },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
      },
      side: THREE.DoubleSide,
      // wireframe: true,
    });

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.plane.rotation.set(Math.PI / 2, 0, Math.PI / 3);
    this.scene.add(this.plane);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;

    this.time = 0.05;
    // this.mesh.rotation.x = this.time / 2000;
    // this.mesh.rotation.y = this.time / 1000;
    this.material.uniforms.uTime.value += this.time;
    this.material.uniforms.uWaveFrequency.value.x = this.settings.x;
    this.material.uniforms.uWaveFrequency.value.y = this.settings.y;
    this.material.uniforms.uWaveFrequency.value.uColorOffset =
      this.settings.offset;
    this.material.uniforms.uWaveFrequency.value.uColorMultiplier =
      this.settings.multiplier;
    this.material.uniforms.uWaveSpeed.value = this.settings.waveSpeed;
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new sketch({
  dom: document.getElementById("container"),
});
