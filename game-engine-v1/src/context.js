import React, { Component } from 'react'
import * as THREE from 'three'
import * as CANNON from 'cannon'

const ProductContext = React.createContext()

class ProductProvider extends Component {
    state = {
        entities : [],
        selectedEntity : {},
    }

    createEntity = () => {
        const entity = new Entity()
        console.log("Creating new entity =======>", entity)
        let entities = [...this.state.entities, entity]
        console.log("Entity Lisy ===========>", entities)
        this.setState({ entities : entities })
    }

    setSelectedEntity = index => {
        const entity = this.state.entities[index]
        console.log("Selected Entity ===========>", entity)
        this.setState({ selectedEntity : entity })
    }

    changePosition = (unit, direction) => {
        const entity = {...this.state.selectedEntity}
        let entities = [...this.state.entities]
        const index = entities.indexOf(entity)

        entity.mesh.cannon_rigid_body.position[direction] += unit
        entities[index] = entity
        this.setState({
            selectedEntity : entity,
            entities : entities
        })
    }

    render() {
        return(
            <ProductContext.Provider value={{
                ...this.state,
                createEntity : this.createEntity,
                changePosition : this.changePosition,
                setSelectedEntity : this.setSelectedEntity,
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

    // world.add(body);
    // scene.add(this.mesh);
    // this.addEntityToDict();

    return this;
}

Entity.prototype._count = 0;

function getGeometryShape(params) {
    let geometry, shape;
    let width = ('width' in params) ? params.width : 5;
    let height = ('height' in params) ? params.height : 5;
    let depth = ('depth' in params) ? params.depth : 5;
    let radius = ('radius' in params) ? params.radius : 2.5;
    switch (params.type) {
        case 'box':
            geometry = new THREE.BoxGeometry(width, height, depth);
            shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
            break;
        case 'sphere':
            geometry = new THREE.SphereGeometry(radius, 20, 20);
            shape = new CANNON.Sphere(radius);
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(radius, radius, height, 20);
            shape = new CANNON.Cylinder(radius, radius, height, 20);
            break;
        default:
            throw "Visual type not recognized: " + params.type;
    }
    return {geometry, shape}
}

const ProductConsumer = ProductContext.Consumer

export { ProductConsumer, ProductProvider }
