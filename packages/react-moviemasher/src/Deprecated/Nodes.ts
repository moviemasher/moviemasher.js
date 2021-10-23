import React from "react"
import { NodesArray } from "../declarations"

const nodesArray = (children : React.ReactNode) => React.Children.toArray(children)

const nodesFindChild = (nodes: NodesArray, id : string) : React.ReactElement | void => {
  const found = nodes.find(node => {
    if (!React.isValidElement(node)) return false

    return node.props.id === id
  })
  if (found && React.isValidElement(found)) return found
}
const nodesFind = (children : React.ReactNode, id : string) => {
  return nodesFindChild(nodesArray(children), id)
}
const Nodes = {
  array: nodesArray,
  find: nodesFind,
  findChild: nodesFindChild,
}

export {
  Nodes,
  nodesArray,
  nodesFind,
}
