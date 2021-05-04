function main() {
    // Base
    const canvas = document.querySelector('#canvas')
    const renderer = new THREE.WebGLRenderer({ canvas })


    // Scene
    const scene = new THREE.Scene()

    // Camera
    function makeCamera(fov=40) {
        const aspect = 2,
                near = 0.1,
                far = 1000
        return new THREE.PerspectiveCamera(fov, aspect, near, far)
    }

    // Simple Camera
    const camera = makeCamera()
    camera.position.set(8, 4, 10).multiplyScalar(3)
    camera.lookAt(0, 0, 0)

    // Light
    {
        const color = 0xFFFFFF,
                intensity = 1
        const light = new THREE.DirectionalLight(color, intensity)
        scene.add(light)
        light.castShadow = true
        light.shadow.mapSize.width = 2048
        light.shadow.mapSize.height = 2048

        const d = 50
        light.shadow.camera.left = -d
        light.shadow.camera.right = d
        light.shadow.camera.top = d
        light.shadow.camera.bottom = -d
        light.shadow.camera.near = 1
        light.shadow.camera.far = 50
        light.shadow.bias = 0.001
    }

    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 2, 4);
        scene.add(light);
    }

    // Responsive display
    function resizeRenderer(renderer) {
        const canvas = renderer.domElement
        const { clientWidth, clientHeight } = canvas

        const pixelRatio = window.devicePixelRatio

        const width = clientWidth * pixelRatio | 0
        const height = clientHeight * pixelRatio | 0

        const needResize = canvas.width !== width || canvas.height !== height
        if (needResize) {
            renderer.setSize(width, height, false)
        }
        return needResize
    }

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50)
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xCC8866 })
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
    groundMesh.rotation.x = Math.PI * -0.5
    groundMesh.receiveShadow = true
    scene.add(groundMesh)


    // Cube
    const boxWidth = 5, boxHeight = 5, boxDepth = 5
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
    const material = new THREE.MeshPhongMaterial({ color : 0xff88aa })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.y = 2.5
    cube.castShadow = true
    scene.add(cube)

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