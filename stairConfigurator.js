import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class StairConfigurator {
  constructor(props) {
    new SideView(props);
    new TopView(props);
    new ThreeView(props);
  }
}

export class SideView {
  constructor(props) {
    this.props = props;
    this.containerId = props.sideViewDivId;
    this.canvas = null;
    this.ctx = null;
    this.initializeCanvas();
  }

  initializeCanvas() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      throw new Error(`Container with ID '${this.containerId}' not found.`);
    }

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.container.appendChild(this.canvas);

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    window.addEventListener("resize", () => this.drawStep());
    this.drawStep();
  }

  drawStep() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    const { numSteps, stepHeight, stepDepth, riserThickness, treadThickness, nosing } = this.props;

    const padding = 100;
    const totalHeight = numSteps * (stepHeight + treadThickness);
    const containerHeight = this.canvas.height - padding;
    const scale = containerHeight / totalHeight;

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const scaledStepHeight = stepHeight * scale;
    const scaledStepDepth = stepDepth * scale;
    const scaledRiserThickness = riserThickness * scale;
    const scaledTreadThickness = treadThickness * scale;
    const scaledNosing = nosing * scale;
    const verticalOffset = centerY + (numSteps * (scaledStepHeight + scaledTreadThickness)) / 2 - scaledStepHeight;
    const horizontalOffset = centerX - (numSteps * (scaledStepDepth + scaledNosing + scaledRiserThickness)) / 2;

    this.ctx.strokeStyle = "black";
    this.ctx.fillStyle = "white";
    this.ctx.lineWidth = 1;

    for (let i = 0; i < numSteps; i++) {
      const riserX = horizontalOffset + i * scaledStepDepth;
      const riserY = verticalOffset - i * (scaledStepHeight + scaledTreadThickness);
      const treadX = riserX - scaledNosing;
      const treadY = verticalOffset - i * (scaledStepHeight + scaledTreadThickness) - scaledTreadThickness;
      this.ctx.fillRect(riserX, riserY, scaledRiserThickness, scaledStepHeight);
      this.ctx.fillRect(treadX, treadY, scaledStepDepth + scaledNosing + scaledRiserThickness, scaledTreadThickness);
      this.ctx.strokeRect(riserX, riserY, scaledRiserThickness, scaledStepHeight);
      this.ctx.strokeRect(treadX, treadY, scaledStepDepth + scaledNosing + scaledRiserThickness, scaledTreadThickness);
    }

    if (this.props.showProps) {
      const createMark = (x, y, length, size, hor = false, offset, text) => {
        this.ctx.strokeStyle = "red";
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.font = "10px sans";
        this.ctx.lineWidth = 2;
        this.ctx.textAlign = "left";
        if (hor) {
          y += offset;
          this.ctx.moveTo(x, y + size);
          this.ctx.lineTo(x, y - size);

          this.ctx.moveTo(x, y);
          this.ctx.lineTo(x + length, y);

          this.ctx.moveTo(x + length, y + size);
          this.ctx.lineTo(x + length, y - size);
          this.ctx.fillText(text, x, y + 15);
        } else {
          x += offset;
          this.ctx.moveTo(x + size, y);
          this.ctx.lineTo(x - size, y);

          this.ctx.moveTo(x, y);
          this.ctx.lineTo(x, y + length);

          this.ctx.moveTo(x + size, y + length);
          this.ctx.lineTo(x - size, y + length);

          this.ctx.fillText(text, x + 15, y);
        }

        this.ctx.stroke();
      };
      const riserThicknessMarkX = horizontalOffset + 0 * scaledStepDepth;
      const riserThicknessMarkY = verticalOffset - 0 * (scaledStepHeight + scaledTreadThickness);
      createMark(riserThicknessMarkX, riserThicknessMarkY, scaledRiserThickness, 4, true, scaledStepHeight + 10, `Riser Thickness ${riserThickness * 100}mm`);

      const treadThicknessMarkX = horizontalOffset + 0 * scaledStepDepth;
      const treadThicknessMarkY = verticalOffset - 0 * (scaledStepHeight + scaledTreadThickness);
      createMark(treadThicknessMarkX, treadThicknessMarkY, -scaledTreadThickness, 4, false, scaledStepDepth + 20, `Treaad Thickness ${treadThickness * 100}mm`);

      const nosingMarkX = horizontalOffset + 2 * scaledStepDepth;
      const nosingMarkY = verticalOffset - 2 * (scaledStepHeight + scaledTreadThickness);
      createMark(nosingMarkX, nosingMarkY, -scaledNosing, 4, true, 10, `Nosing ${treadThickness * 100}mm`);

      const depthMarkX = horizontalOffset + 1 * scaledStepDepth;
      const depthMarkY = verticalOffset - 1 * (scaledStepHeight + scaledTreadThickness);
      createMark(depthMarkX, depthMarkY, scaledStepDepth + scaledRiserThickness, 4, true, 10, `Individual Going ${stepDepth * 100}mm`);

      const heightMarkX = horizontalOffset + 3 * scaledStepDepth;
      const heightMarkY = verticalOffset - 3 * (scaledStepHeight + scaledTreadThickness) - scaledRiserThickness;
      createMark(heightMarkX, heightMarkY, scaledStepHeight + scaledTreadThickness, 4, false, -40, `${numSteps} risers ${stepHeight * 100}mm each`);
    }
  }
}

