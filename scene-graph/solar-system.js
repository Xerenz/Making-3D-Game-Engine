function main() {
    // Base 
    const canvas = document.querySelector('#canvas')
    const renderer = new THREE.WebGLRenderer({ canvas })
    let objects = []

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const fov = 40,
            aspect = 2,
            near = 0.1,
            far = 1000
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 50, 0)
    camera.up.set(0, 0, 1)
    camera.lookAt(0, 0, 0)

    // Light
    {
        const color = 0xFFFFFF,
                intensity = 3
        const light = new THREE.PointLight(color, intensity)
        scene.add(light)
    }

    // Responsive
    function resizeRenderer(renderer) {
        const canvas = renderer.domElement
        const { clientWidth, clientHeight } = canvas

        const pixelRatio = window.devicePixelRatio

        const width = clientWidth * pixelRatio | 0
        const height = clientHeight * pixelRatio | 0

        const resizeNeeded = width !== canvas.width || height !== canvas.height
        if (resizeNeeded) {
            renderer.setSize(width, height, false)
        }
        return resizeNeeded
    }


    // Making the Solar System 
    const radius = 1,
            widthSegment = 6,
            heightSegment = 6
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegment, heightSegment)

    // Making the Sun
    const sunMaterial = new THREE.MeshPhongMaterial({ emissive : 0xFFFF00 })
    const sun = new THREE.Mesh(sphereGeometry, sunMaterial)
    sun.scale.set(5, 5, 5)
    objects.push(sun)

    // Making the Earth
    const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2233FF, emissive: 0x112244 })
    const earth = new THREE.Mesh(sphereGeometry, earthMaterial)
    earth.scale.set(2, 2, 2)
    earth.position.x = 20
    objects.push(earth)


    // Add to scene
    scene.add(sun)
    scene.add(earth)

    // Rendering
    function render(time) {
        time *= 0.001

        if (resizeRenderer(renderer)) {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

        objects.forEach(object => {
            object.rotation.y = time
        })

        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)

    // renderer.render(scene, camera)
}

main()