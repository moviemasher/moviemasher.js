import { ShowProps } from "./Show"

export default function Show(props: ShowProps) {
  const { when, else: otherwise, children } = props
  if (when) { return children }
  if (otherwise) return otherwise
  return null
}