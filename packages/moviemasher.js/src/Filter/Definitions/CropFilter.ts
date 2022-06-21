import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { Parameter } from "../../Setup/Parameter"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"

/**
 * @category Filter
 */
export class CropFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, name: 'width', type: DataType.Number,
      defaultValue: 1.0, min: 0.0, max: 2.0, step: 0.01
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'height', type: DataType.Number,
      defaultValue: 1.0, min: 0.0, max: 2.0, step: 0.01
    }))

    this.parameters.push(new Parameter({
      name: "x", value: "((in_w - out_w) / 2)", dataType: DataType.String
    }))
    this.parameters.push(new Parameter({
      name: "y", value: "((in_h - out_h) / 2)", dataType: DataType.String
    }))
    this.parameters.push(new Parameter({
      name: "out_w", value: "out_width", dataType: DataType.String
    }))
    this.parameters.push(new Parameter({
      name: "out_h", value: "out_height", dataType: DataType.String
    }))
  }

}
