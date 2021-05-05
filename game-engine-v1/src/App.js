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
                <Canvas box={values.box}/>
                <ControlPanel moveX={values.moveX} 
                              moveY={values.moveY} 
                              moveZ={values.moveZ}
                              box={values.box} />
              </>
            )
          }
          
        }}
      </ProductConsumer>
    </React.Fragment>
  );
}

export default App;
