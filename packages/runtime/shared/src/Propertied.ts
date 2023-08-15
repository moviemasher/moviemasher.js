import type { Scalar, ScalarRecord, UnknownRecord } from './Core.js'
import type { Properties, Property } from './Property.js'
import type { PropertyId, PropertyIds, TargetId, TargetIds } from './Select.js'

export type ScalarsById = Record<PropertyId, Scalar | undefined>

export interface Propertied {
  initializeProperties(object: unknown): void
  properties: Properties
  propertyFind(name: string): Property | undefined
  propertyIds(targetIds?: TargetIds): PropertyIds
  scalarRecord: ScalarRecord 
  setValue(name: string, value?: Scalar, property?: Property): void
  targetId: TargetId
  toJSON(): UnknownRecord

  value(key: string): Scalar | undefined
}