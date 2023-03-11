
import { useRef, onMount, onInit } from "@builder.io/mitosis"
import Forward from "../Forward/Forward.lite"
import { mmIcon } from "../mmIcon"


export default function Test() {
	const ref = useRef<HTMLSpanElement>()
	onInit(() => {
    console.log('First: I have inited!', ref);
		ref.appendChild(mmIcon())
  });

  onMount(() => {
    console.log('Second: I have mounted!', ref);
  });
  return <span ref={ref} />;
}

