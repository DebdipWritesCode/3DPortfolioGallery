import { GLTFLoader, PointerLockControls } from "three-stdlib";
import "./style.css";
import * as THREE from "three";
import { paintingData } from "./data";

//Audio
const bgAudio = new Audio("./audio/bg.mp3");
bgAudio.loop = true;
bgAudio.volume = 0.3;

const scene = new THREE.Scene();

// Camera(fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

scene.add(camera);
camera.position.z = 10; // Move the camera back
camera.position.y = 10; // Move the camera up

// Renderer (canvas)
const renderer = new THREE.WebGLRenderer({
  antialias: true, // Smooth edges
});
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
renderer.setClearColor("#ffffff", 0.1); // Background color

// Create a cube
document.body.appendChild(renderer.domElement);

//Lights
let ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light( color, intensity )
scene.add(ambientLight);

// let sunLight = new THREE.DirectionalLight(0xffffff, 2); // White light( color, intensity )
// sunLight.position.set(10, 10, 10); // x, y, z
// scene.add(sunLight);

//Geometry
// let geometry = new THREE.BoxGeometry(2, 2, 2); // Width, height, depth
// let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
// let cube = new THREE.Mesh(geometry, material); // Combine geometry and material
// scene.add(cube);

// Texture of the floor
let floorTexture = new THREE.TextureLoader().load("./images/TestCeiling.avif");

// Create the floor plane
let planeGeometry = new THREE.PlaneGeometry(80, 60); // Width, height, width segments?, height segments?
let planeMaterial = new THREE.MeshLambertMaterial({
  map: floorTexture, // Texture
  side: THREE.DoubleSide,
}); // Green color and double side material
let floorPlane = new THREE.Mesh(planeGeometry, planeMaterial); // Combine geometry and material

floorPlane.rotation.x = Math.PI / 2; // Rotate the plane on the x-axis
floorPlane.position.y = -Math.PI; // Move the plane down

scene.add(floorPlane); // Add the plane to the scene

//Create the walls
const wallGroup = new THREE.Group(); // Create a group for the walls

//Create wall materials with realistic color and texture
const wallTexture = new THREE.TextureLoader().load("./images/wall.jpg");
wallTexture.wrapS = THREE.RepeatWrapping; // Repeat the texture horizontally
wallTexture.wrapT = THREE.RepeatWrapping; // Repeat the texture vertically
wallTexture.repeat.set(1, 1); // Repeat the texture 1 time horizontally and 1 time vertically

//Front wall
const frontWall = new THREE.Mesh(
  new THREE.BoxGeometry(80, 65, 0.001), // Width, height, depth
  new THREE.MeshLambertMaterial({ map: wallTexture }) // Texture material with realistic color
);
frontWall.position.z = -30; // Move the wall back
wallGroup.add(frontWall); // Add the front wall to the group

//Left Wall
const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(80, 65, 0.001), // Width, height, depth
  new THREE.MeshLambertMaterial({ map: wallTexture }) // Texture material with realistic color
);

leftWall.rotation.y = Math.PI / 2; // Rotate the wall on the y-axis
leftWall.position.x = -40; // Move the wall to the left
wallGroup.add(leftWall); // Add the left wall to the group

//Right Wall
const rightWall = new THREE.Mesh(
  new THREE.BoxGeometry(80, 65, 0.001), // Width, height, depth
  new THREE.MeshLambertMaterial({ map: wallTexture }) // Texture material with realistic color
);

rightWall.rotation.y = -Math.PI / 2; // Rotate the wall on the y-axis
rightWall.position.x = 40; // Move the wall to the right
wallGroup.add(rightWall); // Add the right wall to the group

//Back Wall
const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(80, 65, 0.001), // Width, height, depth
  new THREE.MeshLambertMaterial({ map: wallTexture }) // Texture material with realistic color
);

backWall.position.z = 30; // Move the wall back
wallGroup.add(backWall); // Add the back wall to the group

scene.add(wallGroup); // Add the group to the scene

// Create the ceiling
const ceilingTexture = new THREE.TextureLoader().load("./images/ceiling.jpg"); // Load the ceiling texture

const ceilingGeometry = new THREE.PlaneGeometry(80, 60); // Width, height, width segments?, height segments?
const ceilingMaterial = new THREE.MeshLambertMaterial({ map: ceilingTexture }); // Texture material with realistic color
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial); // Combine geometry and material

ceiling.rotation.x = Math.PI / 2; // Rotate the ceiling on the x-axis
ceiling.position.y = 30; // Move the ceiling up

scene.add(ceiling); // Add the ceiling to the scene

//Loop through the walls and add bounding box
for (let i = 0; i < wallGroup.children.length; i++) {
  wallGroup.children[i].BBox = new THREE.Box3();
  wallGroup.children[i].BBox.setFromObject(wallGroup.children[i]);
}

function createPainting(imageURL, width, height, position) {
  const textureLoader = new THREE.TextureLoader();
  const paintingImage = textureLoader.load(imageURL);
  const paintingMaterial = new THREE.MeshBasicMaterial({
    map: paintingImage,
  });
  const painting = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    paintingMaterial
  );
  painting.position.set(position.x, position.y, position.z);
  return painting;
}

