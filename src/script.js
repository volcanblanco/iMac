import * as dat from 'lil-gui'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";


import './style.scss'
import gsap from 'gsap'

const buttons = Array.from(document.querySelectorAll('.buttons button'))

/**
 * Base
 */
// const gui = new dat.GUI({
//     width: 400,
// })
// gui.close()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()

/**
 * Loaders
 */

// GLTF loader
const gltfLoader = new GLTFLoader()
/**
 * Object
 */

let studioBg
let iMac

const cubeTexture = new THREE.CubeTextureLoader().load( [
  'env/px.png', 
  'env/nx.png', 
  'env/py.png', 
  'env/ny.png', 
  'env/pz.png', 
  'env/nz.png'
]);
cubeTexture.mapping = THREE.CubeRefractionMapping;
console.log(cubeTexture)

let areModelsLoaded = false

let waterMaterial = new THREE.MeshPhongMaterial({ 
  color: 0xffffff, 
  envMap: cubeTexture, 
  refractionRatio: 0.3,
  reflectivity: 1,
  transparent: true,
  opacity: .6
});

gltfLoader.load('iMac.glb', (gltf) => {

  const model = gltf.scene

  iMac = model

  iMac.scale.set(.07,.07,.07)
  iMac.position.x = 4.0
  iMac.position.y = -.35
  iMac.rotation.set(0,3.5,0)
  scene.add(iMac)
  
  iMac.traverse(function(child){
    if(child.isMesh){
      child.receiveShadow = true
    }
  })

  new TWEEN.Tween(iMac.position)
          .to({x: 0}, 4000)
          .easing(TWEEN.Easing.Quartic.Out)
          .onComplete(()=>{})
          .start()

  new TWEEN.Tween(iMac.rotation)
          .to({y: -9.75}, 4000)
          .easing(TWEEN.Easing.Quartic.Out)
          .onComplete(()=>{})
          .start()

}, (xhr) => {
  console.log((xhr.loaded / xhr.total) * 100 + '% studio BG loaded')
}, (error) => {
  console.log(error)
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

controls.minPolarAngle = -Math.PI / 2
controls.maxPolarAngle = Math.PI / 2

controls.maxZoom = 1.0
controls.minZoom = .1

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
scene.background = cubeTexture

const directionalLight = new THREE.DirectionalLight("#FFFFFF", 0.83)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 4096
directionalLight.shadow.mapSize.height = 4096
directionalLight.position.set( -10, 20, 10 )
directionalLight.shadow.camera.top = 10
directionalLight.shadow.camera.bottom = -10
directionalLight.shadow.camera.left = -10
directionalLight.shadow.camera.right = 10
scene.add(directionalLight)

// gui.add(directionalLight, "intensity").min(0).max(5).step(.01).name('directional light intensity').onChange((e)=>{
//   directionalLight.intensity = e
// })

// gui.addColor(directionalLight, "color").min(0).max(5).step(.01).name('directional color').onChange((e)=>{
//   directionalLight.color = e
// })

// const helper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(helper)

const ambientLight = new THREE.AmbientLight("#ffffff", 0.54)
scene.add(ambientLight)

// gui.add(ambientLight, 'intensity').min(0).max(5).step(.01).name('ambient intensity').onChange((e)=>{
//   ambientLight.intensity = e
// })

// gui.addColor(ambientLight, "color").name('Ambient Light Color').onChange((e)=>{
//   ambientLight.color = e
// })

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    TWEEN.update();

    // Render
    renderer.render(scene, camera)
}

tick()