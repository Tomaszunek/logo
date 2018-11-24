import * as React from 'react';
import commandImage from 'src/images/command1.jpg';


export default class CommandDescription extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  public render() {
    // const { short, name, long,  color, description, argCount, args } = this.props.description;
    const { description } = this.props;   
 
    return (
      <div className="commandItem">
        <img src={commandImage}/>
        <div className="description">
          {description.map((desc: any, index: string) => {
            if(Array.isArray(desc)) {
              return;
            } else {
              return <div key={index}>
              {index + " : " + desc}
            </div>
            }            
          })}
          {}
          {/* {args} */a}
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

