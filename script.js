import * as THREE from './libs/three.module.js';
import { FBXLoader } from 'https://unpkg.com/three@0.150.1/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { AnimationMixer } from 'three';

// ✅ Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// ✅ Camera Setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

// ✅ Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ✅ Lighting
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(2, 3, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

// ✅ Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ✅ Load FBX Character
const fbxLoader = new FBXLoader();
let mixer; // Animation Mixer

fbxLoader.load(
    'assets/character.fbx',
    function (fbx) {
        fbx.scale.set(0.05, 0.05, 0.05);
        fbx.position.set(0, 0, 0);
        scene.add(fbx);

        // ✅ Animation Mixer Setup
        mixer = new THREE.AnimationMixer(fbx);

        // ✅ Load Dance Animation (Using Dance1)
        const animLoader = new FBXLoader();
        animLoader.load('motions/dance1.fbx', function (anim) {
            console.log("Dance animation loaded!");
            const action = mixer.clipAction(anim.animations[0]);
            action.play();
        });

        console.log('✅ FBX Model Loaded:', fbx);
    },
    function (xhr) {
        console.log(`Loading FBX: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    function (error) {
        console.error('❌ Error Loading FBX:', error);
    }
);

// ✅ Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    if (mixer) mixer.update(0.016); // Update animations
    renderer.render(scene, camera);
}
animate();

// ✅ Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
