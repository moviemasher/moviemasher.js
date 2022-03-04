import { ValueObject, ModularGraphFilter } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { VisibleContext } from "../../../Context/VisibleContext"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"
import { Parameter } from "../../../Setup"

/**
 * @category Filter
 */
class SetSarFilter extends FilterDefinitionClass {
  draw(evaluator: Evaluator): VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    return context
  }

  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    const sar = evaluator.evaluateParameter('sar')
    const max = evaluator.evaluateParameter('max')

    return {
      inputs: [],
      outputs: ['SAR'],
      filter: this.ffmpegFilter,
      options: { sar, max }
    }
  }

  parameters: Parameter[] = [
    new Parameter({ name: "sar", value: 1 }),
    new Parameter({ name: "max", value: 1 })
  ]
}

export { SetSarFilter }
