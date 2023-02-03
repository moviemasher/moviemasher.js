import { describe, test } from 'node:test'
import assert from 'assert'

import { mashInstance } from "@moviemasher/moviemasher.js"
import { expectArrayLength } from "../../../../../../images/tester/Utilities/Expect.mjs"

describe("FilterGraph", () => {
  describe("mash with color/rect clip", () => {
    test("its CommandFilters are correct", () => {
      const mash = mashInstance({ tracks: [ { clips: [{}] }]})
      mash.imageSize = { width: 480, height: 270 }
      const filterGraphs = mash.filterGraphs()
      const { filterGraphVisible } = filterGraphs
      
      const { commandFilters } = filterGraphVisible
      // console.log("commandFilters", commandFilters)
      expectArrayLength(commandFilters, 4)
    })
  })
})
