import * as React from "react";
import Canvas from "./components/canvas";
import CommandEditor from "./components/commandEditor";
import CommandList from "./components/commandList";
import CommandInput from "./components/commandInput";
import HelperLayer from "./components/helperLayer";
import TutorialPopup from "./components/tutorialPopup";
import Header from "./components/header";
import SkipLink from "./components/skipLink";

import { useCommandStore } from "./store/commandStore";
import { commandDescriptions } from "./data/commandDescriptions";
import { pathwayExamples } from "./data/pathwayExamples";
import { tutorialPages } from "./data/tutorialPages";

import "./App.css";
import "./vis-001.css";

export const App: React.FC = () => {
  const [showHelper, setShowHelper] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState<"tips" | "examples">("tips");

  // Zustand store for commands
  const commands = useCommandStore(state => state.commands);
  const addCommand = useCommandStore(state => state.addCommand);
  const editCommand = useCommandStore(state => state.editCommand);
  const deleteCommand = useCommandStore(state => state.deleteCommand);
  const setCommand = useCommandStore(state => state.setCommand);

  const actions: any = { addCommand, editCommand, deleteCommand, setCommand };

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
            actions={actions}
          />
        )}
        {showHelper && activePanel === "tips" && (
          <TutorialPopup tutorialPages={tutorialPages} />
        )}
        <div className="editorContainer">
          <section className="editorLine">
            <CommandEditor commands={commands} actions={actions} />
            <CommandInput
              commands={commands}
              actions={actions}
              descriptions={commandDescriptions}
            />
            <Canvas commands={commands} />
          </section>
          <aside className="commandListLine">
            <CommandList
              commands={commands}
              descriptions={commandDescriptions}
              actions={actions}
            />
          </aside>
        </div>
      </div>
      <footer className="appFooter">© 2026 Logo Playground</footer>
    </main>
  );
};

export default App;
