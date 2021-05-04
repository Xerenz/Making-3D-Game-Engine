import * as THREE from './resources/three.module.js'
import { OrbitControls } from './resources/OrbitControls.js'


function main() {
    // Base
    const canvas = document.querySelector('#canvas')
    const renderer = new THREE.WebGLRenderer(canvas)

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
}

main()