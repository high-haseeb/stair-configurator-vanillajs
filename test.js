import { StairConfigurator } from "./stairConfigurator/stairConfigurator";

const props = {
  sideViewDivId: "sideveiw",
  topViewDivId: "topveiw",
  threeVeiwDivId: "3dview",
  stepHeight: 1.87,
  stepWidth: 20,
  stepDepth: 2.5,
  numSteps: 10,
  riserThickness: 0.3,
  treadThickness: 0.3,
  nosing: 0.4,
  showProps: true,
  riserMaterialMap: "/wood_floor/textures/wood_floor_diff_1k.jpg",
  treadMaterialMap: "/wood_floor/textures/wood_floor_diff_1k.jpg",
  enableShadows: false,
  showDimensions: true,
};

const configurator = new StairConfigurator(props);
