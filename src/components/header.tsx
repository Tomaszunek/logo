import * as React from "react";

interface HeaderProps {
  onShowHelper: (panel: "tips" | "examples") => void;
}

const Header: React.FC<HeaderProps> = ({ onShowHelper }) => (
  <header className="appHeader">
    <div className="leftSide">
      <span className="logoMark">
        <img src="./logoTurtle.png" alt="" className="appLogo" />
      </span>
      <div className="brandCopy">
        <h1>Logo Playground</h1>
        <p>Code geometry. Create something unforgettable.</p>
      </div>
    </div>
    <nav className="rightSide" aria-label="Learning resources">
      <button
        className="button buttonGhost"
        type="button"
        onClick={() => {
          onShowHelper("tips");
        }}
      >
        Quick guide
      </button>
      <button
        className="button buttonPrimary"
        type="button"
        onClick={() => {
          onShowHelper("examples");
        }}
      >
        Explore examples
      </button>
    </nav>
  </header>
);

export default Header;
