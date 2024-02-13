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
    this.containerHeight = this.canvas.height - this.padding;
    this.scale = this.containerHeight / this.totalHeight;

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

    this.legends.map((legendData, index) => {
      const legendName = document.createElement("div");
      legendName.innerText = legendData.name;

      const legendColor = document.createElement("div");
      legendColor.style.width = "40px";
      legendColor.style.height = "10px";
      legendColor.style.backgroundColor = legendData.color;
      legendColor.style.borderRadius = "1rem";

      const legendValue = document.createElement("div");
      legendValue.style.flexGrow = "1";
      legendValue.style.textAlign = "right";
      legendValue.innerText = `${legendData.value * 100} mm`;

      const legendLine = document.createElement("div");
      legendLine.style.display = "flex";
      legendLine.style.alignItems = "center";
      legendLine.style.width = "100%";
      legendLine.style.justifyContent = "space-between";
      legendLine.style.gap = "1rem";
      legendLine.appendChild(legendName);
      legendLine.appendChild(legendValue);
      legendLine.appendChild(legendColor);

      this.legendContainer.appendChild(legendLine);
    });
    this.container.appendChild(this.legendContainer);
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
}
