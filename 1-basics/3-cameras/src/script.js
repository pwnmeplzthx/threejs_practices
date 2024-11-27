import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Cursor
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera

// 75 - field of view (degrees) - vertical field of view
// sizes.width / sizes.height - aspect of the aspect ratio
// 0.1 - length ob the view (start)
// 1000 - length ob the view (end)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1 , 1000)

// const acpectRatio = sizes.width / sizes.height
// -1 * acpectRatio - left
// 1 * acpectRatio - right
// 1 - top
// -1 bottom
// const camera = new THREE.OrthographicCamera(-1 * acpectRatio, 1 * acpectRatio, 1, -1, 0.1, 100)

// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.target.y = 2
// controls.update()
// see controls.update()
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;

    // Custom orbit camera
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    // camera.position.y = cursor.y * -4
    // camera.lookAt(mesh.position)

    // Update controls
    // !!!!!!
    // IF USING enableDamping DONT FORGET THIS
    // !!!!!!
    controls.update()

    // docs controls
    // https://threejs.org/docs/index.html?q=controls#examples/en/controls/OrbitControls

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()