
import { useRef, useStore } from "../../Framework/FrameworkFunctions"
import Forward from "../Forward/Forward.lite"
import { mmIcon } from "../mmIcon"


export default function Test() {
	// useStore({
	// 	icon: mmIcon(),
	// })
	const ref = useRef<SVGSVGElement>(mmIcon())
  // React.useEffect(() => {
	// 	const icon = mmIcon()
	// 	assertDefined(icon)
  //   ref.current!.appendChild(icon)
  // }, [])

	return <Forward inputRef={mmIcon()}></Forward>
}

