import { StairConfigurator } from "./stairConfigurator";

const props = {
  sideViewDivId: "sideveiw",
  topViewDivId: "topveiw",
  threeVeiwDivId: '3dview',
  stepHeight: 1.87,
  stepWidth: 5,
  stepDepth: 2.5,
  numSteps: 6,
  riserThickness: 0.3,
  treadThickness: 0.25,
  nosing: 0.2,
  showProps: true,
  riserMaterialMap: '/public/wood_floor/textures/wood_floor_diff_1k.jpg',
  treadMaterialMap: '/public/wood_floor/textures/wood_floor_diff_1k.jpg',
  enableShadows: true
}; 

new StairConfigurator(props);
