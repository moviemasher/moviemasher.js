import type { SelectedProperty } from '@moviemasher/runtime-client'
import type { DataType, Property, PropertyId, PropertyIds, Scalar } from '@moviemasher/runtime-shared'
import type { TemplateResult } from 'lit'
import type { ControlProperty, ControlInput } from '@moviemasher/runtime-client'

export interface Html extends TemplateResult<1> {}
export interface Htmls extends Array<Html> {}

export type Content = Html | Node | Scalar
export interface Contents extends Array<Content> {}
export type OptionalContent = Content | void

export interface ControlGroup {
  addOrRemoveEnd(addOrRemove: string, propertyNamePrefix: string): void
  controlContent(name: string, icon?: string): OptionalContent
  controlInputContent(propertyId?: PropertyId, dataType?: DataType): OptionalContent
  controlInputContentEnd(namePrefix: string): OptionalContent
  currentValue(name: string): Scalar | undefined
  namePropertyId(name: string): PropertyId | undefined
  propertyIds?: PropertyIds
  propertyIdValue(nameOrPropertyId: string): Scalar | undefined
  propertyNameContent(propertyName: string): OptionalContent
  selectedProperty(propertyId: PropertyId): SelectedProperty | undefined
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
