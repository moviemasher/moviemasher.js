import { JobOptions } from "./Job"
import { JobClass } from "./JobClass"
import { JobFactory } from "./JobFactory"

describe("JobFactory", () => {
  describe("instance", () => {
    test("returns job object", () => {
      const object: JobOptions = {
        mash: {}, outputs: []
      }
      expect(JobFactory.instance(object)).toBeInstanceOf(JobClass)



    })
  })
})
