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
    const boxWidth = 1, boxHeight = 1, boxDepth = 1
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
    const material = new THREE.MeshBasicMaterial({ color : 0x44aa88 })
    const cube = new THREE.Mesh(geometry, material)

    // Addition to scene
    scene.add(cube)

    // Render 
    function render(time) {
        time *= 0.001 // convert millisec to sec

        cube.rotation.x = time
        cube.rotation.y = time

        renderer.render(scene, camera)

        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

main()

