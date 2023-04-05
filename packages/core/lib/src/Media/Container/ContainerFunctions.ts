import type { ContainerObject, ContainerDefinition, Container } from './Container.js'

import { isContainingType } from '../../Setup/Enums.js'
import { isObject } from '../../Utility/Is.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { isTweenable, isTweenableDefinition } from '../../Mixin/Tweenable/TweenableFunctions.js'

export const isContainerObject = (value: any): value is ContainerObject => {
  return isObject(value) && 'opacity' in value
}

export function assertContainerObject(value: any): asserts value is ContainerObject {
  if (!isContainerObject(value))
    errorThrow(value, 'ContainerObject')
}

export const isContainerDefinition = (value?: any): value is ContainerDefinition => {
  return isTweenableDefinition(value) && isContainingType(value.type)
}

export const isContainer = (value?: any): value is Container => {
  return isTweenable(value) && isContainingType(value.type)
}

export function assertContainer(value?: any): asserts value is Container {
  if (!isContainer(value))
    throw new Error('expected Container')
}
