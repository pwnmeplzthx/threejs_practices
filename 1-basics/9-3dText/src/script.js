import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Links
 * 
 * matcaps https://github.com/nidorx/matcaps/tree/master
 */

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Textures
 */
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
const matcaptexture = textureLoader.load('./textures/matcaps/8.png')
matcaptexture.colorSpace = THREE.SRGBColorSpace

/**
 * Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load(
    './fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Hello World',
            {
                font: font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments:3
            }
        )
        // textGeometry.computeBoundingBox()
        // console.log(textGeometry.boundingBox)
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5
        // )
        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial({matcap: matcaptexture})
        // textMaterial.wireframe = true
        const textMesh = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(textMesh)

        generateManyObjects()
    }
)


/**
 * Object
 */
function generateManyObjects() {
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcaptexture})

    console.time('donuts')

    for(let i=0; i < 1000; i++) {
        const donutMesh = new THREE.Mesh(donutGeometry, donutMaterial)
        donutMesh.position.set(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40
        )

        donutMesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        )
        const donutScale = Math.random()
        donutMesh.scale.set(donutScale, donutScale, donutScale)
        scene.add(donutMesh)
    }

    console.timeEnd('donuts')
}

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()