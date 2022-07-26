import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import cursorFragmentShader from './shaders/water/cursor.glsl'
import cursorVertexShader from './shaders/water/vertexCursor.glsl'
import Stats from 'stats-js'
import { gsap } from 'gsap'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {GlitchPass} from 'three/examples/jsm/postprocessing/GlitchPass'
import {DotScreenPass} from 'three/examples/jsm/postprocessing/DotScreenPass'

import { Canvas } from 'glsl-canvas-js';
// import { MSC_TRANSCODER } from 'three/examples/js/libs/basis/msc_basis_transcoder.js';

// Canvas
const canvas = document.querySelector('canvas.webgl')

const backgroundMusic = new Audio('/sounds/music.mp3')
backgroundMusic.currentTime = 0
backgroundMusic.loop = true

// backgroundMusic.addEventListener('ended', function() {
//     setTimeout(() => backgroundMusic.play(), 2000);
//  });


const hitSound = new Audio('/sounds/hit.mp3')
// hitSound.volume = Math.random()

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

const soundObject = {
    playMusic: false,
    amplitude: 7,
}

const musicCanvas = document.querySelector('.music');
const ctx = musicCanvas.getContext('2d')
const soundDiv = document.querySelector('.sound');
soundDiv.addEventListener('click', () => {
    soundObject.playMusic = !soundObject.playMusic
    soundObject.amplitude = soundObject.playMusic ? 10 : 5
    backgroundMusicPlay()
    // if(soundObject.playMusic){
    //     soundObject.playMusic = false;
    // } else {
    //     soundObject.playMusic = true;
    // }
})

let x = 0;
let y = 0;
let step = 0
const width = ctx.canvas.width;
const height = ctx.canvas.height;

ctx.strokeStyle = 'white';


const drawSin = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    step += 5

    while (x < height) {
        y = width/2 + soundObject.amplitude * Math.sin((soundObject.amplitude*x + step) / 90);
        ctx.lineTo(x, y);
        x++;
    }

    x = 0

    ctx.stroke();
}

drawSin()


const backgroundMusicPlay = () => {
    if(soundObject.playMusic) {
     //   backgroundMusic.currentTime = 0
        backgroundMusic.play()
    } else {
        backgroundMusic.pause()
    }
}

const generateHit = () => {
    if(soundObject.playMusic) hitSound.play()
}

// Scene
const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})

// const musicCanvas = document.querySelector('.music')
// const options = {
//     vertexString: `...`,
//     fragmentString: `...`,
//     alpha: false,
//     antialias: true,
//     mode: 'flat',
//     extensions: ['EXT_shader_texture_lod']
//   };
//   const glsl = new Canvas(canvas, options);



let sceneReady = false
const loadingBarElement = document.querySelector('.loading-bar')
const loadingManager = new THREE.LoadingManager(
    //Loaded
    () => {
        window.setTimeout(() =>
        {
            // Animate overlay
            gsap.to(overlay.material.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

            // Update loadingBarElement
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
        }, 500);

        window.setTimeout(() =>
        {
            sceneReady = true
        }, 2000);
    },
    //Process
    (itemUrl, itemsLoaded, itemsTotal) => {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)

const ktx2Loader = new KTX2Loader(loadingManager);
ktx2Loader.detectSupport( renderer );

const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);

const cursorNormal = textureLoader.load('textures/cursorNormal1.jpg')
const cursorWhite = textureLoader.load('textures/cursorWhite1.jpg')

const mobile = window.screen.width > 768 ? false : true

const stats = Stats()
document.body.appendChild(stats.dom)

const snow = textureLoader.load('/textures/snow.png')

const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms:{
        uTime: { value: 0 },
    },
    side: THREE.DoubleSide
})

const cursorMaterial = new THREE.MeshStandardMaterial({
    map: cursorNormal,
    transparent: true,
    alphaMap: cursorWhite,
    aoMap: cursorNormal,
    aoMapIntensity: 20
})




//Loaders

const js = textureLoader.load('textures/js1.jpg')
const html = textureLoader.load('textures/html2.jpg')
const css = textureLoader.load('textures/css.jpg')
const vue = textureLoader.load('textures/vue.jpg')
const react = textureLoader.load('textures/react.jpg')
const sql = textureLoader.load('textures/sql.jpg')
const ts = textureLoader.load('textures/ts.jpg')
const redux1 = textureLoader.load('textures/redux1.jpg')
const threejs = textureLoader.load('textures/3js.jpg')
const sass = textureLoader.load('textures/sass.jpg')
const node = textureLoader.load('textures/node.jpg')
const es6 = textureLoader.load('textures/es6.jpg')
const mongo = textureLoader.load('textures/mongo.jpg')

