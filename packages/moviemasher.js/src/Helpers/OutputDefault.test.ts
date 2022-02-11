import { OutputFormat, OutputType } from "../Setup/Enums"
import { outputDefaultFromOptions } from "./OutputDefault"

describe("outputDefaultFromOptions", () => {
  test("type: OutputType.Audio", () => {
    const args = outputDefaultFromOptions({ type: OutputType.Audio })
    console.log('ARGS', args)
    expect(args.format).toEqual(OutputFormat.Mp3)
    // expect(args.type).toBe(0)
  })
  test("type: OutputType.Image", () => {
    const args = outputDefaultFromOptions({ type: OutputType.Image })
    console.log('Image', args)
    expect(args.format).toEqual(OutputFormat.Png)
    // expect(args.type).toBe(0)
  })
})
