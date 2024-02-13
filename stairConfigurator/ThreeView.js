import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class ThreeView {
  constructor(props) {
    this.props = props;
    this.containerId = props.threeVeiwDivId;
    this.container = document.getElementById(this.containerId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minPolarAngle = Math.PI / 8;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.createLights();
    this.createStairs().then(() => {
      this.render();
    });

    window.addEventListener("resize", () => this.onWindowResize());
  }

  addShadowPlane() {
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
    const groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
    groundPlane.position.y = -this.totalHeight / 2;
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.receiveShadow = true;
    this.scene.add(groundPlane);
  }

  async createStairs() {
    const { numSteps, stepWidth, stepHeight, stepDepth, riserThickness, treadThickness, nosing } = this.props;
    const riserGeometry = new THREE.BoxGeometry(stepWidth, stepHeight, riserThickness);
    let riserMaterial, treadMaterial;
    if (this.props.riserMaterialMap || this.props.treadMaterialMap) {
      const loader = new THREE.TextureLoader();
      const riserTexture = await loader.loadAsync(this.props.riserMaterialMap);
      const treadTexture = await loader.loadAsync(this.props.treadMaterialMap);
      riserMaterial = new THREE.MeshPhysicalMaterial({ map: riserTexture });
      treadMaterial = new THREE.MeshPhysicalMaterial({ map: treadTexture });
    } else {
      riserMaterial = new THREE.MeshPhysicalMaterial({ color: "white" });
      treadMaterial = new THREE.MeshPhysicalMaterial({ color: "black" });
    }
    const treadGeometry = new THREE.BoxGeometry(stepWidth, treadThickness, stepDepth + nosing + treadThickness);

    this.stairs = new THREE.Group();
    for (let i = 0; i < numSteps; i++) {
      const riser = new THREE.Mesh(riserGeometry, riserMaterial);
      riser.castShadow = true;
      riser.position.set(0, i * stepHeight + i * treadThickness, i * -stepDepth - treadThickness / 2 + riserThickness / 2);
      const tread = new THREE.Mesh(treadGeometry, treadMaterial);
      tread.castShadow = true;
      tread.position.set(0, i * stepHeight + stepHeight / 2 + i * treadThickness + treadThickness / 2, i * stepDepth * -1 - stepDepth / 2 + nosing / 2);
      this.stairs.add(riser, tread);
    }

    const center = new THREE.Vector3();
    this.stairs.children.forEach((object) => center.add(object.position));
    center.divideScalar(this.stairs.children.length);
    this.stairs.children.forEach((object) => {
      object.position.sub(center);
    });
    this.stairs.castShadow = true;
    this.scene.add(this.stairs);
    this.totalWidth = numSteps * stepDepth;
    this.totalHeight = numSteps * stepHeight;
    this.stairs.position.setZ(this.totalWidth / 2);
    this.camera.position.setZ(this.totalWidth * 2);

    if (this.props.enableShadows) {
      this.addShadowPlane();
    }
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    this.directionalLight.position.set(1, 4, 3);
    if (this.props.enableShadows) {
      this.directionalLight.castShadow = true;
      this.directionalLight.shadow.mapSize.width = 1024;
      this.directionalLight.shadow.mapSize.height = 1024;
      this.directionalLight.shadow.camera.near = 0.5;
      this.directionalLight.shadow.camera.far = 500;
    }
    this.scene.add(this.directionalLight);
    this.spotLight = new THREE.SpotLight(0xffffff, 1);
    this.spotLight.position.set(0, 10, 0);
    this.spotLight.target.position.set(0, 0, 0);
    this.spotLight.angle = Math.PI / 4;
    this.spotLight.penumbra = 0.5;
    this.spotLight.castShadow = true;
    this.scene.add(this.spotLight);
  }

  onWindowResize() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  render() {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
    this.stairs.rotation.y += 0.004;
    this.controls.update();
  }
}
