import React from "react"
import { ComposerContext } from "../Composer/ComposerContext"

import { PropsAndChild, ReactResult, WithClassName } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { Problems } from "../../Setup/Problems"


export interface AddFolderControlProps extends PropsAndChild, WithClassName {}
/**
 * @parents Masher
 */
export function AddFolderControl(props: AddFolderControlProps): ReactResult {
  const editor = useEditor()
  const composerContext = React.useContext(ComposerContext)
  const { children, ...rest } = props
  const child = React.Children.only(children)
  if (!React.isValidElement(child)) throw Problems.child

  const childProps = {
    ...rest, onClick: () => {
      editor.addFolder()
      composerContext.refresh()
    }
  }
  return React.cloneElement(child, childProps)
}
