import * as React from "react";
import { useRef } from "react";
import { useRef } from "../../Framework/FrameworkFunctions";
import Forward from "../Forward/Forward";
import { mmIcon } from "../mmIcon";

function Test(props) {
  const ref = useRef(mmIcon());

  return <Forward inputRef={mmIcon()} />;
}

export default Test;
