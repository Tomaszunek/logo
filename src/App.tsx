import * as React from 'react';
import Canvas from './components/canvas';
import CommandEditor from './components/commandEditor';
import CommandList from './components/commandList';
import CommandInput from './components/commandInput';
import HelperLayer from './components/helperLayer';
import TutorialPopup from './components/tutorialPopup';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { CommandActions } from './actions';
import { CommandModel } from './models';
import { IRootState, RootState } from './reducers';
import { omit } from './utils';
import './App.scss';

const FILTER_VALUES = (Object.keys(CommandModel.Filter) as 
  (keyof typeof CommandModel.Filter)[]).map(
  (key) => CommandModel.Filter[key]
);

export namespace App {
  export interface IProps extends RouteComponentProps<void> {
    commands: RootState.CommandState;
    descriptions: RootState.CommandDescriptionState;
    pathwayExample: RootState.PathwayExample;
    tutorialPages: RootState.TutorialPages;
    actions: CommandActions;
    filter: CommandModel.Filter;
  }
}

@connect(
  (state: IRootState, ownProps): Pick<App.IProps, 'commands' | 'descriptions' | 'pathwayExample' | 'tutorialPages' | 'filter'> => {
    const hash = ownProps.location && ownProps.location.hash.replace('#', '');
    const filter = FILTER_VALUES.find((value) => value === hash) || CommandModel.Filter.SHOW_ALL;
    return { commands: state.commands, descriptions: state.descriptions, pathwayExample: state.pathwayexpample, tutorialPages: state.tutorialPages, filter };
  },  
  (dispatch: Dispatch): Pick<App.IProps, 'actions'> => ({
    actions: bindActionCreators(omit(CommandActions, 'Type'), dispatch)
  })
)
export default class App extends React.Component<App.IProps> {    
  public render() {
    const { descriptions, commands, pathwayExample, tutorialPages, actions } = this.props;
    return (
      <div className="App">
        <HelperLayer examplePaths={pathwayExample} descriptions={descriptions} actions={actions}/>
        <TutorialPopup tutorialPages={tutorialPages}/>
        <div className="editorLine">
          <CommandEditor commands={commands} actions={actions}/>
          <CommandInput commands={commands} actions={actions} descriptions={descriptions}/>
          <Canvas commands={commands} actions={actions}/>
        </div>
        <div className="commandListLine">
          <CommandList commands={commands} descriptions={descriptions} actions={actions}/>
        </div>
      </div>
    );
  }
}


