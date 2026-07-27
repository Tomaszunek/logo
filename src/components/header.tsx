import * as React from "react";
import { useSettingsStore } from "src/store/settingsStore";

interface HeaderProps {
  onShowHelper: (panel: "tips" | "examples") => void;
}

const Header: React.FC<HeaderProps> = ({ onShowHelper }) => {
  const animationsEnabled = useSettingsStore(
    (state) => state.animationsEnabled,
  );
  const setAnimationsEnabled = useSettingsStore(
    (state) => state.setAnimationsEnabled,
  );

  return (
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
      <nav className="rightSide" aria-label="Application controls">
        <button
          className="button buttonGhost animationToggle"
          type="button"
          aria-pressed={animationsEnabled}
          onClick={() => {
            setAnimationsEnabled(!animationsEnabled);
          }}
        >
          <span
            className={`animationToggleDot${
              animationsEnabled ? " isEnabled" : ""
            }`}
            aria-hidden="true"
          />
          Animations {animationsEnabled ? "on" : "off"}
        </button>
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
};

export default Header;
