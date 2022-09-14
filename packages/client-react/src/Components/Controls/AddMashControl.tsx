import React from "react"
import { ComposerContext } from "../Composer/ComposerContext"

import { PropsAndChild, ReactResult, WithClassName } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { Problems } from "../../Setup/Problems"


export interface AddMashControlProps extends PropsAndChild, WithClassName {}
/**
 * @parents Masher
 */
export function AddMashControl(props: AddMashControlProps): ReactResult {
  const editor = useEditor()

  const composerContext = React.useContext(ComposerContext)
  const { children, ...rest } = props
  const child = React.Children.only(children)
  if (!React.isValidElement(child)) throw Problems.child

  const childProps = {
    ...rest, onClick: () => {
      editor.addMash()
      composerContext.refresh()
    }
  }
  return React.cloneElement(child, childProps)
}
