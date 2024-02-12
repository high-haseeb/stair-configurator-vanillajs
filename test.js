import { StairConfigurator } from "./stairConfigurator";

const props = {
  sideViewDivId: "sideveiw",
  topViewDivId: "topveiw",
  threeVeiwDivId: '3dview',
  stepHeight: 1.87,
  stepWidth: 20,
  stepDepth: 2.5,
  numSteps: 16,
  riserThickness: 0.3,
  treadThickness: 0.25,
  nosing: 0.2,
  showProps: true,
  riserMaterialMap: '/wood_floor/textures/wood_floor_diff_1k.jpg',
  treadMaterialMap: '/wood_floor/textures/wood_floor_diff_1k.jpg',
  enableShadows: false
}; 

new StairConfigurator(props);
