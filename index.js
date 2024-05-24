import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

function main() {
  // canvas
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  renderer.setPixelRatio(window.devicePixelRatio * 2); // Increase pixel ratio for higher resolution
  // Adjust antialiasing quality
  renderer.antialias = true;
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;

  // camera
  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 200;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  // orbit controls for camera to move around canvas
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();

  // new scene
  const scene = new THREE.Scene();

  //lights

  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  const directionalLight2 = new THREE.DirectionalLight(color, intensity);
  directionalLight2.position.set(0, 10, -10);
  directionalLight2.rotation.set(0, 180, 0);
  scene.add(directionalLight2);

  // geometry
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  // new instance

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  // initialize cubes

  const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2),
  ];

  //sphere
  const loader = new THREE.TextureLoader();
  const addImage = loader.load("resources/images/sky.jpg");
  addImage.colorSpace = THREE.SRGBColorSpace;

  const sphereGeometry = new THREE.SphereGeometry(5, 10, 10);
  const sphereColor = 0xff00ff;
  const sphereMaterial = new THREE.MeshPhongMaterial({ map: addImage });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(-15, 3, -20);
  scene.add(sphere);

  //cylinder

  const cylinderColor = 0xffc0cb;
  const cylinderGeometry = new THREE.CylinderGeometry(2, 2, 2, 32); // Increase segments for smoother surface
  const cylinderMaterial = new THREE.MeshPhongMaterial({
    color: cylinderColor,
  });
  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  cylinder.position.set(0, 1, -5);
  scene.add(cylinder);

  // Load 3D model

  console.log("hello");

  let cat;

  const mtlLoader = new MTLLoader();
  const objLoader = new OBJLoader();

  mtlLoader.load("resources/models/cat.mtl", function (mtl) {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load("resources/models/cat.obj", function (root) {
      initializeCat(root);
      animate();
    });
  });

  function initializeCat(root) {
    root.position.set(0, 0, 0);
    root.scale.set(0.5, 0.5, 0.5);
    root.rotation.set(0, 180, 0);
    scene.add(root);
    cat = root;
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const clientWidth = canvas.clientWidth;
    const clientHeight = canvas.clientHeight;
    const model =
      canvas.width !== clientWidth || canvas.height !== clientHeight;
    if (model) {
      renderer.setSize(clientWidth, clientHeight, false);
    }
    return model;
  }

  function render(time) {
    time *= 0.001; // convert time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      const aspectRatio = canvas.clientWidth / canvas.clientHeight;
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
    }

    cubes.forEach(function (cube, index) {
      const speed = 1 + index * 0.1;
      const rotation = time * speed;
      cube.rotation.x = rotation;
      cube.rotation.y = rotation;
    });

    if (cat) cat.rotation.y += 0.01;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