const paintingsGroup = new THREE.Group();
const paintingPositions = ["front", "left", "right", "back"];
const paintingImages = [
  "./artworks/2.png",
  "./artworks/1.png",
  "./artworks/3.png",
  "./artworks/3.jpg",
  "./artworks/4.png",
  "./artworks/5.jpg",
  "./artworks/6.jpg",
  "./artworks/7.jpg",
  "./artworks/8.jpg",
  "./artworks/9.png",
  "./artworks/10.jpg",
];

// Lights for paintings
const lightsGroup = new THREE.Group();
scene.add(lightsGroup);
function addLightAbovePainting(painting) {
  const light = new THREE.PointLight(0xffffff, 250, 70); // White light (color, intensity, distance)
  light.castShadow = true; // Enable shadow casting
  light.position.set(
    painting.position.x,
    painting.position.y + 2,
    painting.position.z
  ); // Position above the painting
  lightsGroup.add(light);
}

for (let pos of paintingPositions) {
  if (pos == "front") {
    let xPos = -25;
    for (let i = 0; i < 3; i++) {
      const painting = createPainting(
        paintingImages[i],
        15,
        13,
        new THREE.Vector3(xPos, 13, -29.5)
      );
      paintingsGroup.add(painting);
      addLightAbovePainting(painting);
      xPos += 25;
    }
  } else if (pos == "left") {
    let zPos = -12;
    for (let i = 4; i < 6; i++) {
      const painting = createPainting(
        paintingImages[i],
        15,
        15,
        new THREE.Vector3(-39.5, 13, zPos)
      );
      painting.rotation.y = Math.PI / 2;
      paintingsGroup.add(painting);
      addLightAbovePainting(painting);
      zPos += 25;
    }
  } else if (pos == "right") {
    let zPos = -12;
    for (let i = 6; i < 8; i++) {
      const painting = createPainting(
        paintingImages[i],
        15,
        8,
        new THREE.Vector3(39.5, 13, zPos)
      );
      painting.rotation.y = -Math.PI / 2;
      paintingsGroup.add(painting);
      addLightAbovePainting(painting);
      zPos += 25;
    }
  } else if (pos == "back") {
    let xPos = -25;
    for (let i = 8; i < 11; i++) {
      const painting = createPainting(
        paintingImages[i],
        15,
        18, // Width, height
        new THREE.Vector3(xPos, 13, 29.5)
      );
      painting.rotation.y = Math.PI;
      paintingsGroup.add(painting);
      addLightAbovePainting(painting);
      xPos += 25;
    }
  }
}

scene.add(paintingsGroup);

//Painting Info
function displayPaintingInfo(info) {
  const paintingInfoDiv = document.querySelector(".painting-info");
  paintingInfoDiv.innerHTML = `
    <h2>${info.title}</h2>
    <p>${info.description}</p>
  `;
  paintingInfoDiv.style.display = "block";
}

function hidePaintingInfo() {
  const paintingInfoDiv = document.querySelector(".painting-info");
  paintingInfoDiv.style.display = "none";
}

//Raycaster for proximity detection
const raycaster = new THREE.Raycaster();
const infoDistance = 15; // Distance to show painting info

function checkProximity() {
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera); // Cast ray from camera center

  const intersects = raycaster.intersectObjects(paintingsGroup.children, true); // Check for intersections with paintings group intersectObjects(objects, recursive)

  if (intersects.length > 0) {
    const closestPainting = intersects[0].object;
    const distance = intersects[0].distance;

    if (distance < infoDistance) {
      const paintingIndex = paintingsGroup.children.indexOf(closestPainting);
      displayPaintingInfo(paintingData[paintingIndex]);
    } else {
      hidePaintingInfo();
    }
  } else {
    hidePaintingInfo();
  }
}

// Controls
const controls = new PointerLockControls(camera, document.body);

// Hide Menu
function hideMenu() {
  const backgroundMenu = document.getElementById("background_menu");
  backgroundMenu.style.display = "none";
}

// Show Menu
function showMenu() {
  const backgroundMenu = document.getElementById("background_menu");
  backgroundMenu.style.display = "flex";
}

// Lock the pointer (controls are activated) and hide menu on click
function startExperience() {
  bgAudio.play();
  controls.lock();
  hideMenu();
}

const playBtn = document.getElementById("play-btn");
playBtn.addEventListener("click", startExperience);

controls.addEventListener("unlock", () => {
  showMenu();
});

function checkCollision() {
  const playerBoundingBox = new THREE.Box3(); // Create a new bounding box for the player
  const cameraWorldPosition = new THREE.Vector3(); // Create a new vector for the camera position

  camera.getWorldPosition(cameraWorldPosition); // Get the camera position and set it to the vector The camera represents the player's position
  playerBoundingBox.setFromCenterAndSize(
    //setFromCenterAndSize(center, size) is a method that sets the bounding box to the center and size of the object
    cameraWorldPosition,
    new THREE.Vector3(1, 1, 1)
  );

  for (let i = 0; i < wallGroup.children.length; i++) {
    const wall = wallGroup.children[i];
    if (playerBoundingBox.intersectsBox(wall.BBox)) {
      return true;
    }
  }
  return false;
}

