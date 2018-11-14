import * as React from 'react';
import Canvas from './components/canvas';
import CommandEditor from './components/commandEditor';
import CommandList from './components/commandList';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { CommandActions } from './actions';
import { CommandModel, ICommandModel } from './models';
import { IRootState, RootState } from './reducers';
import { omit } from './utils';
import './App.scss';

const FILTER_VALUES = (Object.keys(CommandModel.Filter) as 
  (keyof typeof CommandModel.Filter)[]).map(
  (key) => CommandModel.Filter[key]
);

const FILTER_FUNCTIONS: Record<CommandModel.Filter, (todo: ICommandModel) => boolean> = {
  [CommandModel.Filter.SHOW_ALL]: () => true,
  [CommandModel.Filter.SHOW_ACTIVE]: (command) => !command.value,
  [CommandModel.Filter.SHOW_COMPLETED]: (command) => !!command.value
};

export namespace App {
  export interface IProps extends RouteComponentProps<void> {
    commands: RootState.CommandState;
    actions: CommandActions;
    filter: CommandModel.Filter;
  }
}

@connect(
  (state: IRootState, ownProps): Pick<App.IProps, 'commands' | 'filter'> => {
    const hash = ownProps.location && ownProps.location.hash.replace('#', '');
    const filter = FILTER_VALUES.find((value) => value === hash) || CommandModel.Filter.SHOW_ALL;
    return { commands: state.commands, filter };
  },
  (dispatch: Dispatch): Pick<App.IProps, 'actions'> => ({
    actions: bindActionCreators(omit(CommandActions, 'Type'), dispatch)
  })
)
export default class App extends React.Component<App.IProps> {
  public handleClearCompleted(): void {
    const hasCompletedTodo = this.props.commands.some((todo) => !!todo.value || false);
    if (hasCompletedTodo) {
      this.props.actions.clearCompleted();
    }
  }
  public handleFilterChange(filter: CommandModel.Filter): void {
    this.props.history.push(`#${filter}`);
  }
  public render() {
    const { commands, actions, filter } = this.props;
    const activeCount = commands.length - commands.filter((command) => command.value).length;
    const filteredTodos = filter ? commands.filter(FILTER_FUNCTIONS[filter]) : commands;
    const completedCount = commands.reduce((count, todo) => (todo.value ? count + 1 : count), 0);
    const arr = [commands, actions, filter, activeCount, filteredTodos, completedCount];
    console.log(arr);
    return (
      <div className="App">
        <div className="editorLine">
          <CommandEditor commands={commands} actions={actions}/>
          <Canvas/>
        </div>
        <div className="commandListLine">
          <CommandList/>
        </div>
      </div>
    );
  }
}


