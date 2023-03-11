import * as React from "react";
import { useRef, useEffect } from "react";
import { mmIcon } from "../mmIcon";

function Test(props) {
  const ref = useRef(null);

  useEffect(() => {
    console.log("First: I have inited!", ref.current);
    ref.current.appendChild(mmIcon());
  }, []);

  useEffect(() => {
    console.log("Second: I have mounted!", ref.current);
  }, []);

  return <span ref={ref} />;
}

export default Test;
