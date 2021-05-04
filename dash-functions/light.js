import * as THREE from './resources/three.module.js'
import { OrbitControls } from './resources/OrbitControls.js'


function main() {
    // Base
    const canvas = document.querySelector('#canvas')
    const renderer = new THREE.WebGLRenderer({ canvas })

    // Scene
    const scene = new THREE.Scene()

    // Camera 
    function makeCamera(fov=40, aspect=2, near=0.1, far=100) {
        return new THREE.PerspectiveCamera(fov, aspect, near, far)
    }

    const camera = makeCamera(45)
    camera.position.set(0, 10, 20)

    // Orbit Controls
    const orbitControls = new OrbitControls(camera, canvas)
    orbitControls.target.set(0, 5, 0)
    orbitControls.update()

    // Creating plane
    {
        const planeSize = 40

        // Texture of the plane
        const loader = new THREE.TextureLoader()
        const texture = loader.load('./images/checker.png')
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.magFilter = THREE.NearestFilter
        const repeats = planeSize / 2
        texture.repeat.set(repeats, repeats)

        // Plane
        const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize)
        const planeMaterial = new THREE.MeshPhongMaterial({
            map : texture,
            side : THREE.DoubleSide
        })
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
        planeMesh.rotation.x = Math.PI * -0.5
        scene.add(planeMesh)
    }


    // Light
    {
        const intensity = 1,
                color = 0xffffff
        const light = new THREE.AmbientLight(color, intensity)
        scene.add(light)
    }


    // Responsive resize to adjust pixels
    function resizeRenderer(renderer) {
        const canvas = renderer.domElement

        // HD-DPI display crispness
        const pixelRatio = window.devicePixelRatio 
        const { clientWidth, clientHeight } = canvas

        const width = clientWidth * pixelRatio | 0
        const height = clientHeight * pixelRatio | 0

        const needResize = canvas.width !== width || canvas.height !== height
        if (needResize) {
            renderer.setSize(width, height, false)
        }

        return needResize
    }

    function render(time) {
        time *= 0.001

        if (resizeRenderer(renderer)) {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }
        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

main()