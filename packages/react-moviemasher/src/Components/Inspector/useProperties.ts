
import { useSelected } from "./useSelected"

const useProperties = () => {
  const selected = useSelected()

  const { definition } = selected
  const { properties } = definition
  return properties
}
export { useProperties }
