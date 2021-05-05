import React, { Component } from 'react'
import * as THREE from 'three'

const ProductContext = React.createContext()

class ProductProvider extends Component {
    state = {
        box : {}
    }

    componentDidMount() {
        const box = this.makeBox(5, 5, 5)
        this.setState({ box : box })
    }

    makeBox = (heigth, width, depth) => {
        const boxGeometry = new THREE.BoxGeometry(heigth, width, depth)
        const boxMaterial = new THREE.MeshPhongMaterial({ color : 0xff33aa })
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
        return boxMesh
    }

    moveX = (units) => {
        // console.log(this.state.box)
        // const x = this.state.box.x + units
        // this.setState({ box : {...this.state.box, x : x}})
    }

    moveY(units) {
        const y = this.state.box.y + units
        this.setState({ box : {...this.state.box, y : y}})
    }

    moveZ(units) {
        const z = this.state.box.z + units
        this.setState({ box : {...this.state.box, z : z}})
    }

    render() {
        return(
            <ProductContext.Provider value={{
                ...this.state,
                makeBox : this.makeBox,
                moveX : this.moveX,
                moveY : this.moveY,
                moveZ : this.moveZ
            }}>
                {this.props.children}
            </ProductContext.Provider>
        )
    }
}

const ProductConsumer = ProductContext.Consumer

export { ProductConsumer, ProductProvider }
