import { ThreeView } from "./ThreeView";
import { SideView } from "./SideView";
import { TopView } from "./TopView";

export class StairConfigurator {
  constructor(props) {
    new SideView(props);
    new TopView(props);
    new ThreeView(props);
  }
}

