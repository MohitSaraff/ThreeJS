import { Controller } from "./controls";
import * as THREE from "three";
import { OrbitControls } from "@three-ts/orbit-controls";
// import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";
import { GUI } from "lil-gui";
// import { Vec3 } from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls"
import "./styles.css";

// SCENE

const world = new CANNON.World();
const axesHelper = new THREE.AxesHelper(15);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);
const cannonDebugger = CannonDebugger(scene, world, {
  color: 0xffff,
});
scene.add(axesHelper);

// DEBUG

const gui: any = new GUI();
const debugObject: any = {};
// const objectsToUpdate: any = [];

gui.add(debugObject, "createChar");

// /WALLS

//north Wall
const wallN = new THREE.Mesh(
  new THREE.BoxGeometry(50, 10, 0.1),
  new THREE.MeshStandardMaterial({
    color: 0x00ff,
    metalness: 0.3,
    roughness: 0.4,
    envMapIntensity: 0.5,
  })
);
wallN.position.set(-25, 5, 0);
wallN.receiveShadow = true;
wallN.rotation.y = Math.PI * 0.5;
scene.add(wallN);
//physics
const wallNShape = new CANNON.Box(new CANNON.Vec3(25, 5, 0.1));
const wallNBody = new CANNON.Body();
wallNBody.mass = 0;
wallNBody.addShape(wallNShape);
wallNBody.position.set(-25, 5, 0);
wallNBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI * 0.5);
world.addBody(wallNBody);

//south wall
const wallS = new THREE.Mesh(
  new THREE.BoxGeometry(50, 10, 0.1),
  new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    metalness: 0.3,
    roughness: 0.4,
    envMapIntensity: 0.5,
  })
);
wallS.position.set(25, 5, 0);
wallS.receiveShadow = true;
wallS.rotation.y = Math.PI * 0.5;
scene.add(wallS);

//physics
const wallSShape = new CANNON.Box(new CANNON.Vec3(25, 5, 0.1));
const wallSBody = new CANNON.Body();
wallSBody.mass = 0;
wallSBody.position.set(25, 5, 0);
wallSBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI * 0.5);
wallSBody.addShape(wallSShape);
world.addBody(wallSBody);

//east wall
const wallE = new THREE.Mesh(
  new THREE.BoxGeometry(10, 50, 0.1),
  new THREE.MeshStandardMaterial({
    color: 0xf0ff0f,
    metalness: 0.3,
    roughness: 0.4,
    envMapIntensity: 0.5,
  })
);
wallE.position.set(0, 5, -25);
wallE.receiveShadow = true;
wallE.rotation.z = Math.PI * 0.5;
scene.add(wallE);

//physics
const wallEShape = new CANNON.Box(new CANNON.Vec3(5, 25, 0.1));
const wallEBody = new CANNON.Body();
wallEBody.mass = 0.5;
wallEBody.position.set(0, 5, -25);
wallEBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI * 0.5);
wallEBody.addShape(wallEShape);
world.addBody(wallEBody);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.BoxGeometry(50, 50, 0.01),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(5, 5, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// CONTROLS
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.minDistance = 5;
orbit.enableDamping = true;
orbit.maxDistance = 50;
orbit.enablePan = false;
orbit.maxPolarAngle = Math.PI / 2 - 0.05;
orbit.update();

const orbit2 = new OrbitControls(camera, renderer.domElement);
orbit2.minDistance = 7;
orbit2.enableDamping = true;
orbit2.maxDistance = 50;
orbit2.enablePan = false;
orbit2.maxPolarAngle = Math.PI / 2 - 0.05;
orbit2.update();

// const controls = new FirstPersonControls( camera, renderer.domElement );
// 				controls.movementSpeed = 150;
// 				controls.lookSpeed = 0.1;



// LIGHTS
light();
// MODEL WITH ANIMATIONS
var characterControls: Controller;
let Avatar: string = "Soldier.glb"
new GLTFLoader().load(
  Avatar,
  function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
      if (object.isMesh) object.castShadow = true;
    });
    scene.add(model);

    const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap: Map<string, THREE.AnimationAction> = new Map();
    gltfAnimations
      .filter((a) => a.name != "TPose")
      .forEach((a: THREE.AnimationClip) => {
        animationsMap.set(a.name, mixer.clipAction(a));
      });

    characterControls = new Controller(
      model,
      mixer,
      animationsMap,
      orbit as any,
      camera,
      "Idle"
    )
    // var xformControl = new TransformControls(camera, renderer.domElement);
    // scene.add(xformControl);
    // // assuming you add "myObj" to your scene...
    // xformControl.attach(model);
    // // and then later...
  }
);



// new GLTFLoader().load(
//   "Sofa.glb",
//   function (gltf) {
//     const model = gltf.scene;
//     model.traverse(function (object: any) {
//       if (object.isMesh) object.castShadow = true;
//     });
//     scene.add(model);
//     model.scale.set(0.5,0.5,0.5)
//       }
//     );

// CONTROL
const keysPressed = {};
document.addEventListener(
  "keydown",
  (event) => {
    if (event.shiftKey && characterControls) {
      characterControls.switchRunToggle();
    } else {
      (keysPressed as any)[event.key.toLowerCase()] = true;
    }
  },
  false
);
document.addEventListener(
  "keyup",
  (event) => {
    (keysPressed as any)[event.key.toLowerCase()] = false;
  },
  false
);

// const createChar = (
//   position: THREE.Vector3 | CANNON.Vec3
// ) => {
//   // Three.js mesh
//   scene.add(character as unknown as THREE.Object3D<Event>);

//   // Cannon.js body
//   const body = character as CANNON.Body;
//   // body.position.copy(position as Vec3);
//   // world.addBody(body);

//   // Save in objects
//   objectsToUpdate.push({ character, body });
// };

// createChar(new THREE.Vector3(0, 0, 0));

const clock = new THREE.Clock();

// ANIMATE
function animate() {
  let mixerUpdateDelta = clock.getDelta();
  if (characterControls) {
    characterControls.update(mixerUpdateDelta, keysPressed);
  }
  // let position = camera.position
  //console.log(position)
  cannonDebugger.update();
  orbit.update();
  // controls.update( clock.getDelta() );
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();

// RESIZE HANDLER
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

function light() {
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-60, 100, -10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 50;
  dirLight.shadow.camera.bottom = -50;
  dirLight.shadow.camera.left = -50;
  dirLight.shadow.camera.right = 50;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 200;
  dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;
  scene.add(dirLight);
}
