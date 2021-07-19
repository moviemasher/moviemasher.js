import { TrackType } from "../Setup/Enums"

class TrackRange {
  constructor(first = 0, last = -1, type? : TrackType) {
    this.first = first
    this.last = last
    this.type = type
  }

  get count(): number { return 1 + this.last - this.first }

  last = -1

  get relative(): boolean { return this.last < 0 }

  equals(trackRange: TrackRange): boolean {
    return this.last === trackRange.last && this.first === trackRange.first
  }

  first = 0

  get tracks(): number[] {
    if (this.last < 0) return []

    return Array(this.last - this.first + 1).fill(0).map((_, idx) => this.first + idx)
  }

  toString(): string { return `[${this.type || 'av'}-${this.first}-${this.last}]` }

  type?: TrackType

  withEnd(last: number): TrackRange {
    return TrackRange.fromArgs(this.first, last, this.type)
  }

  withMax(max: number): TrackRange { return this.withEnd(max + this.last) }

  static ofType(type: TrackType, last = -1, first = 0): TrackRange {
    return this.fromArgs(first, last, type)
  }
  static fromArgs(first = 0, last = -1, type?: TrackType): TrackRange {
    return new TrackRange(first, last, type)
  }
}

export { TrackRange }
