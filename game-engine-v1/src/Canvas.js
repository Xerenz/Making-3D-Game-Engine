import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import CheckerImage from './images/checker.png'

export default function Canvas(props) {
    const canvasRef = useRef(null)
    
    useEffect(() => {
        // Base
        const canvas = canvasRef.current
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

        // Orbit controls
        const orbitControls = new OrbitControls(camera, canvas)
        orbitControls.target.set(0, 5, 0)
        orbitControls.update()

        // Light

        // Ambient Light
        {
            const intensity = 1,
                    color = 0xffffff
            const light = new THREE.AmbientLight(color, intensity)
            scene.add(light)
        }

        // Creating plane
        {
            const planeSize = 40

            // Texture of the plane
            const loader = new THREE.TextureLoader()
            const texture = loader.load(CheckerImage)
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

        // Box
        // const boxGeometry = new THREE.BoxGeometry(5, 5, 5)
        // const boxMaterial = new THREE.MeshPhongMaterial({ color : 0xff33aa })
        // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
        scene.add(props.box)

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
            time *= 0.01

            if (resizeRenderer(renderer)) {
                const canvas = renderer.domElement
                camera.aspect = canvas.clientWidth / canvas.clientHeight
                camera.updateProjectionMatrix()
            }
            renderer.render(scene, camera)
            requestAnimationFrame(render)
        }
        requestAnimationFrame(render)
    })

    return (
        <canvas ref={canvasRef} {...props} />
    )
}
