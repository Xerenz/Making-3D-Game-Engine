function main() {
    // Base
    const canvas = document.querySelector('#canvas')
    const renderer = new THREE.WebGLRenderer({ canvas })

    // Camera setup
    const fov = 75 // field of vision, angle in degrees
    const aspect = 2 // aspect ratio, 300 / 150
    const near = 0.1
    const far = 5
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

    camera.position.z = 2

    // Creating a scene
    const scene = new THREE.Scene()

    // Box object
    function makeBox(geometry, color, position) {
        const material = new THREE.MeshPhongMaterial({ color : color })
        const cube = new THREE.Mesh(geometry, material)

        scene.add(cube)
        cube.position.x = position


        return cube
    }

    const boxWidth = 1, boxHeight = 1, boxDepth = 1
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
    
    const cubes = [
        makeBox(geometry, 0x44aa88, 0),
        makeBox(geometry, 0x4488aa, 2),
        makeBox(geometry, 0x88aa44, -2)
    ]

    // Light
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)


    // Addition to scene
    scene.add(light)

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

    // Render 
    function render(time) {
        time *= 0.001

        // Responsive
        if (resizeRenderer(renderer)) {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight // adjusting the aspect ratio to canvas size
            camera.updateProjectionMatrix()
        }

        cubes.forEach((cube, index) => {
            let speed = 1 + index * 0.1
            let rotation = time * speed

            cube.rotation.x = rotation
            cube.rotation.y = rotation
        })

        renderer.render(scene, camera)

        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

main()

