import * as React from 'react';
import Canvas from './components/canvas';
import CommandEditor from './components/commandEditor';
import CommandList from './components/commandList';

import './App.scss';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <div className="editorLine">
          <CommandEditor/>
          <Canvas/>
        </div>
        <div className="commandListLine">
          <CommandList/>
        </div>
      </div>
    );
  }
}

export default App;
