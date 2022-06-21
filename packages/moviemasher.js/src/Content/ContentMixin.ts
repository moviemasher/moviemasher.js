import { InstanceClass } from "../Instance/Instance"
import { Scalar, SvgContent, ValueObject } from "../declarations"
import { Dimensions } from "../Setup/Dimensions"
import { Chain, ContentChainArgs, GraphFileArgs, GraphFiles, SelectedProperties } from "../MoveMe"
import { FilterChain } from "../Edited/Mash/FilterChain/FilterChain"

import { Actions } from "../Editor/Actions/Actions"
import { ChainLinks, FilterChainPhase, ServerFilters } from "../Filter/Filter"
import { Phase, SelectType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { isUndefined } from "../Utility/Is"
import { Content, ContentClass } from "./Content"

export function ContentMixin<T extends InstanceClass>(Base: T): ContentClass & T {
  return class extends Base implements Content {

    contentChain(args: ContentChainArgs): Chain {
      const chain: Chain = { commandFiles: [], commandFilters: [] }
      return chain
    }
    
    chainLinks(): ChainLinks {
      const links: ChainLinks = []
      // links.push(...super.chainLinks())
      links.push(this)
      return links
    }

    filterChainPhase(filterChain: FilterChain, phase: Phase): FilterChainPhase | undefined {
      const filterChainPhase: FilterChainPhase = { link: this }
      return filterChainPhase
    }
    filterChainServerFilters(filterChain: FilterChain, values: ValueObject): ServerFilters {
      return []
    }

    intrinsicDimensions(): Dimensions { return { width: 0, height: 0 }}

    mutable = false
    muted = false

    selectedProperties(actions: Actions, selectType: SelectType): SelectedProperties {
      const selectedProperties: SelectedProperties = []
      this.properties().forEach(property => {
        selectedProperties.push({
          selectType, property, value: this.value(property.name),
          changeHandler: (property: string, value: Scalar) => {
            const undoValue = this.value(property)
            const redoValue = isUndefined(value) ? undoValue : value
            actions.create({ property, target: this, redoValue, undoValue })
          },
        })
      })
      return selectedProperties
    }

    svgContent(): SvgContent { throw new Error(Errors.unimplemented) }

    graphFiles(args: GraphFileArgs): GraphFiles { return [] }
  }
}
