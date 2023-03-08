
import { MouseEventFunction } from "../../Framework/Framework"
import /* type */ { PropsWithChildren } from "../../Types/Props"

export interface ButtonProps extends PropsWithChildren {
  onClick: MouseEventFunction
  disabled?: boolean
  selected?: boolean
}

export default function Button(props: ButtonProps) {
  return <button 
    onClick={event => props.onClick(event) }
    disabled={props.disabled}
    className={props.className}
   >{props.children}</button>

}
