import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

// Textures pages https://brunosimon.notion.site/Assets-953f65558015455eb65d38a7a5db7171
// https://polyhaven.com/textures/terrain

// Textures optimization
// https://caniuse.com/webp
// https://squoosh.app/
// https://cloudconvert.com/image-converter

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */

const loadingManager = new THREE.LoadingManager()
// loadingManager.onStart = () => {
//     console.log('onStart')
// }
// loadingManager.onProgress = () => {
//     console.log('onProgress')
// }
// loadingManager.onError = () => {
//     console.log('onError')
// }
const textureLoader = new THREE.TextureLoader(loadingManager)
function loadTexture(texturePath, isColor, repeatS, repeatT, onLoad, onProgress) {
    const result = textureLoader.load(
        texturePath,
        onLoad,
        onProgress,
        () => {console.error(`${texturePath} loading error`)}
    )
    if (isColor) {
        result.colorSpace = THREE.SRGBColorSpace
    } 

    if (repeatS || repeatT) {
        result.repeat.set(repeatS || 1, repeatT || 1)
        if (repeatS) result.wrapS = THREE.RepeatWrapping
        if (repeatT) result.wrapT = THREE.RepeatWrapping
        
        
    }

    return result
}

const floorAlphaTexture = loadTexture('./floor/alpha.webp')
const floorColorTexture = loadTexture('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp', true, 8, 8)
const floorARMTexture = loadTexture('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp', false, 8, 8)
const floorNormalTexture = loadTexture('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp', false, 8, 8)
const floorDisplacementTexture = loadTexture('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp', false, 8, 8)

const wallColorTexture = loadTexture('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp', true)
const wallARMTexture = loadTexture('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp')
const wallNormalTexture = loadTexture('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp')

const roofColorTexture = loadTexture('./roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp', true, 3, 1)
const roofARMTexture = loadTexture('./roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp', false, 3, 1)
const roofNormalTexture = loadTexture('./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp', false, 3, 1)

const bushColorTexture = loadTexture('./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp', true, 2, 1)
const bushARMTexture = loadTexture('./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp', 2, 1)
const bushNormalTexture = loadTexture('./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp', 2, 1)

const graveColorTexture = loadTexture('./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp', true, 0.3, 0.4)
const graveARMTexture = loadTexture('./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp', false, 0.3, 0.4)
const graveNormalTexture = loadTexture('./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp', false, 0.3, 0.4)

const doorColorTexture = loadTexture('./door/color.webp', true)
const doorAlphaTexture = loadTexture('./door/alpha.webp')
const doorAmbientOcclusionTexture = loadTexture('./door/ambientOcclusion.webp')
const doorDisplacementTexture = loadTexture('./door/height.webp')
const doorNormalTexture = loadTexture('./door/normal.webp')
const doorMetalnessTexture = loadTexture('./door/metalness.webp')
const doorRoughnessTexture = loadTexture('./door/roughness.webp')

/**
 * House
 */
const houseSizes = {
    width: 4,
    height: 2.5,
    depth: 4
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        wireframe: false,
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: -0.2,
    })
)
gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floor displacementScale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floor displacementBias')
floor.rotation.x = Math.PI * -0.5
scene.add(floor)

// House container
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(houseSizes.width, houseSizes.height, houseSizes.depth),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture,
    })
)
walls.position.y += houseSizes.height * 0.5
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture,
    })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y += houseSizes.height + 0.75
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        color: 'grey',
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorDisplacementTexture,
        displacementScale: 0.15,
        displacementBias: -0.04,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
    })
)
door.position.z = 2 + 0.001
door.position.y = 1
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = Math.PI * 0.5

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.setScalar(0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = Math.PI * 0.5

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = Math.PI * 0.5

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
bush4.rotation.x = Math.PI * 0.5

house.add(bush1, bush2, bush3, bush4)

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture,
})

const graves = new THREE.Group()
scene.add(graves)

for (let i=0; i<30; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 4
    const x = Math.sin(angle) * radius
    const y = Math.random() * 0.4
    const z = Math.cos(angle) * radius
    const grave = new THREE.Mesh(
        graveGeometry,
        graveMaterial
    )

    grave.position.x = x
    grave.position.y = y
    grave.position.z = z
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Shadows
 */
// Renderer
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

// Cast and receive
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
roof.receiveShadow = true
floor.receiveShadow = true
door.receiveShadow = true

graves.children.forEach((grave) => {
    grave.castShadow = true
    grave.receiveShadow = true
})

// Mapping
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 8

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 8

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 8

/**
 * Sky
 * https://threejs.org/examples/?q=sky#webgl_shaders_sky
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_sky.html
 */
const sky = new Sky()
sky.scale.setScalar(100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

gui.add(sky.material.uniforms.turbidity, 'value').min(0).max(20).step(0.1).name('sky turbidity')
gui.add(sky.material.uniforms.rayleigh, 'value').min(0).max(4).step(0.001).name('sky rayleigh')
gui.add(sky.material.uniforms.mieCoefficient, 'value').min(0).max(0.1).step(0.001).name('sky mieCoefficient')
gui.add(sky.material.uniforms.mieDirectionalG, 'value').min(0).max(1).step(0.001).name('sky mieDirectionalG')

/**
 * Fog
 */
// scene.fog = new THREE.Fog('#ff0000', 1, 13)
scene.fog = new THREE.FogExp2('#02343f', 0.1)

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Ghost
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

    const ghost2Angle = elapsedTime * -0.38
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)

    const ghost3Angle = elapsedTime * 0.23
    ghost3.position.x = Math.cos(ghost3Angle) * 6
    ghost3.position.z = Math.sin(ghost3Angle) * 6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()