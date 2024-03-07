import { StairView } from "./StairView";

export class TopView extends StairView {
  constructor(props) {
    super(props, "topView");
  }
  drawStep() {

    const { stepHeight, stepDepth, stepWidth, riserThickness, treadThickness, nosing } = this.props;
    this.scale = Math.min(this.containerHeight / this.totalDepth, 10);
    this.scaledStepHeight = stepHeight * this.scale;
    this.scaledStepDepth = stepDepth * this.scale;
    this.scaledStepWidth = stepWidth * this.scale;
    this.scaledRiserThickness = riserThickness * this.scale;
    this.scaledTreadThickness = treadThickness * this.scale;
    this.scaledNosing = nosing * this.scale;

    for (let i = 0; i < this.props.numSteps; i++) {
      const stepY = this.centerY + i * this.scaledStepDepth - (this.props.numSteps * this.scaledStepDepth) / 2 - this.scaledNosing;
      this.ctx.fillRect(this.centerX - this.scaledStepWidth / 2, stepY, this.scaledStepWidth, this.scaledStepDepth + this.scaledNosing);
      this.ctx.strokeRect(this.centerX - this.scaledStepWidth / 2, stepY, this.scaledStepWidth, this.scaledStepDepth + this.scaledNosing);
    }

    if (this.props.showProps) {
      const stepY = this.centerY - (this.props.numSteps * this.scaledStepDepth) / 2 - this.scaledNosing;
      const legends = [
        {
          x:      this.centerX + this.scaledStepWidth / 2,
          y:      stepY,
          length: (this.totalDepth + this.props.nosing) * this.scale, 
          hor:    false,
          offset: 15,
          text:   `${this.props.numSteps * this.props.stepDepth * 100}mm`,
          name:   "depth",
          value:  this.totalDepth + this.props.nosing,
          letter: "A",
        },
        {
          x:      this.centerX - this.scaledStepWidth / 2,
          length: this.scaledStepWidth,
          y:      stepY,
          hor:    true,
          offset: -15,
          text:   `${this.props.stepWidth * 100}mm`,
          name:   "width",
          value:  this.props.stepWidth,
          letter: "B",
        },
      ];

      this.props.showDimensions &&
      legends.forEach(mark => {
        this.createMark(mark.x, mark.y, mark.length, 4, mark.hor, mark.offset, this.props.showDimensions ? `${(mark.value * 100).toFixed(1)} mm` : "", "black");
      });
      this.createLegends(legends);
    }
  }
}
