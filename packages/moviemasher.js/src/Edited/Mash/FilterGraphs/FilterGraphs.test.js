import { describe, test } from 'node:test'
import assert from 'assert'

import { FilterGraphsClass, mashInstance, FilterGraphClass } from "@moviemasher/moviemasher.js"
import { expectArrayLength } from "../../../../../../images/tester/Utilities/Expect.mjs"


describe("FilterGraphs", () => {
  describe("empty mash", () => {
    test("it contains no audible or visible FilterGraph", () => {
      const mash = mashInstance()
      const filterGraphs = mash.filterGraphs()
      const { filterGraphAudible, filterGraphVisible, filterGraphsVisible } = filterGraphs
      assert(filterGraphs instanceof FilterGraphsClass)
      assert(!filterGraphAudible)
      assert(!filterGraphVisible)
      expectArrayLength(filterGraphsVisible, 0)
    })  
  })
  
  describe("mash with single clip", () => {
    test("it contains a single visible FilterGraph", () => {
      const mash = mashInstance({ tracks: [ { clips: [{}] }]})
      const filterGraphs = mash.filterGraphs()
      const { filterGraphAudible, filterGraphVisible, filterGraphsVisible } = filterGraphs
      assert(!filterGraphAudible)
      expectArrayLength(filterGraphsVisible, 1)
      assert(filterGraphVisible)
      assert(filterGraphVisible instanceof FilterGraphClass)
      assert.equal(filterGraphsVisible[0], filterGraphVisible)
    })
    
    test("its visible FilterGraph contains correct CommandFilters", () => {
      const mash = mashInstance({ tracks: [ { clips: [{}] }]})
      mash.imageSize = { width: 640, height: 480 }
      const filterGraphs = mash.filterGraphs()
      const { filterGraphAudible, filterGraphVisible, filterGraphsVisible } = filterGraphs
      const { commandFilters } = filterGraphVisible
      expectArrayLength(commandFilters, 4)
    })
  })
})
