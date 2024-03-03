import * as dat from "dat.gui";
import { StairConfigurator } from "./stairConfigurator/stairConfigurator";

const props = {
  sideViewDivId: "sideveiw",
  topViewDivId: "topveiw",
  threeVeiwDivId: "3dview",

  stepHeight: 1.87,
  stepWidth: 20,
  stepDepth: 2.5,
  numSteps: 16,
  riserThickness: 0.8,
  treadThickness: 0.5,
  nosing: 0.8,
  showProps: true,
  showDimensions: true,
  refSrc: "/image.webp",

  texture: "/public/textures/marble.jpg",
  showOutline: true,
  showGround: true,
  shadows: true,
};

const configurator = new StairConfigurator(props);
const gui = new dat.GUI({ name: "config" });

/* prettier-ignore */
const update = () => configurator.update();
const controllers = [
  { propName: "stepHeight",     min: 1,   max: 10, step: 0.1, name: "step height",    onChange: update },
  { propName: "stepWidth",      min: 10,  max: 50, step: 1,   name: "step width",     onChange: update },
  { propName: "stepDepth",      min: 1,   max: 10, step: 0.1, name: "step depth",     onChange: update },
  { propName: "numSteps",       min: 1,   max: 20, step: 1,   name: "total steps",    onChange: update },
  { propName: "riserThickness", min: 0.1, max: 1,  step: 0.1, name: "riser thicknes", onChange: update },
  { propName: "treadThickness", min: 0.1, max: 1,  step: 0.1, name: "tread thicknes", onChange: update },
  { propName: "nosing",         min: 0.1, max: 1,  step: 0.1, name: "nosing",         onChange: update },
  { propName: "showProps",      name: "show properties", onChange: update },
  { propName: "showDimensions", name: "show dimensions", onChange: update },
  { propName: "texture",     name: "texture",      onChange: () => configurator.three.updateMaterial() },
  { propName: "showOutline", name: "show outline", onChange: () => configurator.three.updateOutline()  },
  { propName: "showGround",  name: "show ground",  onChange: () => configurator.three.updateGround()   },
  { propName: "shadows",     name: "shadows",      onChange: update },
]
controllers.forEach((ctrl) => {
  const controller = gui.add(props, ctrl.propName, ctrl.min, ctrl.max, ctrl.step);
  controller.name(ctrl.name);
  if (ctrl.onChange) controller.onChange(ctrl.onChange);
});
