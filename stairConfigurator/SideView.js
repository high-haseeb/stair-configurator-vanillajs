import { StairView } from "./StairView";

export class SideView extends StairView {
  constructor(props) {
    super(props, "sideView");
  }

  drawStep() {
    this.verticalOffset = this.centerY + (this.props.numSteps * (this.scaledStepHeight + this.scaledTreadThickness)) / 2 - this.scaledStepHeight;
    this.horizontalOffset = this.centerX - (this.props.numSteps * (this.scaledStepDepth) / 2);
    for (let i = 0; i < this.props.numSteps; i++) {
      const riserX = this.horizontalOffset + i * this.scaledStepDepth;
      const riserY = this.verticalOffset - i * (this.scaledStepHeight + this.scaledTreadThickness);
      const treadX = riserX - this.scaledNosing;
      const treadY = this.verticalOffset - i * (this.scaledStepHeight + this.scaledTreadThickness) - this.scaledTreadThickness;
      this.ctx.fillRect(riserX, riserY, this.scaledRiserThickness, this.scaledStepHeight);
      this.ctx.strokeRect(riserX, riserY, this.scaledRiserThickness, this.scaledStepHeight);
      this.ctx.fillRect(treadX, treadY, this.scaledStepDepth + this.scaledNosing + this.scaledRiserThickness, this.scaledTreadThickness);
      this.ctx.strokeRect(treadX, treadY, this.scaledStepDepth + this.scaledNosing + this.scaledRiserThickness, this.scaledTreadThickness);
    }

    if (this.props.showProps) {
      this.showMarks();
      this.createLegends();
    }
  }
  showMarks() {
    // this.legends = [
    //   {
    //     x: this.horizontalOffset,
    //     y: this.verticalOffset,
    //     length: this.scaledRiserThickness,
    //     hor: true,
    //     offset: this.scaledStepHeight + 10,
    //     text: `${this.props.riserThickness * 100}mm`,
    //     name: "riser thickness",
    //     color: "orange",
    //     value: this.props.riserThickness,
    //     letter: "A"
    //   },
    //   {
    //     name: "tread thickness",
    //     color: "blue",
    //     value: this.props.treadThickness,
    //     x: this.horizontalOffset,
    //     y: this.verticalOffset,
    //     length: -this.scaledTreadThickness,
    //     hor: false,
    //     offset: this.scaledStepDepth + 20,
    //     text: `${this.props.treadThickness * 100}mm`,
    //     letter: "B"
    //   },
    //   {
    //     x: this.horizontalOffset + 2 * this.scaledStepDepth,
    //     y: this.verticalOffset - 2 * (this.scaledStepHeight + this.scaledTreadThickness),
    //     length: -this.scaledNosing,
    //     hor: true,
    //     offset: 10,
    //     text: `${this.props.nosing * 100}mm`,
    //     name: "nosing",
    //     color: "darkred",
    //     value: this.props.nosing,
    //     letter: "C"
    //   },
    //   {
    //     x: this.horizontalOffset + this.scaledStepDepth,
    //     y: this.verticalOffset - (this.scaledStepHeight + this.scaledTreadThickness),
    //     length: this.scaledStepDepth + this.scaledRiserThickness,
    //     hor: true,
    //     offset: 10,
    //     text: `${this.props.stepDepth * 100}mm`,
    //     name: "Individual going",
    //     color: "pink",
    //     value: this.props.stepDepth,
    //     letter: "D"
    //   },
    //   {
    //     x: this.horizontalOffset + 3 * this.scaledStepDepth,
    //     y: this.verticalOffset - 3 * (this.scaledStepHeight + this.scaledTreadThickness) - this.scaledRiserThickness,
    //     length: this.scaledStepHeight + this.scaledTreadThickness,
    //     hor: false,
    //     offset: -40,
    //     text: `${this.props.stepHeight * 100}mm`,
    //     name: "Riser Height",
    //     color: "violet",
    //     value: this.props.stepHeight,
    //     letter: "E"
    //   },
    // ];
    this.legends = [
      {
        name: "total height",
        x: this.horizontalOffset + this.totalDepth * this.scale + 20,
        y: this.verticalOffset - this.totalHeight * this.scale + this.scaledStepHeight,
        length: this.totalHeight * this.scale,
        offset: 0,
        color: "black",
        hor: false,
        value: this.totalHeight
      },
      {
        name: "total depth",
        x: this.horizontalOffset,
        y: this.verticalOffset,
        length: this.totalDepth * this.scale,
        offset: 20,
        color: "black",
        hor: true,
        value: this.totalDepth,
      },
    ];
    this.legends.forEach((mark) => {
      this.createMark(mark.x, mark.y, mark.length, 4, mark.hor, mark.offset, this.props.showDimensions ? `${(mark.value * 100).toFixed(1)} mm` : "", mark.color);
    });
  }
}
