import { PropertyTweenSuffix } from "../../Base/Propertied"
import { Scalar } from "../../declarations"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { InstanceClass } from "../../Instance/Instance"
import { DataType } from "../../Setup/Enums"
import { Property, propertyInstance } from "../../Setup/Property"
import { assertNumber, assertPopulatedString, isNumber, isTimeRange, isUndefined } from "../../Utility/Is"
import { tweenColorStep, tweenNumberStep } from "../../Utility/Tween"
import { Tweenable, TweenableClass, TweenableDefinition, TweenableObject } from "./Tweenable"

export function TweenableMixin<T extends InstanceClass>(Base: T): TweenableClass & T {
  return class extends Base implements Tweenable {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { container, content } = object as TweenableObject
      const properties: Property[] = [
        propertyInstance({
          tweenable: true, name: 'x', type: DataType.Percent, defaultValue: 0.5 
        }),
        propertyInstance({
          tweenable: true, name: 'y', type: DataType.Percent, defaultValue: 0.5
        })
      ]
      if (container) {
        properties.push(propertyInstance({ type: DataType.Mode }))
        properties.push(propertyInstance({
          tweenable: true, name: 'opacity', 
          type: DataType.Percent, defaultValue: 1.0
        }))
      }
      this.addProperties(object, ...properties)

      this.addProperties(object, propertyInstance({
        name: 'constrainHeight', type: DataType.Boolean
      }))
      this.addProperties(object, propertyInstance({
        name: 'constrainWidth', type: DataType.Boolean
      }))
    }

    declare constrainWidth: boolean

    declare constrainHeight: boolean

    tween(keyPrefix: string, time: Time, range: TimeRange): Scalar {
      const value = this.value(keyPrefix)
      const valueEnd = this.value(`${keyPrefix}${PropertyTweenSuffix}`)
      if (isUndefined(valueEnd)) return value

      const { frame: rangeFrame, frames } = range
      const { frame: timeFrame } = time
      const frame = timeFrame - rangeFrame
      if (isNumber(value)) {
        assertNumber(valueEnd)
        return tweenNumberStep(value, valueEnd, frame, frames)
      }
      assertPopulatedString(value)
      assertPopulatedString(valueEnd)
      return tweenColorStep(value, valueEnd, frame, frames)
    }

    tweenValues(key: string, time: Time, range: TimeRange): Scalar[] {
      const values: Scalar[] = []
      const isRange = isTimeRange(time)
      values.push(this.tween(key, isRange ? time.startTime : time, range))
      if (isRange) values.push(this.tween(key, time.endTime, range))
      return values
    }

    declare definition: TweenableDefinition
  }
}
