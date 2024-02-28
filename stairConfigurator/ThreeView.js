import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { Text } from "troika-three-text";
import FindSurfaces from "./FindSurfaces";

import { CustomOutlinePass } from "./outlinePass";

export class ThreeView {
  constructor(props) {
    this.props = props;
    this.containerId = props.threeVeiwDivId;
    this.container = document.getElementById(this.containerId);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    // this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
    // this.camera.position.set(1, 1, 1);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minPolarAngle = -Math.PI * 2;
    // this.conrtols should only rotate about y axis
    // this.controls.enableRotate = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.createStairs();
    this.createLights();
    this.createGround();
    // this.createText();

    const depthTexture = new THREE.DepthTexture();
    const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      depthTexture: depthTexture,
      depthBuffer: true,
    });
    this.composer = new EffectComposer(this.renderer, renderTarget);
    const pass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(pass);

    // Outline pass.
    const customOutline = new CustomOutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
    this.composer.addPass(customOutline);

    // Antialias pass.
    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    this.composer.addPass(effectFXAA);
    const surfaceFinder = new FindSurfaces();
    this.render();

    addSurfaceIdAttributeToMesh(this.stairs);
    addSurfaceIdAttributeToMesh(this.ground);
    function addSurfaceIdAttributeToMesh(scene) {
      surfaceFinder.surfaceId = 0;

      scene.traverse((node) => {
        if (node.type == "Mesh") {
          const colorsTypedArray = surfaceFinder.getSurfaceIdAttribute(node);
          node.geometry.setAttribute("color", new THREE.BufferAttribute(colorsTypedArray, 4));
        }
      });

      customOutline.updateMaxSurfaceId(surfaceFinder.surfaceId + 1);
    }

    window.addEventListener("resize", () => this.onWindowResize());
  }
  createText() {
    const geometry = new THREE.BoxGeometry(0.1, this.totalHeight * 0.15, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: "black" });
    const line = new THREE.Line(geometry, material);
    line.rotation.y = -Math.PI / 2;
    line.rotation.x = Math.PI / 10;
    line.position.set(3, 0, 0);
    this.scene.add(line);

    const textMesh = new Text();
    textMesh.text = "100mm";
    textMesh.fontSize = 5;
    textMesh.color = "black";
    textMesh.position.set(20, 7, 1); // Adjust position as needed
    textMesh.rotation.setFromRotationMatrix(this.stairs.matrixWorld);

    this.scene.add(textMesh);
    this.stairs.add(textMesh);
  }
  createStairs() {
    const { numSteps, stepWidth, stepHeight, stepDepth, riserThickness, treadThickness, nosing } = this.props;
    const riserGeometry = new THREE.BoxGeometry(stepWidth, stepHeight, riserThickness);
    const material = new THREE.MeshStandardMaterial({ color: "white", roughness: 0.5 });
    if(this.props.riserMaterialMap){
      const texture = new THREE.TextureLoader().load(this.props.riserMaterialMap);
      material.map = texture;
    }

    const treadGeometry = new THREE.BoxGeometry(stepWidth, treadThickness, stepDepth + nosing + treadThickness);

    this.stairs = new THREE.Group();
    for (let i = 0; i < numSteps; i++) {
      const riser = new THREE.Mesh(riserGeometry, material);
      riser.castShadow = true;
      riser.position.set(0, i * stepHeight + i * treadThickness, i * -stepDepth - treadThickness / 2 + riserThickness / 2);

      const tread = new THREE.Mesh(treadGeometry, material);
      tread.castShadow = true;
      tread.position.set(
        0,
        i * stepHeight + stepHeight / 2 + i * treadThickness + treadThickness / 2,
        i * stepDepth * -1 - stepDepth / 2 + nosing / 2,
      );
      this.stairs.add(riser, tread);
    }

    const center = new THREE.Vector3();
    this.stairs.children.forEach((object) => center.add(object.position));
    center.divideScalar(this.stairs.children.length);
    this.stairs.children.forEach((object) => {
      object.position.sub(center);
    });

    this.stairs.scale.set(0.15, 0.15, 0.15);
    this.stairs.rotation.y = -Math.PI / 4;
    this.stairs.rotation.x = Math.PI / 10;
    this.scene.add(this.stairs);

    this.totalWidth = numSteps * stepDepth;
    this.totalHeight = numSteps * (stepHeight + treadThickness);
    this.camera.position.setZ(this.totalWidth * 2);
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    this.directionalLight.position.set(-5, 6, 0);
    this.directionalLight.castShadow = true;
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
  createGround() {
    this.ground = new THREE.Mesh(new THREE.BoxGeometry(7, 0.5, 10), new THREE.MeshPhysicalMaterial({ color: "#019C01" }));
    this.ground.position.y = -(this.totalHeight * 0.15) / 2 - 0.5;
    // this.ground.scale.set(0.15, 0.15, 0.15);
    this.ground.rotation.x = Math.PI / 10;
    this.ground.rotation.y = -Math.PI / 4;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
  }

  render() {
    requestAnimationFrame(() => this.render());
    // this.renderer.render(this.scene, this.camera);
    this.controls.update();
    this.composer.render();
    // this.stairs.rotation.y += 0.004;
  }

  dispose() {
    this.stairs.children.forEach((child) => {
      child.geometry.dispose();
    });
  }
}
