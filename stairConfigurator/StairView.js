export class StairView {
  constructor(props, viewType) {
    this.props = props;
    this.containerId = props[`${viewType}DivId`];
    this.canvas = null;
    this.ctx = null;
    this.initializeCanvas();
    this.legends = [];
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
  createLegends() {
    this.imgVisible = false;
    this.legendContainer = document.createElement("div");
    this.legendContainer.style.display = "flex";
    this.legendContainer.style.flexDirection = "column";
    this.legendContainer.style.alignItems = "center";
    this.legendContainer.style.justifyContent = "center";
    this.container.style.position = "relative";
    this.legendContainer.style.position = "absolute";
    this.legendContainer.style.top = "10px";
    this.legendContainer.style.left = "10px";
    this.legendContainer.style.padding = "10px";
    this.legendContainer.style.zIndex = "10";
    this.legendContainer.style.backgroundColor = "#ffffff90";
    this.legendContainer.style.width = "auto";
    this.legendContainer.style.height = "auto";
    this.legendContainer.style.borderRadius = "1rem";
    this.legendContainer.style.fontSize = "14px";

    this.legends.map((legendData, index) => {
      const legendName = document.createElement("div");
      legendName.innerText = legendData.name;

      // const legendColor = document.createElement("div");
      // legendColor.style.width = "40px";
      // legendColor.style.height = "10px";
      // legendColor.style.backgroundColor = legendData.color;
      // legendColor.style.borderRadius = "1rem";
       
      // i icon
      const i = document.createElement("div");
      i.innerText = "i";
      i.style.backgroundColor = "black";
      i.style.fontWeight = "bold";
      i.style.color = "white";
      i.style.width = "1rem";
      i.style.borderRadius = "3rem";
      i.style.height = "1rem";
      i.style.display = "flex";
      i.style.alignItems = "center";
      i.style.justifyContent = "center";
      i.style.cursor = "pointer";
      i.onclick = () => {
        this.toggleRef()
        }

      const legendValue = document.createElement("div");
      legendValue.style.flexGrow = "1";
      legendValue.style.textAlign = "right";
      legendValue.innerText = `${(legendData.value * 100).toFixed(0)} mm`;

      const legendLetter = document.createElement("div");
      // legendLetter.style.flexGrow = "1";
      legendLetter.style.textAlign = "right";
      legendLetter.innerText = `${legendData.letter}`;

      const legendLine = document.createElement("div");
      legendLine.style.display = "flex";
      legendLine.style.alignItems = "center";
      legendLine.style.width = "100%";
      legendLine.style.justifyContent = "space-between";
      legendLine.style.gap = "1rem";
      legendLine.appendChild(legendName);
      legendLine.appendChild(legendValue);
      legendLine.appendChild(i);
      // legendLine.appendChild(legendLetter);

      this.legendContainer.appendChild(legendLine);
    });
    // const imgButton = document.createElement("button");
    // imgButton.innerText = "i";
    // imgButton.onclick = () => this.toggleRef();
    // imgButton.style.position = "absolute";
    // imgButton.style.display = "flex";
    // imgButton.style.alignItems = "center";
    // imgButton.style.justifyContent = "center";
    // imgButton.style.top = "10px";
    // imgButton.style.right = "10px";
    // imgButton.style.padding = "10px";
    // imgButton.style.zIndex = "10";
    // imgButton.style.backgroundColor = "black";
    // imgButton.style.color = "white";
    // imgButton.style.width = "2rem";
    // imgButton.style.borderRadius = "3rem";
    // imgButton.style.height = "2rem";
    // this.container.appendChild(imgButton);
    this.container.appendChild(this.legendContainer);

    this.img = document.createElement("img");
    this.img.style.backgroundColor = "green";
    this.img.style.zIndex = 999;
    this.img.style.position = "absolute";
    this.img.style.top = `${this.padding / 2}px`;
    this.img.style.left = `${this.padding / 2}px`;
    this.img.style.borderRadius = "3rem";
    this.img.style.width = `${this.container.clientWidth - this.padding}px`; // Use style.width for div elements
    this.img.style.height = `${this.container.clientHeight - this.padding}px`; // Use style.width for div elements
    this.img.style.visibility = "hidden";
    this.img.src = this.props.refSrc || "";
    this.img.style.backgroundSize = "cover"
    this.container.appendChild(this.img);
    this.imgCloseButton = document.createElement("button");
    this.imgCloseButton.innerText = "X";
    this.imgCloseButton.style.position = "absolute";
    this.imgCloseButton.style.display = "flex";
    this.imgCloseButton.style.alignItems = "center";
    this.imgCloseButton.style.justifyContent = "center";
    this.imgCloseButton.style.top = "10px";
    this.imgCloseButton.style.right = "10px";
    this.imgCloseButton.style.padding = "10px";
    this.imgCloseButton.style.zIndex = "10";
    this.imgCloseButton.style.backgroundColor = "black";
    this.imgCloseButton.style.color = "white";
    this.imgCloseButton.style.width = "2rem";
    this.imgCloseButton.style.borderRadius = "3rem";
    this.imgCloseButton.style.height = "2rem";
    this.imgCloseButton.onclick = () => this.toggleRef();
    this.imgCloseButton.style.visibility = "hidden";
    this.container.appendChild(this.imgCloseButton);

  }
  toggleRef() {
    if (!this.imgVisible) {
      this.img.style.visibility = "visible";
      this.imgCloseButton.style.visibility = "visible";
      this.imgVisible = true;
    } else {
      this.imgCloseButton.style.visibility = "hidden";
      this.img.style.visibility = "hidden";
      this.imgVisible = false;
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
