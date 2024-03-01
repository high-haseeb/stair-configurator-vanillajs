import { ThreeView } from "./ThreeView";
import { SideView } from "./SideView";
import { TopView } from "./TopView";

export class StairConfigurator {
  constructor(props) {
    this.side  = new SideView(props);
    this.top   = new TopView(props);
    this.three = new ThreeView(props);
  }
  update() {
    this.top.dispose();
    this.side.dispose();
    this.top.update();
    this.side.update();
    this.three.updateStairs();
  }
}
