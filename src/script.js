import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Cursor
const cursor = {
    x:0,
    y:0
}
window.addEventListener('mousemove', (event1) => {
    cursor.x = event1.clientX / sizes.width - 0.5,
    cursor.y = event1.clientY / sizes.height - 0.5
})

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Postion
// mesh.position.x=1
// mesh.position.y=1
// mesh.position.z=1
// mesh.position.set(0.7,-0.6,1)

// Scale
// mesh.scale.set(2,0.5,0.5)

// Rotation
// mesh.rotation.reorder('YXZ')
// mesh.rotation.x= Math.PI * 0.25
// mesh.rotation.y= Math.PI * 0.25

// Axes Helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Group
// const group = new THREE.Group
// group.position.y=1
// group.scale.y=2
// group.rotation.y= 1
// const cube1 = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshBasicMaterial({ color: 0xff0000})
// )
// group.add(cube1)

// const cube2 = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshBasicMaterial({color: 0x00ff00})
// )
// cube2.position.x=-2
// group.add(cube2)

// const cube3 = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshBasicMaterial({color: 0x0000ff})
// )
// cube3.position.x=2
// group.add(cube3)

// scene.add(group)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z=3
// camera.position.x=2
// camera.position.y=2
// camera.lookAt(mesh.position)
scene.add(camera)



// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
})
renderer.setSize(sizes.width, sizes.height)

// let time = Date.now() 
const clock = new THREE.Clock()
// gsap.to(mesh.position, {duration: 1, delay: 1, x: 2})
// gsap.to(mesh.position, {duration: 1, delay: 2, x: 0})

// Animation 
const tick = () =>
{
    // Making the frame rate same for all devices
    // const currentTime = Date.now()
    // const deltaTime = currentTime - time
    // time = currentTime
    // const elapsedTime = clock.getElapsedTime()
    // mesh.rotation.y = elapsedTime
    // camera.position.y = Math.cos(elapsedTime)
    // camera.lookAt(mesh.position)
    // Update Camera
    camera.position.x= cursor.x * 3
    // camera.position.y= cursor.y
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}
tick()