import { FilterChain } from "../declarations"

const filterChainLastLabel = (filterChain: FilterChain): string | undefined => {
  const { filters } = filterChain
  const last = filters[filters.length - 1]
  const { outputs } = last
  if (!outputs?.length) return

  return outputs[outputs.length - 1]
}


export { filterChainLastLabel }
