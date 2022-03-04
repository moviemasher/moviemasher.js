import { FilterChain } from "../declarations"

const filterChainLastLabel = (filterChain: FilterChain): string | undefined => {
  const { graphFilters } = filterChain
  const last = graphFilters[graphFilters.length - 1]
  const { outputs } = last
  if (!outputs?.length) return

  return outputs[outputs.length - 1]
}


export { filterChainLastLabel }
