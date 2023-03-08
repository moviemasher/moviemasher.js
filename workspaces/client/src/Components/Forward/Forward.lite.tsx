
export type ForwardProps = {
	inputRef: any
}
export default function Forward(props: ForwardProps) {
	return <svg ref={props.inputRef} />
}
