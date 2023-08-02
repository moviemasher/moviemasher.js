import type { Scalar, ScalarRecord, UnknownRecord } from './Core.js'
import type { Properties, Property } from './Property.js'
import type { PropertyIds, TargetIds } from './Select.js'

export interface Propertied {
  initializeProperties(object: unknown): void
  properties: Properties
  propertyFind(name: string): Property | undefined
  propertyIds(targetIds?: TargetIds): PropertyIds
  setValue(name: string, value?: Scalar, property?: Property): void
  toJSON(): UnknownRecord
  value(key: string): Scalar | undefined
}
