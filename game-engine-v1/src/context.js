import React, { Component } from 'react'
import * as THREE from 'three'
import * as CANNON from 'cannon'

const ProductContext = React.createContext()

class ProductProvider extends Component {
    state = {
        box : {}
    }

    componentDidMount() {
        
    }

    makeBox = (heigth, width, depth) => {
        const boxGeometry = new THREE.BoxGeometry(heigth, width, depth)
        const boxMaterial = new THREE.MeshPhongMaterial({ color : 0xff33aa })
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
        this.setState({ box : boxMesh })
    }

    createEntity = () => {
        const entity = new Entity()
        this.setState({ box : entity })
    }

    render() {
        return(
            <ProductContext.Provider value={{
                ...this.state,
                makeBox : this.makeBox,
                createEntity : this.createEntity,
            }}>
                {this.props.children}
            </ProductContext.Provider>
        )
    }
}


// Entity definition

let Entity = function Entity(params) {
    this.id = Entity.prototype._count;
    Entity.prototype._count++;

    this.components = {};
    params = params || {};

    params.type = ('type' in params) ? params.type : 'box';
    let mass = ('mass' in params) ? params.mass : 1;
    let color = ('color' in params) ? params.color : 0xff88aa;
    let name = ('name' in params) ? params.name : 'Entity_' + params.type + '_' + this.id;
    let position = params.position || {x: 0, y: 10, z: 0};
    let material = new THREE.MeshPhongMaterial({color: color});

    let {geometry, shape} = getGeometryShape(params);

    const body = new CANNON.Body({
        mass: mass,
        shape: shape,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        material: new CANNON.Material({friction: 0.1})
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;
    this.mesh.cannon_rigid_body = body;
    this.name = name;

    world.add(body);
    scene.add(this.mesh);
    this.addEntityToDict();

    return this;
}

Entity.prototype._count = 0;

Entity.prototype.addEntityToDict = function () {
    entities[this.id] = this;

    const entitySelect = document.getElementById('entities-select');
    let option = document.createElement('option');
    option.text = this.name;
    option.value = this.id;
    option.id = 'select_option_' + this.id;
    entitySelect.appendChild(option);
}

Entity.prototype.changeColor = function (r, g, b) {
    this.mesh.material.color = {r, g, b};
}

Entity.prototype.select = function () {
    currentEntity = this;
    const currentEntitySpan = document.getElementById('current-entity');
    currentEntitySpan.innerText = this.name;

    const xElement = document.getElementById('x');
    const yElement = document.getElementById('y');
    const zElement = document.getElementById('z');

    xElement.value = this.mesh.position.x;
    yElement.value = this.mesh.position.y;
    zElement.value = this.mesh.position.z;
    return this;
}

Entity.prototype.kick = function (magnitude, location) {
    this.mesh.cannon_rigid_body.applyImpulse(new CANNON.Vec3(...magnitude), new CANNON.Vec3(...location))
}
Entity.prototype.addComponent = function (component) {
    this.components[component.name] = component;
    return this;
}

Entity.prototype.removeComponent = function (componentName) {
    delete this.components[componentName];
    return this;
}

Entity.prototype.print = function () {
    console.log(JSON.stringify(this, null, 4));
    return this;
}

// Product consumer export

const ProductConsumer = ProductContext.Consumer

export { ProductConsumer, ProductProvider }
