import { ClipType, TransformType, TransformTypes } from "../Setup"
import { Merger, Scaler } from "../Transform"
import { Is, Context, byFrame } from "../Utilities"
import { ColorFilter } from "../CoreFilter"
import { Clip } from "./Clip"
import { mediaTime } from "./with/mediaTime"
import { urlsFromMedia } from "./with/urlsFromMedia"
import { VisibleClip } from "../Decorators/VisibleClip"

const ChildTypes = ["to", "from"]
const ChildType = Object.fromEntries(ChildTypes.map(type => [type, type]))

const capitalize = value => {
  const string = Is.string(value) ? value : String(value)
  if (Is.emptystring(string)) return string

  return `${string[0].toUpperCase()}${string.substr(1)}`
}

@VisibleClip
class TransitionClip extends Clip {
  type : string = ClipType.transition

  children : object

  constructor(object) {
    super(object)
    this.children = Object.fromEntries(ChildTypes.map(type => [type, {}]))
  }
}

const definition = {
  ...urlsFromMedia,
  ...mediaTime,
  contextAtTimeForDimensions: {
    value(mashTime, dimensions, color, clips = []) {
      const sorted = clips.sort(byFrame)

      const context = Context.createDrawing(dimensions.width, dimensions.height)
      ColorFilter.draw({ context }, { color })

      const [fromClip, toClip] = sorted
      const defined = {
        [ChildType.to]: Is.object(toClip) && toClip,
        [ChildType.from]: Is.object(fromClip) && fromClip,
      }
      ChildTypes.forEach(childType => {
        const clip = defined[childType]
        if (!clip) return

        const drawing = Context.createDrawing(dimensions.width, dimensions.height)
        ColorFilter.draw({ drawing }, { color })

        clip.mergeContextAtTime(mashTime, drawing)

        const merger = this.child(childType, TransformType.merger)
        const scaler = this.child(childType, TransformType.scaler)

        const clipTimeRange = this.timeRangeRelative(mashTime)
        if (Is.undefined(clipTimeRange)) return

        const scaled = scaler.drawMediaFilters(clipTimeRange, drawing, dimensions)
        merger.drawMerger(clipTimeRange, scaled, context)
      })

      return context
    }
  },
  initializeChild: {
    value(childType, transformType) {
      const Klass = transformType === TransformType.merger ? Merger : Scaler
      return new Klass(this.object[childType])
    }
  },
  child: {
    value(childType, transformType) {
      return this[`${childType}${capitalize(transformType)}`]
    }
  },
}

ChildTypes.forEach(childType => {
  definition[childType] = {
    get() {
      if (Is.undefined(this.children[childType])) this.children[childType] = {}
      return this.children[childType]
    }
  }

  TransformTypes.forEach(transformType => {
    definition[`${childType}${capitalize(transformType)}`] = {
      get() {
        if (Is.undefined(this.children[childType][transformType])) {
          const child = this.initializeChild(childType, transformType)
          this.children[childType][transformType] = child
        }
        return this.children[childType][transformType]
      }
    }
  })
})

Object.defineProperties(TransitionClip.prototype, definition)

export { TransitionClip }
