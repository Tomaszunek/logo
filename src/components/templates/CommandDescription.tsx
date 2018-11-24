import * as React from 'react';
import commandImage from 'src/images/command1.jpg';


export default class CommandDescription extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  public render() {
    // const { short, name, long,  color, description, argCount, args } = this.props.description;
    const { name, color, short, long, description, argCount} = this.props.description;   
 
    return (
      <div className="commandItem">
        <img src={commandImage}/>
        <div className="description">
          {name}
          {color}
          {short}
          {long}
          {argCount}
          {description}
          {/* {args} */}
        </div>        
      </div>
    );
  } 
}

interface IProps {
    description: any
}

interface IState {
  html: string
}

