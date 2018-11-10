import * as React from 'react';
import Canvas from './components/canvas';
import CommendEditor from './components/commandEditor';
import CommendList from './components/commendList';

import './App.css';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <div>
          <CommendEditor/>
          <Canvas/>
        </div>
        <div>
          <CommendList/>
        </div>
      </div>
    );
  }
}

export default App;
