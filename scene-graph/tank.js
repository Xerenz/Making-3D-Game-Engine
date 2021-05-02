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


    // Making Target

    // Target orbit 
    const targetOrbit = new THREE.Object3D()
    scene.add(targetOrbit)

    // Target offset from ground
    const targetElevation = new THREE.Object3D()
    targetElevation.position.y = 8
    targetOrbit.add(targetElevation)

    // Target Bob
    const targetBob = new THREE.Object3D()
    // targetElevation.position.z = carLength * 2
    targetElevation.add(targetBob)

    // Target
    const radius = 1,
            widthSegment = 6,
            heightSegment = 6
    const targetGeometry = new THREE.SphereGeometry(radius, widthSegment, heightSegment)
    const targetMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00, flatShading: true })
    const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial)
    targetMesh.castShadow = true
    targetBob.add(targetMesh)


    // Cameras
    let cameras = [
        { cam : camera, info : 'detached camera' },

    ]


    // Render
    function render(time) {
        time *= 0.001

        if (resizeRenderer(renderer)) {
            const canvas = renderer.domElement
            cameras.forEach(camInfo => {
                camInfo.cam.aspect = canvas.clientWidth / canvas.clientHeight
                camInfo.cam.updateProjectionMatrix()
            })
        }

        // Move Target
        targetOrbit.rotation.y = time * 0.27
        targetBob.position.y = Math.sin(time * 2) * 4
        targetMesh.rotation.y = time * 7
        targetMesh.rotation.x = time * 13
        targetMaterial.emissive.setHSL(time * 10 % 1, 1, .25) 
        targetMaterial.color.setHSL(time * 10 % 1, 1, .25)

        renderer.render(scene, camera)

        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)

}

main()