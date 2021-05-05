import * as THREE from './resources/three.module.js'
import { OrbitControls } from './resources/OrbitControls.js'


function main() {
    // Base
    const canvas = document.querySelector('#canvas')
    const renderer = new THREE.WebGLRenderer({ canvas })

    // Scene
    const scene = new THREE.Scene()

    // Camera 

    // Perspective Camera
    function makeCamera(fov=40, aspect=2, near=0.1, far=100) {
        return new THREE.PerspectiveCamera(fov, aspect, near, far)
    }

    const camera = makeCamera(45)
    camera.position.set(0, 10, 20)

    // Orthograhic Camera
    const left = -1
    const right = 1
    const top = 1
    const bottom = -1
    const near = 5
    const far = 50
    const orthoCamera = new THREE.OrthographicCamera(left, right, top, bottom, near, far)
    orthoCamera.zoom = 0.2

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


    // Lights

    // Ambient Light
    {
        const intensity = 1,
                color = 0xffffff
        const light = new THREE.AmbientLight(color, intensity)
        // scene.add(light)
    }

    // Hemisphere Light
    {
        const intensity = 1,
                skyColor = 0xB1E1FF,
                groundColor = 0xB97A20
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
        scene.add(light)
    }

    // Directional Light
    {
        const intensity = 1,
                color = 0xffffff
        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(0, 10, 0)
        light.target.position.set(-5, 0, 0)
        // scene.add(light.target)

    }

    // Point Light
    {
        const intensity = 1,
                color = 0xffffff
        const light = new THREE.PointLight(color, intensity)
        light.position.set(0, 10, 0)
        // light.target.position.set(-5, 0, 0)
        // scene.add(light)
        // scene.add(light.target)
    }

    // Spot Light
    {
        const intensity = 1,
                color = 0xffffff
        const light = new THREE.SpotLight(color, intensity)
        light.position.y = 20
        scene.add(light)
    }

    // Cube
    {   
        const boxSize = 5
        const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize)
        const boxMaterial = new THREE.MeshPhongMaterial({ color : 0xccaa88 })
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
        boxMesh.position.set(boxSize, boxSize / 2, 0)
        scene.add(boxMesh)
    }

    // Sphere
    {
        const radius = 5,
                widthSegment = 32,
                heightSegment = 16
        const sphereGeometry = new THREE.SphereGeometry(radius, widthSegment, heightSegment)
        const sphereMaterial = new THREE.MeshPhongMaterial({ color : 0xccdd33})
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
        sphereMesh.position.set(-radius, 2 * radius, radius)
        scene.add(sphereMesh)
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