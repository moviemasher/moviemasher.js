import * as React from "react";
import { useState, useContext } from "react";
import ClientContext from "../../Contexts/ClientContext.context.js";

function MasherApp(props) {
  const [name, setName] = useState(() => "Foo");

  const clientContext = useContext(ClientContext);

  return (
    <div className="my-class-name">
      {props.message || "Hello"}
      {name}! !{props.children}
    </div>
  );
}

export default MasherApp;
