import * as React from "react";
import Canvas from "./components/canvas";
import CommandEditor from "./components/commandEditor";
import CommandList from "./components/commandList";
import CommandInput from "./components/commandInput";
import HelperLayer from "./components/helperLayer";
import TutorialPopup from "./components/tutorialPopup";
import Header from "./components/header";
import SkipLink from "./components/skipLink";

import { commandDescriptions } from "./data/commandDescriptions";
import { pathwayExamples } from "./data/pathwayExamples";
import { tutorialPages } from "./data/tutorialPages";

import "./App.css";
import "./vis-001.css";

export const App: React.FC = () => {
  const [showHelper, setShowHelper] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState<"tips" | "examples">("tips");

  const handleShowHelper = (panel: "tips" | "examples") => {
    setShowHelper(true);
    setActivePanel(panel);
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
            onClose={() => setShowHelper(false)}
            examplePaths={pathwayExamples}
            descriptions={commandDescriptions}
          />
        )}
        {showHelper && activePanel === "tips" && (
          <TutorialPopup tutorialPages={tutorialPages} />
        )}
        <div className="editorContainer">
          <section className="editorLine">
            <CommandEditor />
            <CommandInput descriptions={commandDescriptions} />
            <Canvas />
          </section>
          <aside className="commandListLine">
            <CommandList descriptions={commandDescriptions} />
          </aside>
        </div>
      </div>
      <footer className="appFooter">© 2026 Logo Playground</footer>
    </main>
  );
};

export default App;
