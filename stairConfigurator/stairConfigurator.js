import { ThreeView } from "./ThreeView";
import { SideView } from "./SideView";
import { TopView } from "./TopView";

export class StairConfigurator {
  constructor(props) {
    this.side = new SideView(props);
    this.top  = new TopView(props);
    this.three = new ThreeView(props);
  }
  dispose(){
    this.top.dispose()
    this.side.dispose()
  }
  update(){
    this.top.update()
    this.side.update()
  }

}

