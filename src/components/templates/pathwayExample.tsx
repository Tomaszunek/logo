import * as React from 'react';
import { IPathwayExample } from 'src/models';
const images = require.context('../../images', true);

export default class PathwayExample extends React.Component<IProps, IState> {  
  constructor(props: any) {
    super(props)    
  };   

  public render() {
    const { name, path, image } = this.props.examplePath;
    console.log(images, image);

    // const imgSrc = images(image)
    // console.log(imgSrc);
    return (
        <div className="pathexample">
            <p>{name}</p>
            {/* <img src={imgSrc} alt=""/> */}
            <p>{path}</p>
        </div>
    );
  } 
}

interface IProps {
    examplePath: IPathwayExample
}

interface IState {
  html: string
}

