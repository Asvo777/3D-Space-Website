import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


//WEBSITE


const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting && entry.bottom > 0 && entry.top > 0) {
      entry.target.classList.add('show');
      entry.target.classList.remove('hide');
    }
  });
});

const hiddenElements = document.querySelectorAll(".hide");
hiddenElements.forEach((el) => observer.observe(el));

//ANIMATED 3D BACKGROUND


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z  = 10;

renderer.render(scene,camera);

const geometry = new THREE.SphereGeometry(1, 32, 32);
const moonTexture = new THREE.TextureLoader().load('https://public-files.gumroad.com/swfpmx3szd2bbajccgfv04lv2e4m');
const material = new THREE.MeshStandardMaterial({map: moonTexture});
const moon = new THREE.Mesh(geometry, material);
moon.position.set(30,0.7,30)
scene.add(moon);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,0,0);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);
// hi
const gridHelper = new THREE.GridHelper(200,50);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24 , 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('https://blenderartists.org/uploads/default/optimized/4X/7/e/2/7e2d7bea4ac21388c4a96e1371f375c4ce00094b_2_1024x576.jpg');
scene.background = spaceTexture;

const jeffTexture = new THREE.TextureLoader().load('Asvo777/3D-Space-Website/public/img/jeff.png');
const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: jeffTexture}),
);
//scene.add(jeff);

const earthTexture = new THREE.TextureLoader().load('https://static.wikia.nocookie.net/7e70da43-c141-4541-b49d-2ee513736a2e/scale-to-width/755');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 32),
  new THREE.MeshStandardMaterial({map: earthTexture}),
);


earth.position.set(0,0,0);
earth.rotation.z = 0.2;
earth.rotation.x = 0.15;
scene.add(earth);

var rect = document.querySelector("#moon-fact-1");
var rrect = rect.getBoundingClientRect();

let t;
function moveCamera() {
  t = document.body.getBoundingClientRect().top;
  earth.rotation.y += 0.045;
  console.log(t);
  console.log(camera.position)
  camera.position.x = t * -0.0042;
  if(t < -7400){
    camera.position.y = (t + 7400) * -0.004 +0.74;
  } else {
    camera.position.y = t * -0.0001
  }
  camera.position.z = t * -0.003  + 10;
  console.log("Div coordinate: " + rrect.bottom)
}

document.body.onscroll = moveCamera;

var isMoonOrbitfirstHalf = true

function animate() {
  requestAnimationFrame(animate);

  moon.rotation.y -= 0.0005;

  if (t < -7200) {
    if (isMoonOrbitfirstHalf) {
      moon.position.x -= 0.01;
      //moon.position.y = Math.pow(1800 - (Math.pow(moon.position.x,2)),1/2)
      moon.position.z = Math.pow(1800 - (Math.pow(moon.position.x,2)),1/2)

      if(moon.position.x <= -42.42){
        isMoonOrbitfirstHalf = false;
      }
    } else {
      moon.position.x += 0.01;
      //moon.position.y = -1*(Math.pow(1800 - (Math.pow(moon.position.x,2)),1/2))
      moon.position.z = -1*(Math.pow(1800 - (Math.pow(moon.position.x,2)),1/2))
      
      if(moon.position.x >= 42.42){
        isMoonOrbitfirstHalf = true;
      }
    }
  } else {
    moon.position.x = 30;
    moon.position.y = 0.7;
    moon.position.z = 30;
    isMoonOrbitfirstHalf = true;
  }
  
  earth.rotation.y += 0.005;
  
  controls.update();
  
  renderer.render(scene, camera);
}





animate();
