import * as React from 'react';

interface IProps {
  description: any;
}

const CommandDescription: React.FC<IProps> = ({ description }) => {
  const { descArr, args, image } = displayDescription(description);

  function displayDescription(desc: any) {
    const descArr: React.ReactNode[] = [];
    let args: any;
    let image = "";
    for (const key in desc) {
      if (desc[key]) {
        image = desc[key].image;
        if (Array.isArray(desc[key]) && desc[key].length) {
          args = (
            <div key={key}>
              Function arguments:
              {desc[key].map((arg: any, ind: any) => (
                <div key={ind}>Name: {arg.name} - type of {arg.type}</div>
              ))}
            </div>
          );
        } else {
          const style = {
            background: key === "color" ? desc[key] : "",
          };
          if (key !== "image") {
            descArr.push(
              <div style={style} key={key}>
                {`${key} : ${desc[key]}`}
              </div>
            );
          }
        }
      }
    }
    return { descArr, args, image };
  }

  return (
    <div className="commandItem">
      <img src={`./images/commands/${image}`} />
      <div className="itemDesc">
        <div className="description">{descArr}</div>
        <div className="args">{args}</div>
      </div>
    </div>
  );
};

export default CommandDescription;
