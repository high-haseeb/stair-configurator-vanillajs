import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { CustomOutlinePass } from "./outlinePass";
import FindSurfaces from "./FindSurfaces";
import { TextureLoader } from "three";

export class ThreeView {
  constructor(props) {
    this.props = props;
    this.containerId = props.threeVeiwDivId;
    this.container = document.getElementById(this.containerId);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true , canvas: this.container});
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minPolarAngle = -Math.PI * 2;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;

    this.init();
    window.addEventListener("resize", () => this.onWindowResize());
  }
  createStairMaterial() {
    this.stairMaterial = new THREE.MeshPhysicalMaterial();
    this.textureLoader = new TextureLoader();
    if (this.props.texture) this.stairMaterial.map = this.textureLoader.load(this.props.texture);
  }
  init() {
    this.createStairMaterial();
    this.createStairs();
    this.createLights();
    this.props.showGround && this.createGround();

    this.props.showOutline ? this.outline() : this.render();
  }

  outline() {
    const renderTarget = new THREE.WebGLRenderTarget(
      this.container.clientWidth,
      this.container.clientHeight,
      {
        depthTexture: new THREE.DepthTexture(),
        depthBuffer: true,
      },
    );
    this.composer = new EffectComposer(this.renderer, renderTarget);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    // Outline pass.
    this.customOutline = new CustomOutlinePass(
      new THREE.Vector2(this.container.clientWidth, this.container.clientHeight),
      this.scene,
      this.camera,
    );
    this.composer.addPass(this.customOutline);

    // Antialias pass.
    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms["resolution"].value.set(
      1 / this.container.clientWidth,
      1 / this.container.clientHeight,
    );
    this.composer.addPass(effectFXAA);
    this.surfaceFinder = new FindSurfaces();

    this.renderOutline();
    this.addSurfaceIdAttributeToMesh(this.stairs);
    if (this.props.showGround) this.addSurfaceIdAttributeToMesh(this.ground);
  }

  addSurfaceIdAttributeToMesh(scene) {
    this.surfaceFinder.surfaceId = 0;

    scene.traverse((node) => {
      if (node.type == "Mesh") {
        const colorsTypedArray = this.surfaceFinder.getSurfaceIdAttribute(node);
        node.geometry.setAttribute("color", new THREE.BufferAttribute(colorsTypedArray, 4));
      }
    });
    this.customOutline.updateMaxSurfaceId(this.surfaceFinder.surfaceId + 1);
  }

  createStairs() {
    const { numSteps, stepWidth, stepHeight, stepDepth, riserThickness, treadThickness, nosing } =
      this.props;

    const riserGeometry = new THREE.BoxGeometry(stepWidth, stepHeight, riserThickness);
    const treadGeometry = new THREE.BoxGeometry(
      stepWidth,
      treadThickness,
      stepDepth + nosing + treadThickness,
    );

    this.stairs = new THREE.Group();
    for (let i = 0; i < numSteps; i++) {
      const riser = new THREE.Mesh(riserGeometry, this.stairMaterial);
      const tread = new THREE.Mesh(treadGeometry, this.stairMaterial);

      riser.position.set(
        0,
        i * stepHeight + i * treadThickness,
        i * -stepDepth - treadThickness / 2 + riserThickness / 2,
      );

      tread.position.set(
        0,
        i * stepHeight + stepHeight / 2 + i * treadThickness + treadThickness / 2,
        i * stepDepth * -1 - stepDepth / 2 + nosing / 2,
      );

      tread.castShadow = tread.receiveShadow = this.props.shadows;
      riser.castShadow = riser.receiveShadow = this.props.shadows;
      this.stairs.add(riser, tread);
    }

    // center the stairs
    const center = new THREE.Vector3();
    this.stairs.children.forEach((object) => center.add(object.position));
    center.divideScalar(this.stairs.children.length);
    this.stairs.children.forEach((object) => {
      object.position.sub(center);
    });

    // isometric view
    this.stairs.scale.set(0.15, 0.15, 0.15);
    this.stairs.rotation.y = -Math.PI / 4;
    this.stairs.rotation.x = Math.PI / 10;
    this.scene.add(this.stairs);

    this.totalWidth = numSteps * stepDepth;
    this.totalHeight = numSteps * (stepHeight + treadThickness);
    this.camera.position.setZ(this.totalWidth * 2);
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

    this.dl_bottom = new THREE.DirectionalLight(0xffffff, 1);
    this.dl_bottom.castShadow = true;
    this.dl_bottom.position.set(-3, 0, 0);
    this.dl_top = new THREE.DirectionalLight(0xffffff, 3);
    this.dl_top.castShadow = true;
    this.dl_top.position.set(-3, 4, 0);
    this.dl_right = new THREE.DirectionalLight(0xffffff, 1);
    this.dl_right.castShadow = true
    this.dl_right.position.set(4, 0, 0);

    this.scene.add(ambientLight, this.dl_bottom, this.dl_top, this.dl_right);
  }

  onWindowResize() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  createGround() {
    this.ground = new THREE.Mesh(
      new THREE.BoxGeometry(7, 0.5, 10),
      new THREE.MeshPhysicalMaterial({ color: "#019C01" }),
    );
    // isometric view
    this.ground.position.y = -(this.totalHeight * 0.15) / 2 - 0.5;
    this.ground.rotation.x = Math.PI / 10;
    this.ground.rotation.y = -Math.PI / 4;

    this.ground.receiveShadow = this.ground.castShadow = this.props.shadows;
    this.scene.add(this.ground);
  }

  renderOutline() {
    this.animamtionId = requestAnimationFrame(() => this.renderOutline());
    this.composer.render();
    this.controls.update();
  }
  render() {
    this.animamtionId = requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }

  dispose() {
    this.stairs.children.forEach((child) => child.geometry.dispose());
  }
  updateMaterial() {
    this.stairMaterial.map = this.textureLoader.load(this.props.texture);
  }
  updateOutline() {
    cancelAnimationFrame(this.animamtionId);
    if (this.props.showOutline) {
      this.outline();
      this.dl_top.intensity = 3;
      this.dl_right.intensity = 1;
      this.dl_bottom.intensity = 1;
      this.renderOutline();
    } else {
      this.dl_top.intensity = 2;
      this.dl_right.intensity = 2;
      this.dl_bottom.intensity = 2;
      this.render();
    }
  }
  updateGround() {
    if (this.props.showGround) {
      this.createGround();
    } else {
      if (this.ground) {
        this.scene.remove(this.ground);
        this.ground.geometry.dispose();
        this.ground.material.dispose();
      }
    }
  }
  updateStairs() {
    this.scene.remove(this.stairs);
    this.stairs.children.forEach((child) => child.geometry.dispose());
    this.stairs.children.forEach((child) => child.material.dispose());

    if (this.props.showGround) {
      this.scene.remove(this.ground);
      this.ground.geometry.dispose();
      this.ground.material.dispose();
      this.updateGround();
    }

    this.createStairs();
    this.props.showOutline && this.addSurfaceIdAttributeToMesh(this.stairs);
  }
}
