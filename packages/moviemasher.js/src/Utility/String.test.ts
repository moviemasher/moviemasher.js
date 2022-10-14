
import { stringSeconds } from "./String"

describe("stringSeconds", () => {
  test("returns expected response", () => {
    expect(stringSeconds(0.5, 30, 3)).toBe('00.50')
    expect(stringSeconds(0.9, 30, 3)).toBe('00.90')
    expect(stringSeconds(0.12324, 30, 3)).toBe('00.12')
    expect(stringSeconds(0.126, 30, 3)).toBe('00.13')
    expect(stringSeconds(0.5, 10, 3)).toBe('00.5')
    expect(stringSeconds(5.51, 10, 100)).toBe('00:05.5')
    expect(stringSeconds(5.57, 10, 100)).toBe('00:05.6')
    expect(stringSeconds(65.57, 10, 100)).toBe('01:05.6')
  })
})