export class TopView {
  constructor(props) {
    this.props = props;
    this.containerId = props.topViewDivId;
    this.canvas = null;
    this.ctx = null;
    this.initializeCanvas();
  }

  initializeCanvas() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      throw new Error(`Container with ID '${this.containerId}' not found.`);
    }

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.container.appendChild(this.canvas);

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.lineWidth = 2;
    this.drawStep();
    window.addEventListener("resize", () => this.drawStep());
  }

  drawStep() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    const { numSteps, stepWidth, stepHeight, stepDepth, riserThickness, treadThickness, nosing } = this.props;

    const padding = 50;
    const totalHeight = numSteps * stepDepth;
    const containerHeight = this.canvas.parentNode.clientHeight - padding;
    const scale = containerHeight / totalHeight;

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const scaledStepWidth = stepWidth * scale;
    const scaledStepDepth = stepDepth * scale;
    const scaledNosing = nosing * scale;

    this.ctx.strokeStyle = "black";
    this.ctx.fillStyle = "white";

    for (let i = 0; i < numSteps; i++) {
      const stepY = centerY + i * scaledStepDepth - (numSteps * scaledStepDepth) / 2 - scaledNosing;
      this.ctx.fillRect(centerX - scaledStepWidth / 2, stepY, scaledStepWidth, scaledStepDepth + scaledNosing);
      this.ctx.strokeRect(centerX - scaledStepWidth / 2, stepY, scaledStepWidth, scaledStepDepth + scaledNosing);
    }

    const createMark = (x, y, length, size, hor = false, offset, text) => {
      this.ctx.strokeStyle = "red";
      this.ctx.fillStyle = "red";
      this.ctx.beginPath();
      this.ctx.font = "10px sans";
      this.ctx.lineWidth = 2;
      this.ctx.textAlign = "left";
      if (hor) {
        y += offset;
        this.ctx.moveTo(x, y + size);
        this.ctx.lineTo(x, y - size);

        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + length, y);

        this.ctx.moveTo(x + length, y + size);
        this.ctx.lineTo(x + length, y - size);
        this.ctx.fillText(text, x, y + 15);
      } else {
        x += offset;
        this.ctx.moveTo(x + size, y);
        this.ctx.lineTo(x - size, y);

        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y + length);

        this.ctx.moveTo(x + size, y + length);
        this.ctx.lineTo(x - size, y + length);

        this.ctx.fillText(text, x + 15, y);
      }

      this.ctx.stroke();
    };
    if (this.props.showProps) {
      const stepY = centerY + 0 * scaledStepDepth - (numSteps * scaledStepDepth) / 2 - scaledNosing;
      createMark(centerX + scaledStepWidth / 2, stepY, scaledStepDepth, 10, false, 15 , `Individual Going${this.props.stepDepth * 100}mm` ) 
      createMark(centerX - scaledStepWidth / 2, stepY, scaledStepWidth, 10, true, -15 , `Step Width${this.props.stepWidth * 100}mm` ) 
    }
  }
}

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
