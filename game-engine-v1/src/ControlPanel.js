import React from 'react'

export default function ControlPanel(props) {
    return (
        <div>
            <button>Add Box</button>
            <br/>
            <button onClick={() => props.box.position.x = props.box.position.x - 1}>Move Left</button>
            <button onClick={() => props.box.position.x = props.box.position.x + 1}>Move Right</button>
            <button onClick={() => props.box.position.y = props.box.position.y + 1}>Move Up</button>
            <button onClick={() => props.box.position.y = props.box.position.y - 1}>Move Down</button>
        </div>
    )
}
