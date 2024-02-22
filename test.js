import * as dat from 'dat.gui';
import { StairView } from './stairConfigurator/StairView';
import { StairConfigurator } from './stairConfigurator/stairConfigurator';

const props = {
  sideViewDivId: "sideveiw",
  topViewDivId: "topveiw",
  threeVeiwDivId: '3dview',
  stepHeight: 1.87,
  stepWidth: 20,
  stepDepth: 2.5,
  numSteps: 16,
  riserThickness: 0.8,
  treadThickness: 0.5,
  nosing: 0.8,
  showProps: true,
  riserMaterialMap: '/wood_floor/textures/wood_floor_diff_1k.jpg',
  treadMaterialMap: '/wood_floor/textures/wood_floor_diff_1k.jpg',
  enableShadows: false,
  showDimensions: true,
  refSrc : "/image.webp"
}; 

const gui = new dat.GUI();

// Add controllers for each property
gui.add(props, 'stepHeight', 0, 10).onChange(updateProps);
gui.add(props, 'stepWidth', 0, 100).onChange(updateProps);
gui.add(props, 'stepDepth', 0, 10).onChange(updateProps);
gui.add(props, 'numSteps', 1, 20).step(1).onChange(updateProps);
gui.add(props, 'riserThickness', 0, 1).onChange(updateProps);
gui.add(props, 'treadThickness', 0, 1).onChange(updateProps);
gui.add(props, 'nosing', 0, 1).onChange(updateProps);
gui.add(props, 'showProps').onChange(updateProps);
gui.add(props, 'enableShadows').onChange(updateProps);
gui.add(props, 'showDimensions').onChange(updateProps);

// Define a function to handle changes made through dat.gui controllers
const config = new StairConfigurator(props)
function updateProps() {
  config.dispose()
  config.update()
}

// import { StirConfigurator } from "./stairConfigurator/newStyle";

// }
// const configurator = new StirConfigurator("parent");
