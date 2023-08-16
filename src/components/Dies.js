import React from "react";
function Dies(props) {
  let isheld = props.on;
  const style = {
    backgroundColor: isheld ? "green" : "white",
    color: isheld? "white": "black"
  };
  return (
    <>
      <h2
        className="die"
        style={style}
        onClick={() => {
          props.handlehold(props.id);
        }}
      >
        {props.num}
      </h2>
    </>
  );
}
export default Dies;
