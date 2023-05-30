import type { Scalar, ScalarRecord, UnknownRecord } from './Core.js'
import type { Properties, Property } from './Property.js'

export interface Propertied {
  addProperties(object: any, ...properties: Properties): void
  initializeProperties(object: unknown): void
  properties: Properties
  setValue(value: Scalar, name: string, property?: Property ): void
  setValues(object: ScalarRecord): void
  toJSON(): UnknownRecord
  value(key: string): Scalar
}
