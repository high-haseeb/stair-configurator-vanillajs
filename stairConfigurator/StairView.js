export class StairView {

  constructor(props, viewType) {
    this.props = props;
    this.containerId = props[`${viewType}DivId`];
    this.init();
  }

  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) throw new Error(`Container with ID '${this.containerId}' not found.`);
    this.container.style.position = "relative";

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.container.appendChild(this.canvas);

    window.addEventListener("resize", () => this.update());
    this.update();
  }

  update() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    const { numSteps, stepHeight, stepDepth, stepWidth, riserThickness, treadThickness, nosing } = this.props;

    this.padding = 100;
    this.totalHeight = numSteps * (stepHeight + treadThickness);
    this.totalDepth = numSteps * stepDepth;
    this.totalWidth = numSteps * stepWidth;
    this.containerHeight = this.canvas.height - this.padding;
    this.containerWidth = this.canvas.width - this.padding;
    const scaleHeight = this.containerHeight / this.totalHeight;
    const scaleWidth = this.containerWidth / this.totalDepth;

    // Choose the smaller scale to ensure the entire object fits within the container
    this.scale = Math.min(scaleHeight, scaleWidth);

    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.scaledStepHeight = stepHeight * this.scale;
    this.scaledStepDepth = stepDepth * this.scale;
    this.scaledStepWidth = stepWidth * this.scale;
    this.scaledRiserThickness = riserThickness * this.scale;
    this.scaledTreadThickness = treadThickness * this.scale;
    this.scaledNosing = nosing * this.scale;

    this.setupCanvas();
    this.drawStep();
  }

  setupCanvas() {
    this.ctx.strokeStyle = "black";
    this.ctx.fillStyle = "white";
    this.ctx.lineWidth = 1;
  }
  drawStep() {
    // Override this method in child classes for specific drawing logic
  }
  createLegends(legends) {

    this.imgVisible = {};
    const legendContainer = document.createElement("div");
    legendContainer.style.display         = "flex";
    legendContainer.style.flexDirection   = "column";
    legendContainer.style.alignItems      = "center";
    legendContainer.style.justifyContent  = "center";
    legendContainer.style.position        = "absolute";
    legendContainer.style.top             = "10px";
    legendContainer.style.left            = "10px";
    legendContainer.style.padding         = "10px";
    legendContainer.style.zIndex          = "10";
    legendContainer.style.backgroundColor = "#ffffff90";
    legendContainer.style.width           = "auto";
    legendContainer.style.height          = "auto";
    legendContainer.style.borderRadius    = "1rem";
    legendContainer.style.fontSize        = "14px";


    legends.map((legendData, idx) => {

      this.imgVisible[legendData.name] = false;

      const legendLine = document.createElement("div");
      legendLine.style.display        = "flex";
      legendLine.style.alignItems     = "center";
      legendLine.style.width          = "100%";
      legendLine.style.justifyContent = "space-between";
      legendLine.style.gap            = "1rem";
      
      const legendName = document.createElement("p");
      legendName.innerText = legendData.name;

      const legendValue = document.createElement("p");
      legendValue.style.flexGrow = "1";
      legendValue.style.textAlign = "right";
      legendValue.innerText = `${(legendData.value * 100).toFixed(0)} mm`;

      legendLine.appendChild(legendName);
      legendLine.appendChild(legendValue);
      legendLine.appendChild(this.helperImage(legendData));

      legendContainer.appendChild(legendLine);
    });

    this.container.appendChild(legendContainer);
  }

  helperImage(legend){
    const image                 = document.createElement("img");
    image.style.backgroundColor = "white";
    image.style.zIndex          = 999;
    image.style.position        = "absolute";
    image.style.top             = `${this.padding / 2}px`;
    image.style.left            = `${this.padding / 2}px`;
    image.style.width           = `${this.container.clientWidth - this.padding}px`;
    image.style.height          = `${this.container.clientHeight - this.padding}px`;
    image.style.visibility      = "hidden";
    image.src                   = `/public/helper_images/${legend.image}` || "";
    image.style.backgroundSize  = "cover"
    this.container.appendChild(image);

    const imgCloseButton                 = document.createElement("button");
    imgCloseButton.innerText             = "X";
    imgCloseButton.style.position        = "absolute";
    imgCloseButton.style.display         = "flex";
    imgCloseButton.style.alignItems      = "center";
    imgCloseButton.style.justifyContent  = "center";
    imgCloseButton.style.top             = "10px";
    imgCloseButton.style.right           = "10px";
    imgCloseButton.style.padding         = "10px";
    imgCloseButton.style.zIndex          = "10";
    imgCloseButton.style.backgroundColor = "black";
    imgCloseButton.style.color           = "white";
    imgCloseButton.style.width           = "2rem";
    imgCloseButton.style.borderRadius    = "3rem";
    imgCloseButton.onclick               = () => this.toggleRef(image, imgCloseButton, legend.name);
    imgCloseButton.style.height          = "2rem";
    imgCloseButton.style.visibility      = "hidden";
    this.container.appendChild(imgCloseButton);

    const helpIcon = document.createElement("div");
    helpIcon.innerText = "i";
    helpIcon.style.backgroundColor = "black";
    helpIcon.style.fontWeight = "bold";
    helpIcon.style.color = "white";
    helpIcon.style.width = "1rem";
    helpIcon.style.borderRadius = "3rem";
    helpIcon.style.height = "1rem";
    helpIcon.style.display = "flex";
    helpIcon.style.alignItems = "center";
    helpIcon.style.justifyContent = "center";
    helpIcon.style.cursor = "pointer";
    helpIcon.onclick = () => this.toggleRef(image, imgCloseButton, legend.name);
    return helpIcon;
  }
  toggleRef(img, imgCloseButton, name) {
    if (!this.imgVisible[name]) {
      img.style.visibility = "visible";
      imgCloseButton.style.visibility = "visible";
      this.imgVisible[name] = true;
    } else {
      imgCloseButton.style.visibility = "hidden";
      img.style.visibility = "hidden";
      this.imgVisible[name] = false;
    }
  }
  createMark(x, y, length, size, hor = false, offset, text, color) {
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
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
      this.ctx.fillText(text, x + length / 2, y - 15);
    } else {
      x += offset;
      this.ctx.moveTo(x + size, y);
      this.ctx.lineTo(x - size, y);

      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x, y + length);

      this.ctx.moveTo(x + size, y + length);
      this.ctx.lineTo(x - size, y + length);

      this.ctx.fillText(text, x + 15, y + length / 2);
    }

    this.ctx.stroke();
  }
  dispose() {
    // Remove event listener
    window.removeEventListener("resize", () => this.update());

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Remove legend container
    if (this.legendContainer && this.legendContainer.parentNode) {
      this.legendContainer.parentNode.removeChild(this.legendContainer);
    }
  }
}
