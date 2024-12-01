import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

// Debug
const gui = new GUI({
    width: 300,
    title: 'Nice debug ui',
    closeFolders: false,
})
gui.close()

window.addEventListener('keydown', (event) => {
    if (event.code == 'KeyH') {
        gui._hidden ? gui.show() : gui.hide()
    }
})
const debugerObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
function createTextureLoader(isDebug) {
    const loadingManager = new THREE.LoadingManager()
    loadingManager.onStart = () => {
        console.log('onStart')
    }
    loadingManager.onProgress = () => {
        console.log('onProgress')
    }
    loadingManager.onError = () => {
        console.log('onError')
    }
    return new THREE.TextureLoader(loadingManager)
}
const textureLoader = createTextureLoader(true)

function loadTexture(texturePath, load, progress, error) {
    const result = textureLoader.load(
        texturePath,
        load,
        progress,
        error
    )
    result.colorSpace = THREE.SRGBColorSpace

    return result
}
const doorColorTexture = loadTexture('./textures/door/color.jpg')
const doorAlphaTexture = loadTexture('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = loadTexture('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = loadTexture('./textures/door/height.jpg')
const doorNormalTexture = loadTexture('./textures/door/normal.jpg')
const doorMetalnessTexture = loadTexture('./textures/door/metalness.jpg')
const doorRoughnessTexture = loadTexture('./textures/door/roughness.jpg')
const matcapTexture = loadTexture('./textures/matcaps/2.png')
const gradientTexture = loadTexture('./textures/gradients/5.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

// //Objects
// const material = new THREE.MeshBasicMaterial({map: doorColorTexture})
// material.map = doorColorTexture
// material.color = new THREE.Color('green')
// material.wireframe = true

// //opacity
// material.transparent = true
// material.opacity = 0.5

// material.alphaMap = doorAlphaTexture

// which side of the faces is visible (more processing power)
// material.side = THREE.DoubleSide



// MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

//MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial()

//MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial()

//MeshPhongtMaterial
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color('red')

//MeshToonMaterial (!)
// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture

//MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 1
// material.roughness = 1
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.1, 0.1)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

// gui.add(material, 'metalness').min(0).max(1).step(0.0001)
// gui.add(material, 'roughness').min(0).max(1).step(0.0001)

//MeshPhysicalMaterial
const material = new THREE.MeshPhysicalMaterial()
material.metalness = 0
material.roughness = 0
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.1, 0.1)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)

// Clearcoast
// material.clearcoat = 1
// material.clearcoatRoughnesss = 0

// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001)
// gui.add(material, 'clearcoatRoughnesss').min(0).max(1).step(0.0001)

//Sheen
// material.sheen = 1
// material.sheenRoughness = 0.25
// material.sheenColor.set(1, 1, 1)

// gui.add(material, 'sheen').min(0).max(1).step(0.0001)
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.0001)
// gui.addColor(material, 'sheenColor')

//Iridescense
// material.iridescence = 1
// material.iridescenceIOR = 1
// material.iridescenceThicknessRange = [100, 800]

// gui.add(material, 'iridescence').min(0).max(1).step(0.0001)
// gui.add(material, 'iridescenceIOR').min(1).max(2.333).step(0.0001)
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1)

// Transmission
material.transmission = 1

material.ior = 2.417 // diamond ior = 2.417, water ior = 1.333, air ior = 1.00293
material.thickness = 0.5

gui.add(material, 'transmission').min(0).max(1).step(0.0001)
gui.add(material, 'ior').min(1).max(10).step(0.001)
gui.add(material, 'thickness').min(0).max(1).step(0.0001)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 10, 10),
    material
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 10, 32),
    material
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

// Lignhts
// const ambientLight = new THREE.AmbientLight('white', 1)
// scene.add(ambientLight)

// const pointLignt = new THREE.PointLight('white', 30)
// pointLignt.position.x = 2
// pointLignt.position.y = 3
// pointLignt.position.z = 1
// scene.add(pointLignt)

// Enivironment map
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = 0.1 * elapsedTime
    // sphere.rotation.x = -0.15 * elapsedTime
    // plane.rotation.y = 0.1 * elapsedTime
    // plane.rotation.x = -0.15 * elapsedTime
    // torus.rotation.y = 0.1 * elapsedTime
    // torus.rotation.x = -0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()