const loader = new GLTFLoader();
loader.load(
  "./models/plants.glb",
  (gltf) => {
    const plantModel = gltf.scene;
    scene.add(plantModel);

    plantModel.scale.set(60, 60, 60);
    plantModel.position.set(30, -3, -26);
  },
  undefined,
  (error) => {
    console.error(error);
  }
); // Called when loading is in progress loader.load( url, onLoad, onProgress, onError )

loader.load(
  "./models/plants.glb",
  (gltf) => {
    const plantModel = gltf.scene;
    scene.add(plantModel);

    plantModel.scale.set(60, 60, 60);
    plantModel.position.set(30, -3, 26);
  },
  undefined,
  (error) => {
    console.error(error);
  }
); // Called when loading is in progress loader.load( url, onLoad, onProgress, onError )

loader.load(
  "./models/plants.glb",
  (gltf) => {
    const plantModel = gltf.scene;
    scene.add(plantModel);

    plantModel.scale.set(60, 60, 60);
    plantModel.position.set(-30, -3, 26);
  },
  undefined,
  (error) => {
    console.error(error);
  }
); // Called when loading is in progress loader.load( url, onLoad, onProgress, onError )

loader.load(
  "./models/ceiling_light.glb",
  (gltf) => {
    const ceilingLightModel = gltf.scene;
    scene.add(ceilingLightModel);

    ceilingLightModel.scale.set(10, 10, 10); // Scale the model (x, y, z)
    ceilingLightModel.position.set(-20, 24, 0); // Position the model (x, y, z)
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

loader.load(
  "./models/ceiling_light.glb",
  (gltf) => {
    const ceilingLightModel = gltf.scene;
    scene.add(ceilingLightModel);

    ceilingLightModel.scale.set(10, 10, 10); // Scale the model (x, y, z)
    ceilingLightModel.position.set(20, 24, 0); // Position the model (x, y, z)
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

loader.load(
  "./models/ceilingDecor.glb",
  (gltf) => {
    const ceilingDecor = gltf.scene;
    scene.add(ceilingDecor);

    const light = new THREE.PointLight(0xffffff, 180, 30); // White light (color, intensity, distance)
    light.position.set(0, 24, 0); // Position above the decoration
    lightsGroup.add(light);

    ceilingDecor.scale.set(20, 20, 20); // Scale the model (x, y, z)
    ceilingDecor.position.set(0, 24, 0); // Position the model (x, y, z)
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

loader.load(
  "./models/bench.glb",
  (gltf) => {
    const bench = gltf.scene;
    scene.add(bench);

    bench.scale.set(15, 15, 15); // Scale the model (x, y, z)
    bench.position.set(-20, 0, 0); // Position the model (x, y, z)
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

document.addEventListener("keydown", (e) => {
  let clickedKey = e.key;
  const previousCameraPosition = camera.position.clone();

  // Check for Alt + G
  if (e.altKey && clickedKey.toLowerCase() === "g") {
    window.open("https://github.com/DebdipWritesCode", "_blank");
    return; // Exit early so no further key handling is done
  }

  if (e.altKey && clickedKey.toLowerCase() === "l") {
    window.open("https://www.linkedin.com/in/debdip-mukherjee404/", "_blank");
    return; // Exit early so no further key handling is done
  }

  if (e.altKey && clickedKey.toLowerCase() === "x") {
    window.open(
      "https://x.com/DebdipMukherje4?t=TINqiNLZXjcBFs1Bzjj8qw&s=09",
      "_blank"
    );
    return; // Exit early so no further key handling is done
  }

  if (e.altKey && clickedKey.toLowerCase() === "m") {
    window.open("mailto:debdipmukherjee52@gmail.com", "_blank");
    return; // Exit early so no further key handling is done
  }

  switch (clickedKey) {
    case "w":
    case "ArrowUp":
      e.preventDefault();
      controls.moveForward(1.0);
      break;
    case "s":
    case "ArrowDown":
      e.preventDefault();
      controls.moveForward(-1.0);
      break;
    case "d":
    case "ArrowRight":
      e.preventDefault();
      controls.moveRight(1.0);
      break;
    case "a":
    case "ArrowLeft":
      e.preventDefault();
      controls.moveRight(-1.0);
      break;
    default:
      break;
  }

  if (checkCollision()) {
    camera.position.copy(previousCameraPosition);
  }
});

// Animation
const renderLoop = function () {
  // cube.rotation.x += 0.005; // Rotate the cube on the x-axis
  // cube.rotation.y += 0.005; // Rotate the cube on the y-axis

  //Raycaster for proximity detection
  checkProximity();
  //Render
  renderer.render(scene, camera); // Render the scene with the camera
  requestAnimationFrame(renderLoop); // Call the render loop
};

// Call the render loop
renderLoop();