const images = [js, ts, css, vue, react, redux1, sql, threejs, sass, node, es6, mongo, html]

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}


const pl = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(6,2.5,512),
    waterMaterial
)

pl.rotation.y = -1.445
pl.position.set(-1.354, 0, -1.4)

gui.add(pl.position, 'x').min(-2).max(0).step(0.001).name('PlaneX')
gui.add(pl.position, 'y').min(-7).max(7).step(0.001).name('Planey')
gui.add(pl.position, 'z').min(-7).max(7).step(0.001).name('Planez')
gui.add(pl.rotation, 'x').min(-2).max(2).step(0.001).name('RPlaneX')
gui.add(pl.rotation, 'y').min(-2).max(2).step(0.001).name('RPlaney')
gui.add(pl.rotation, 'z').min(-7).max(7).step(0.001).name('RPlanez')

scene.add(pl)

//Overlay
const overlay = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2,2,1,1),
    new THREE.ShaderMaterial({
        uniforms: {
            uAlpha: { value: 1 }
        },
        transparent: true,
        vertexShader: `
            void main(){
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uAlpha;
            void main(){
                gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
            }
        `,
        side: THREE.DoubleSide
    }) 
)

scene.add(overlay)



const bodyBaseTex = ktx2Loader.load( 'textures/bot/body_base.ktx2' );
const bodyEmissiveTex = ktx2Loader.load( 'textures/bot/body_emissive.ktx2' );
const bodyNormalTex = ktx2Loader.load( 'textures/bot/body_normal.ktx2' );
const bodyPBRTex = ktx2Loader.load( 'textures/bot/body_pbr.ktx2' );
bodyNormalTex.anisotropy = 28;

const detailsBaseTex = ktx2Loader.load( 'textures/bot/details_base.ktx2' );
const detailsNormalTex = ktx2Loader.load( 'textures/bot/details_normal.ktx2' );
const detailsPBRTex = ktx2Loader.load( 'textures/bot/details_pbr.ktx2' );

const detailsMaterial = new THREE.MeshStandardMaterial({
    map: detailsBaseTex,
    normalMap: detailsNormalTex,
    roughnessMap: detailsPBRTex,
    metalnessMap: detailsPBRTex,
    roughness: 0.8,
    metalness: 11.3,
});

const bodyMaterial = new THREE.MeshStandardMaterial({
    map: bodyBaseTex,
    aoMap: bodyEmissiveTex,
    emissiveMap: bodyEmissiveTex,
    normalMap: bodyNormalTex,
    roughnessMap: bodyPBRTex,
    metalnessMap: bodyPBRTex,
    roughness: 0.8,
    metalness: 11.3,
    emissiveIntensity: 2,
    emissive: 0xffffff,
});




let mixer = null;

gltfLoader.load(
    'models/bot/model.glb',
    (gltf) => {
        gltf.scene.scale.set(0.8, 0.8, 0.8)
        gltf.scene.position.set(-0.021,-3.54, -1.112)
        gltf.scene.rotation.set(0,-1.452, 0)

        gui.add(gltf.scene.position, 'x').min(-3).max(3).step(0.001).name('Gpositionx')
        gui.add(gltf.scene.position, 'y').min(-7).max(7).step(0.001).name('Gpositiony')
        gui.add( gltf.scene.position, 'z').min(-7).max(7).step(0.001).name('Gpositionz')

        gltf.scene.traverse((child) => {
            if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
                if(child.name === 'Body'){
                    child.material = bodyMaterial
                    child.material.skinning = true;
                }

                else if( child.name === 'Small_Details' || child.name === 'Small_Details001' ) {
                     child.material = detailsMaterial
                     child.material.skinning = true;
                 }

                 else if( child.name.indexOf('Picture') !== -1 ) {
                    
                    child.bindMode='detached'
                    child.frustumCulled = false
                    child.position.y=4.3
                    child.position.z=-12.0
                    child.position.x=1
                    child.rotation.y= Math.PI/2.15

                    if (child.name === 'Big_Picture') {
                        child.material = new THREE.MeshStandardMaterial({
                            map: react,
                            // alphaMap: images[random],
                            aoMap: react,
                            aoMapIntensity: 20,
                        });
                    }else if(child.name === 'Picture028'){
                        child.material = new THREE.MeshStandardMaterial({
                            map: js,
                            // alphaMap: images[random],
                            aoMap: js,
                            aoMapIntensity: 20,
                        })
                    } else {
                        const random = randomInteger(0, images.length - 1);
                        child.material = new THREE.MeshStandardMaterial({
                            map: images[random],
                            // alphaMap: images[random],
                            aoMap: images[random],
                            aoMapIntensity: 20,
                        });
                    }
                    child.material.skinning = true;
                    child.skeleton.bones.forEach(bone => {
                       bone.position.z+= 0.00001
                    })
                 }

                 else if( child.name.indexOf('Plane_Project') !== -1 ) {  
                    child.visible = false
                 }

                else {
                    if(child.name.indexOf('Cursor_L') !== -1) {        
                     if(mobile){
                        child.visible = false
                     } else {
                        child.material = cursorMaterial 
                     child.bindMode='detached'
                     child.frustumCulled = false
                     child.position.y=4.3
                     child.position.z=-12.2
                     child.position.x=1
                     child.rotation.y= Math.PI/2.15
                     child.material.skinning = true;
                     }
                     }
                 else if(child.name !== 'Floor' && child.name !== 'Interface_Plane001' ) {
                         child.material = new THREE.MeshStandardMaterial( { color: 'black', wireframe: true});
                         child.material.skinning = true;
                        
                } else {
                    child.visible=false
                }     
                }
                child.material.needsUpdate = true;

            };
        })

        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[1])

        action.play();

        gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation')
        gui.add(gltf.scene.position, 'y').min(-10).max(10).step(0.001).name('positionY')
        scene.add(gltf.scene)
    }
)

