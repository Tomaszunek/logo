import * as React from 'react';

interface HeaderProps {
  onShowHelper: (panel: 'tips' | 'examples') => void;
}

const Header: React.FC<HeaderProps> = ({ onShowHelper }) => (
  <header className="appHeader">
    <div className="leftSide">
      <img src="./logoTurtle.png" alt="Logo" className="appLogo"/>
      <h1>Logo Playground</h1>
    </div>
    <nav className="rightSide" style={{marginLeft: 'auto'}}>
      <button type="button" onClick={() => onShowHelper('tips')}>Tips</button>
      <button type="button" onClick={() => onShowHelper('examples')}>Command Examples</button>
    </nav>
  </header>
);

export default Header;
