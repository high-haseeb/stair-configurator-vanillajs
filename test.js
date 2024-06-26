import * as dat from "dat.gui";
import { StairConfigurator } from "./stairConfigurator/stairConfigurator";

const props = {
  sideViewDivId:  "sideveiw",
  topViewDivId:   "topveiw",
  threeVeiwDivId: "3dview",

  stepHeight:     1.87,
  stepWidth:      20,
  stepDepth:      2.5,
  numSteps:       16,
  riserThickness: 0.8,
  treadThickness: 0.5,
  nosing:         0.8,
  showProps:      true,
  showDimensions: true,
  refSrc:         "/image.webp",

  texture:        "/textures/marble.jpg",
  showOutline:    false,
  showGround:     true,
  shadows:        true,
};

const configurator = new StairConfigurator(props);
const gui = new dat.GUI({ name: "config" });
gui.closed = true

var params = {
    loadFile : () => {
   const fileInput =  document.getElementById('textureInput')
    fileInput.click()
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        props.texture = e.target.result
        configurator.three.updateMaterial()
      }
      reader.readAsDataURL(file)
    })
  },
};
gui.add(params, 'loadFile').name('upload texture');
const update = () => configurator.update();

const controllers = [
  { propName: "stepHeight",     min: 1,   max: 10,  step: 0.1, name: "riser height",     onChange: update },
  { propName: "stepWidth",      min: 10,  max: 50,  step: 1,   name: "step width",       onChange: update },
  { propName: "stepDepth",      min: 1,   max: 10,  step: 0.1, name: "individual going", onChange: update },
  { propName: "numSteps",       min: 1,   max: 20,  step: 1,   name: "total steps",      onChange: update },
  { propName: "riserThickness", min: 0.1, max: 0.8, step: 0.1, name: "riser thicknes",   onChange: update },
  { propName: "treadThickness", min: 0.1, max: 1,   step: 0.1, name: "tread thicknes",   onChange: update },
  { propName: "nosing",         min: 0.3, max: 2,   step: 0.1, name: "nosing",           onChange: update },
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
