import * as React from 'react';
import commandImage from 'src/images/command1.jpg';


export default class CommandDescription extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  public render() {
    const { descArr, args } = this.displayDescription(this.props.description)
    return (
      <div className="commandItem">
        <img src={commandImage}/>        
        <div className="itemDesc">
          <div className="description">          
            {descArr}
          </div>
          <div className="args">
            {args} 
          </div>
        </div>       
      </div>
    );
  }

  private displayDescription = (desc: any) => {
    const descArr = [];
    let args: any;
    for(const key in desc) {
      if(desc[key]) {
        if(Array.isArray(desc[key]) && desc[key].length) {
          args = (
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
          const style = {
            background: (key === "color") ? desc[key] : ''
          }
          descArr.push(
            <div style={style} key={key}>
              {key + " : " + desc[key]}
            </div>
          )
        }        
      }      
    }
    return {descArr, args};
  };
}

interface IProps {
    description: any
}

interface IState {
  html: string
}

