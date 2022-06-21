import { mashInstance } from "../MashFactory"
import { visibleClipDefault } from "../../../Media/VisibleClip/VisibleClipFactory"
import { expectArrayLength } from "../../../../../../dev/test/Utilities/expectArrayLength"
import { FilterChain, FilterChainArgs } from "../FilterChain/FilterChain"
import { FilterChainClass } from "../FilterChain"
import { FilterGraphInput } from "./FilterGraphClass"

describe("FilterGraph", () => {
  describe("mash with color/rect clip", () => {
    const mash = mashInstance({ tracks: [ { clips: [{ definitionId: visibleClipDefault.id }] }]})
    const filterGraphs = mash.filterGraphs()
    const { filterGraphAudible, filterGraphVisible, filterGraphsVisible } = filterGraphs
    const { filterChains } = filterGraphVisible
    const filterChain: FilterChain = filterChains[0]
    test("contains a single FilterChain", () => {
      expect(filterGraphAudible).toBeUndefined()
      expectArrayLength(filterGraphsVisible, 1)
      expectArrayLength(filterChains, 1)
      expect(filterChain).toBeDefined()
    })
    test("its FilterChain is correctly initialized", () => {
      const { args } = filterChain
      expect(args.input).toEqual(FilterGraphInput)
      expect(args.track).toEqual(0)
      expect(args.lastTrack).toEqual(true)
    })
    test("its CommandFilters are correct", () => {
  
      const { commandFilters } = filterGraphVisible
      console.log("commandFilters", commandFilters)
      expectArrayLength(commandFilters, 3)
    })
  })
})
