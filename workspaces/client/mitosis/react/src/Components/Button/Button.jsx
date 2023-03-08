import * as React from "react";

function Button(props) {
  return (
    <button
      onClick={(event) => props.onClick(event)}
      disabled={props.disabled}
      className={props.className}
    >
      {props.children}
    </button>
  );
}

export default Button;
