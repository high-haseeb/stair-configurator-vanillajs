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

    this.props.showProps && this.showLegends();
  }

  showLegends() {

    const legends = [
      {
        name:   "total height",
        x:      this.horizontalOffset + this.totalDepth * this.scale + 20,
        y:      this.verticalOffset - this.totalHeight * this.scale + this.scaledStepHeight,
        length: this.totalHeight * this.scale,
        offset: 0,
        hor:    false,
        value:  this.totalHeight,
        image: "total_height.png"
      },
      {
        name: "total depth",
        x: this.horizontalOffset,
        y: this.verticalOffset,
        length: this.totalDepth * this.scale,
        offset: 20,
        hor: true,
        value: this.totalDepth,
        image: "total_width.png"
      },
      { name: "nosing",           value: this.props.nosing.toFixed(2),         image: "nosing.png"},
      { name: "individual going", value: this.props.stepDepth.toFixed(2),      image: "tread_length.png"},
      { name: "tread thickness",  value: this.props.treadThickness.toFixed(2), image: "tread_thickness.png"},
      { name: "riser thickness",  value: this.props.riserThickness.toFixed(2), image: "riser_thickness.png"},
      { name: "step height",      value: this.props.stepHeight.toFixed(2),     image: "riser_length.png"},
    ];
    this.props.showDimensions &&
    legends.forEach(mark => {
      this.createMark(mark.x, mark.y, mark.length, 4, mark.hor, mark.offset, this.props.showDimensions ? `${(mark.value * 100).toFixed(1)} mm` : "", "black");
    });
    this.createLegends(legends);
  }
}
