import * as React from "react";
import { forwardRef } from "react";

const Forward = forwardRef(function Forward(props, inputRef) {
  return <div ref={inputRef} />;
});

export default Forward;