// gui.hide()

const ambient = new THREE.AmbientLight(0x07070C, 1.0);
        const point1 = new THREE.PointLight(0xffffff);
        const point2 = new THREE.PointLight(0xffffff);
        const point3 = new THREE.PointLight('red');
        const direction = new THREE.DirectionalLight(0xffffaa, 1.5);
        const pointPurple = new THREE.PointLight(0xA849F3);
        scene.add(
        //   point1,
             // point2,
               point3, 
              direction,
                pointPurple,
                ambient
                )

        point1.intensity = 0.8;
        direction.position.set(-0.8,-0.5,-1.5)
        point2.intensity = 0.55;
        point3.intensity = 0.5;
        pointPurple.intensity = 0.8;
        point1.position.set(0, 2.6, -4.3);
        point2.position.set(-1.5,2.5,-4.3);
        // point3.position.set(-1.5,1.7,-3.2);
        // pointPurple.position.set(-1.2, 1.7,-3.5);

         point3.position.set(-1.5,1.164,-3.2);
        pointPurple.position.set(-1.04,0.45,-2.48);
    
const light1 = new THREE.PointLight(0x5BFFFF, 1.5, 0.13);
light1.position.set(-0.31, 0.3, -5.36);
//scene.add(light1)
gui.hide()



const light2 = new THREE.PointLight(0x5BFFFF, 1.5, 10.13);
light2.position.set(0.31, 0.3, -5.36);
//scene.add(light2)

direction.rotateY(Math.PI/2)
direction.rotateX(Math.PI/2)

// gui.add(point3.position, 'x').min(-7).max(7).step(0.001).name('Ppositionx')
// gui.add(direction.position, 'y').min(-7).max(7).step(0.001).name('Ppositiony')
// gui.add(direction.position, 'z').min(-7).max(7).step(0.001).name('Ppositionz')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)

if (!mobile) {
    camera.position.set(1.164,0.405,1.164)
  } else {
    camera.position.set(1.75,0.72,1.888)
}

gui.add(camera.position, 'x').min(-7).max(7).step(0.001).name('CX')
gui.add(camera.position, 'y').min(-7).max(7).step(0.001).name('Cy')
gui.add(camera.position, 'z').min(-7).max(7).step(0.001).name('Cz')
gui.add(camera.rotation, 'x').min(-7).max(7).step(0.001).name('RCX')
gui.add(camera.rotation, 'y').min(-7).max(7).step(0.001).name('RCy')
gui.add(camera.rotation, 'z').min(-7).max(7).step(0.001).name('RCz')

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3


const effectComposer = new EffectComposer(renderer)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const glitchPass = new GlitchPass()
glitchPass.enabled = false
effectComposer.addPass(glitchPass)

const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

