# Stair Configurator

## Props

1. `sideViewDivId` (string): The ID of the HTML element where the side view of the stairs will be rendered.
2. `topViewDivId` (string): The ID of the HTML element where the top view of the stairs will be rendered.
3. `threeViewDivId` (string): The ID of the HTML element where the 3D view of the stairs will be rendered.
4. `stepHeight` (number): The height of each step in meters.
5. `stepWidth` (number): The width of each step in meters.
6. `stepDepth` (number): The depth of each step in meters.
7. `numSteps` (number): The total number of steps in the staircase.
8. `riserThickness` (number): The thickness of the vertical riser of each step in meters.
9. `treadThickness` (number): The thickness of the horizontal tread of each step in meters.
10. `nosing` (number): The protrusion of the nosing of each step in meters.
11. `showProps` (boolean): Whether to display measurement annotations on the side view of the stairs.
12. `riserMaterialMap` (string): The URL of the texture map for the riser material.
13. `treadMaterialMap` (string): The URL of the texture map for the tread material.
14. `enableShadows` (boolean): Whether to enable shadows in the 3D view of the stairs.

## Usage

To use the StairConfigurator component, import it from the provided module and instantiate it with the props object as shown below:

```javascript
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
