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


    // Tank
    const tank = new THREE.Object3D()
    scene.add(tank)


    // Body
    const carWidth = 4,
            carHeight = 1,
            carLength = 8
    const bodyGeometry = new THREE.BoxGeometry(carWidth, carHeight, carLength)
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x6688AA })
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial)
    bodyMesh.position.y = 2
    tank.add(bodyMesh)

    // Tank Camera
    const tankCameraFov = 75
    const tankCamera = makeCamera(tankCameraFov)
    tankCamera.position.y = 3
    tankCamera.position.z = -6
    tankCamera.rotation.y = Math.PI
    bodyMesh.add(tankCamera)


    // Wheels
    const wheelRadius = 1,
            wheelThickness = 0.5,
            wheelSegments = 6
    const wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelThickness, wheelSegments)
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x6688AA })
    const wheelPositions = [
        [-carWidth / 2 - wheelThickness, -carHeight / 2, carLength / 3],
        [carWidth / 2 + wheelThickness, -carHeight / 2, carLength / 3],
        [-carWidth / 2 - wheelThickness, -carHeight / 2, 0],
        [carWidth / 2 + wheelThickness, -carHeight / 2, 0],
        [-carWidth / 2 - wheelThickness, -carHeight / 2, -carLength / 3],
        [carWidth / 2 + wheelThickness, -carHeight / 2, -carLength / 3],
    ]
    const wheelMeshes = wheelPositions.map(pos => {
        const wheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial)
        wheelMesh.position.set(...pos)
        wheelMesh.rotation.z = Math.PI * 0.5
        wheelMesh.castShadow = true
        bodyMesh.add(wheelMesh)
        return wheelMesh
    })


    // Dome
    const domeRadius = carWidth / 2 - 0.25,
            domeHeightSegment = 6,
            domeWidthSegment = 6,
            phiStart = 0,
            phiEnd = 2 * Math.PI,
            thetaStart = 0,
            thetaEnd = Math.PI
    const domeGeometry = new THREE.SphereGeometry(domeRadius, domeHeightSegment, domeWidthSegment,
                                            phiStart, phiEnd, thetaStart, thetaEnd)
    const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial)
    bodyMesh.add(domeMesh)
    domeMesh.position.y = 0.5


    // Turet
    const turetWidth = 0.1,
            turetHeight = 0.1,
            turetLength = carLength * 0.75 * 0.2

    // Turet Pivot
    const turetPivot = new THREE.Object3D()
    turetPivot.position.y = 0.5 + turetHeight * 2
    turetPivot.scale.set(5, 5, 5)
    bodyMesh.add(turetPivot)

    // Canon
    const turetGeometry = new THREE.BoxGeometry(turetWidth, turetHeight, turetLength)
    const turetMesh = new THREE.Mesh(turetGeometry, bodyMaterial)
    turetMesh.position.z = turetLength * 0.5
    turetPivot.add(turetMesh)

    // Turet Camera
    const turretCamera = makeCamera()
    turretCamera.position.y = .75 * .2
    turetMesh.add(turretCamera)

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
    targetElevation.position.z = carLength * 2
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