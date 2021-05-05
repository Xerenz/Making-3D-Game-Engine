import React from 'react'

export default function ControlPanel(props) {
    return (
        <div>
            <button onClick={() => props.createEntity(5, 5, 5)}>Add Box</button>
            <br/>
            <select onChange={event => props.setSelectedEntity(event.target.value)}>
                {props.entities.map((entity, index) => <option key={index} value={index}>{ entity.name }</option>)}
            </select>
            <button onClick={() => props.changePosition(-1, 'x')}>Move Left</button>
            <button onClick={() => props.changePosition(1, 'x')}>Move Right</button>
            <button onClick={() => props.changePosition(1, 'y')}>Move Up</button>
            <button onClick={() => props.changePosition(-1, 'y')}>Move Down</button>
            <button onClick={() => props.changePosition(1, 'z')}>Move Ahead</button>
            <button onClick={() => props.changePosition(-1, 'z')}>Move Back</button>
        </div>
    )
}

// props.selectedEntity.mesh.position.x = props.box.position.x - 1
