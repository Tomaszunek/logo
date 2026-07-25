import * as React from "react";
import Canvas from "./components/canvas";
import CommandEditor from "./components/commandEditor";
import CommandInput from "./components/commandInput";
import CommandList from "./components/commandList";
import Header from "./components/header";
import HelperLayer from "./components/helperLayer";
import SkipLink from "./components/skipLink";
import TutorialPopup from "./components/tutorialPopup";
import { commandDescriptions } from "./data/commandDescriptions";
import { pathwayExamples } from "./data/pathwayExamples";
import { tutorialPages } from "./data/tutorialPages";
import "./App.css";

export const App: React.FC = () => {
  const [showHelper, setShowHelper] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState<"tips" | "examples">(
    "tips",
  );

  const handleShowHelper = (panel: "tips" | "examples") => {
    setShowHelper(true);
    setActivePanel(panel);
  };

  const closeHelper = () => {
    setShowHelper(false);
  };

  return (
    <main id="main" className="App">
      <SkipLink />
      <Header onShowHelper={handleShowHelper} />
      <div className="appMain">
        {showHelper && activePanel === "examples" && (
          <HelperLayer
            visible={true}
            panel="examples"
            onClose={closeHelper}
            examplePaths={pathwayExamples}
            descriptions={commandDescriptions}
          />
        )}
        {showHelper && activePanel === "tips" && (
          <TutorialPopup tutorialPages={tutorialPages} onClose={closeHelper} />
        )}
        <div className="editorContainer">
          <section className="editorLine" aria-label="Logo workspace">
            <CommandEditor />
            <CommandInput descriptions={commandDescriptions} />
            <Canvas />
          </section>
          <aside className="commandListLine">
            <CommandList descriptions={commandDescriptions} />
          </aside>
        </div>
      </div>
      <footer className="appFooter">
        <span>© 2026 Logo Playground</span>
        <span>Made for curious minds and bold geometry.</span>
      </footer>
    </main>
  );
};

export default App;
