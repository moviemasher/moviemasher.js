import type { SelectedProperty } from './types.js'
import type { DataType, Property, PropertyId, PropertyIds, Scalar } from '@moviemasher/shared-lib/types.js'
import type { TemplateResult } from 'lit'
import type { ControlProperty, ControlInput } from './types.js'

export interface Html extends TemplateResult<1> {}
export interface Htmls extends Array<Html> {}

export type TemplateContent = Html | Node | Scalar
export interface TemplateContents extends Array<TemplateContent> {}
export type OptionalContent = TemplateContent | void

export interface ControlGroup {
  addOrRemoveEnd(addOrRemove: string, propertyNamePrefix: string): void
  controlContent(name: string, icon?: string, more?: OptionalContent): OptionalContent
  controlInputContent(propertyId?: PropertyId, dataType?: DataType): OptionalContent
  controlInputContentEnd(namePrefix: string): OptionalContent
  currentValue(name: string): Scalar | undefined
  namePropertyId(name: string): PropertyId | undefined
  propertyIds?: PropertyIds
  propertyIdValue(nameOrPropertyId: string): Scalar | undefined
  propertyNameContent(propertyName: string): OptionalContent
  selectedProperty(propertyId: PropertyId): SelectedProperty | undefined
  updatePropertyIds: PropertyIds
}

export interface Control extends ControlProperty {
  setInputValue(value?: Scalar): boolean
  input?: ControlInput
  handleInput(): void
  inputSelectContent: OptionalContent
  endValueDefined: boolean
  inputValue?: Scalar
  property?: Property
  scalar?: Scalar
}
