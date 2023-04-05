import type { SelectorType } from '../../Setup/Enums.js'
import type { PropertiedChangeHandler } from '../../Base/Propertied.js'
import type { Property } from '../../Setup/Property.js'
import type { Scalar } from '../../Types/Core.js'
import type { IndexHandler } from './Select.js'
import type { Movable, Movables } from '../../Media/Mash/Mash.js'


export interface Selected {
  selectType: SelectorType
  name?: string
}

export interface SelectedProperty extends Selected {
  property: Property
  changeHandler: PropertiedChangeHandler
  value: Scalar
}

export interface SelectedMovable extends Selected {
  value: Movables
  moveHandler: IndexHandler<Movable>
  removeHandler: IndexHandler<Movable>
  addHandler: IndexHandler<Movable>
}

export type SelectedItems = Array<SelectedProperty | SelectedMovable>

export type SelectedProperties = Array<SelectedProperty>

export type SelectedPropertyObject = Record<string, SelectedProperty>