//Snow
const snowParametrs = {
    vertMovingSpeed: 1,
    LatealSpeed: 1,
    count: 500,
    size: 0.3
  }
  
  let geometry = null
  let pointsMaterial = null
  let points = null
  console.log(points);
  const generateSnow = () => {
  
    if(points !== null)
      {
          geometry.dispose()
          pointsMaterial.dispose()
          scene.remove(points)
      }
  
   geometry= new THREE.Geometry();
  
   pointsMaterial = new THREE.PointsMaterial({
      size: snowParametrs.size,
      color: 'blue',
      transparent:true,
      opacity: 0.5,
      map:snow,
      blending:THREE.AdditiveBlending,
      sizeAttenuation:true,
      depthTest: false
  });
  
  let range = 100;
  
  for (let i = 0; i < snowParametrs.count; i++ ) {
  
      let vertice = new THREE.Vector3(
          Math.random() * range - range / 2,
          Math.random() * range * 1.5,
          Math.random() * range - range / 2);
      /* Vertical moving speed */
      vertice.velocityY = (0.1 + Math.random() / 3) * snowParametrs.vertMovingSpeed
      /* Lateral speed */
      vertice.velocityX = ((Math.random() - 0.5) / 3)* snowParametrs.LatealSpeed;
       
      /* Add vertices to geometry */
      geometry.vertices.push(vertice);
  
  }
  
  geometry.center();
  
  points = new THREE.Points(geometry, pointsMaterial);
  points.position.y = -30;
  // points.position.x = -50;
  // points.position.z = -30;
  
  scene.add(points);
  }

  const learnMoreButton = document.querySelector('.point-2');
  learnMoreButton.addEventListener('click', () => {
    generateHit()   
    gsap.to(camera.position, {
        duration: 2,
        x: -3.93,
        y: 1.42,
        z: -2.12
    })
  })

  const DomPoints = document.querySelectorAll('.point');
  DomPoints.forEach((point) => {
    point.addEventListener('click', () => {
        generateHit()
        point.children[1].style.opacity = (point.children[1].style.opacity === '' || point.children[1].style.opacity === '0') ? '1' : '0'
    })
  })

  //Points
const raycaster = new THREE.Raycaster()
const HtmlPoints = [
    {
        position: new THREE.Vector3(-1, 0.6, 0),
        element: document.querySelector('.point-0')
    },
    {
        position: new THREE.Vector3(-1.5, 0.8, - 1.2),
        element: document.querySelector('.point-1')
    },
    {
        position: new THREE.Vector3(0.3, - 0.9, - 0.7),
        element: document.querySelector('.point-2')
    },
    {
        position: new THREE.Vector3(-1.3, 0.6, - 0),
        element: document.querySelector('.point-3')
    },
    {
        position: new THREE.Vector3(-1.3, - 0.5, 0.2),
        element: document.querySelector('.point-5')
    },
    {
        position: new THREE.Vector3(-1.5,  -1.0, - 1.5),
        element: document.querySelector('.point-4')
    }
]

const clock = new THREE.Clock()
let previousTime = 0

/**
 * Animate
 */
const tick = () =>
{
    drawSin()
    //  console.log(camera.position);
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    mixer && mixer.update(deltaTime)

    waterMaterial.uniforms.uTime.value = elapsedTime

    let snowP = scene.children.filter(el => el instanceof THREE.Points)
    let vertices = snowP[0].geometry.vertices

    if(vertices){
    vertices.forEach(function (v) {
 
        v.y = v.y - (v.velocityY);
        v.x = v.x - (v.velocityX);
 
        if (v.y <= 0) v.y = 60;
        if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
 
      });
    }
    snowP[0].geometry.verticesNeedUpdate = true;

    stats.update()

    // Update controls
    controls.update()

     // Update points only when the scene is ready
     if(sceneReady)
     {
         // Go through each point
         for(const point of HtmlPoints)
         {
             // Get 2D screen position
             const screenPosition = point.position.clone()
             screenPosition.project(camera)
     
             // Set the raycaster
             raycaster.setFromCamera(screenPosition, camera)
             const intersects = raycaster.intersectObjects([scene.children[0]], true)
   
             // No intersect found
             if(intersects.length === 0)
             {
                 // Show
                 point.element.classList.add('visible')
             }
 
             // Intersect found
             else
             {
                 // Get the distance of the intersection and the distance of the point
                 const intersectionDistance = intersects[0].distance
                 const pointDistance = point.position.distanceTo(camera.position)
     
                 // Intersection is close than the point
                 if(intersectionDistance < pointDistance)
                 {
                     // Hide
                     point.element.classList.remove('visible')
                     point.element.children[1].style.opacity = '0'
                 }
                 // Intersection is further than the point
                 else
                 {
                     // Show
                     point.element.classList.add('visible')
                 }
             }
     
             const translateX = screenPosition.x * sizes.width * 0.5
             const translateY = - screenPosition.y * sizes.height * 0.5
             point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
         }
     }

    // Render
    //effectComposer.render()
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
generateSnow()
tick()
