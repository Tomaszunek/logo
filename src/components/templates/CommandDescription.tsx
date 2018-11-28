import * as React from 'react';

export default class CommandDescription extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  public render() {
    const { descArr, args } = this.displayDescription(this.props.description);
    const { image } = this.props.description;
    return (
      <div className="commandItem">
        <img src={"./images/commands/" + image}/>        
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
    let image = "";
    for(const key in desc) {
      if(desc[key]) {
        image = desc[key].image;
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
          if(key !== "image") {
            descArr.push(
              <div style={style} key={key}>
                {key + " : " + desc[key]}
              </div>
            )
          }          
        }        
      }      
    }
    return {descArr, args, image};
  };
}

interface IProps {
    description: any
}

interface IState {
  html: string
}

