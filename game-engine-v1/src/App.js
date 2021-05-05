import React from 'react'
import Canvas from './Canvas'
import ControlPanel from './ControlPanel'

import { ProductConsumer } from './context'

import './App.css';

function App() {
  return (
    <React.Fragment>
      <ProductConsumer>
        { (values) => {
          if (values) {
            return (
              <>
                <Canvas entities={values.entities}
                selectedEntity={values.selectedEntity} />
                <ControlPanel entities={values.entities}
                createEntity={values.createEntity}
                changePosition={values.changePosition}
                selectedEntity={values.selectedEntity}
                setSelectedEntity={values.setSelectedEntity} />
              </>
            )
          }
          
        }}
      </ProductConsumer>
    </React.Fragment>
  );
}

export default App;
