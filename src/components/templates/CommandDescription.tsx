import * as React from 'react';
import commandImage from 'src/images/command1.jpg';


export default class CommandDescription extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  public render() {
    const { description } = this.props; 
    return (
      <div className="commandItem">
        <img src={commandImage}/>
        <div className="description">          
          {this.displayDescription(description)}
        </div>        
      </div>
    );
  }

  private displayDescription = (desc: any) => {
    const descArr = [];
    for(const key in desc) {
      if(desc[key]) {
        if(Array.isArray(desc[key])) {
          descArr.push(
            (
              <div key={key}>
                Function arguments:
                {desc[key].map((arg: any, ind: any) => {
                  return (
                    <div key={ind}>
                      {"Name: " + arg.name + ' - type of ' + arg.type}
                    </div>                    
                  )
                })}
              </div>
            )
          )
        } else {
          descArr.push(
            <div key={key}>
              {key + " : " + desc[key]}
            </div>
          )
        }        
      }      
    }
    return descArr;
  };
}

interface IProps {
    description: any
}

interface IState {
  html: string
}

