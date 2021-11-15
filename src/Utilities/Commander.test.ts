
import { Factory } from "../Factory/Factory"
import { Commander } from "./Commander";
import { Time } from "./Time"

describe("Commander", () => {
  test("visibleInputsAtTime", async () => {
    const mash = Factory.mash.instance({ video: [{ clips: [{ id: 'com.moviemasher.theme.color' }] }]})
    const time = Time.fromArgs(0, 10)
    const result = await Commander.visibleInputsAtTime(mash, time)
    expect(result).toBeInstanceOf(Object)
    console.log("visibleInputsAtTime", result)
  })
})
