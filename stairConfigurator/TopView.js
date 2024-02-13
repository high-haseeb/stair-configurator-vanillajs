import { StairView } from "./StairView";

export class TopView extends StairView {
  constructor(props) {
    super(props, "topView");
  }
  drawStep() {
    for (let i = 0; i < this.props.numSteps; i++) {
      const stepY = this.centerY + i * this.scaledStepDepth - (this.props.numSteps * this.scaledStepDepth) / 2 - this.scaledNosing;
      this.ctx.fillRect(this.centerX - this.scaledStepWidth / 2, stepY, this.scaledStepWidth, this.scaledStepDepth + this.scaledNosing);
      this.ctx.strokeRect(this.centerX - this.scaledStepWidth / 2, stepY, this.scaledStepWidth, this.scaledStepDepth + this.scaledNosing);
    }

    if (this.props.showProps) {
      const stepY = this.centerY - (this.props.numSteps * this.scaledStepDepth) / 2 - this.scaledNosing;
      this.legends = [
        {
          x: this.centerX + this.scaledStepWidth / 2,
          y: stepY,
          length: this.scaledStepDepth,
          hor: false,
          offset: 15,
          text: `${this.props.stepDepth * 100}mm`,
          name: "depth",
          color: "red",
          value: this.props.stepDepth,
        },
        {
          x: this.centerX - this.scaledStepWidth / 2,
          length: this.scaledStepWidth,
          y: stepY,
          hor: true,
          offset: -15,
          text: `${this.props.stepWidth * 100}mm`,
          name: "width",
          color: "blue",
          value: this.props.stepWidth,
        },
      ];

      this.legends.forEach((mark) => {
        this.createMark(mark.x, mark.y, mark.length, 4, mark.hor, mark.offset, this.props.showDimensions ? mark.text : "", mark.color);
      });
      this.createLegends();
    }
  }
}
