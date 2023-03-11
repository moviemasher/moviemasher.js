
export type ForwardProps = {
	inputRef: any
}
export default function Forward(props: ForwardProps) {
	return <div ref={props.inputRef} />
}
