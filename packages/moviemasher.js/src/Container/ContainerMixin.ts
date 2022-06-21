import { InstanceClass } from "../Instance/Instance"
import { Scalar, SvgContent, SvgFilters, ValueObject } from "../declarations"
import { Dimensions } from "../Setup/Dimensions"
import { Chain, ContainerChainArgs, GraphFileArgs, GraphFiles, SelectedProperties, Transforms } from "../MoveMe"
import { TrackPreview } from "../Editor/Preview/TrackPreview/TrackPreview"
import { FilterChain } from "../Edited/Mash/FilterChain/FilterChain"

import { Actions } from "../Editor/Actions/Actions"
import { ChainLinks, Filter, FilterChainPhase, ServerFilters } from "../Filter/Filter"
import { Phase, SelectType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { isAboveZero, isBelowOne, isUndefined } from "../Utility/Is"
import { Container, ContainerClass, ContainerDefinition } from "./Container"
import { chainAppend } from "../Utility/Chain"

export function ContainerMixin<T extends InstanceClass>(Base: T): ContainerClass & T {
  return class extends Base implements Container {
    constructor(...args: any[]) {
      super(...args)
      this.overlayFilter = this.definition.overlayFilterDefinition.instanceFromObject()

      this.scaleFilter = this.definition.scaleFilterDefinition.instanceFromObject()
      this.setsarFilter = this.definition.setsarFilterDefinition.instanceFromObject()

      this.opacityFilter = this.definition.opacityFilterDefinition.instanceFromObject()
      this.blendFilter = this.definition.blendFilterDefinition.instanceFromObject()
    }
    
    declare mode: number

    declare opacity: number

    opacityFilter: Filter

    blendFilter: Filter

    containerChain(args: ContainerChainArgs): Chain {
      const { outputDimensions, previousOutput } = args
      console.log(this.constructor.name, "containerChain", this.mode, this.opacity)
      const chain: Chain = { commandFiles: [], commandFilters: [] }
      const {commandFilters} = chain
      if (isBelowOne(this.opacity)) {
        chainAppend(chain, this.opacityFilter.chain(outputDimensions, this))
      }
      if (isAboveZero(this.mode)) {
        chainAppend(chain, this.blendFilter.chain(outputDimensions, this))
      } else {
        chainAppend(chain, this.overlayFilter.chain(outputDimensions, this))
      }
      // const [commandFilter] = commandFilters
      // const { inputs } = commandFilter
      // if (inputs && !inputs.length) inputs.push(this.id)
      return chain
    }

    chainLinks(): ChainLinks {
      const links: ChainLinks = [this.scaleFilter, this.setsarFilter]
      links.push(this.overlayFilter)
      return links
    }
    declare definition: ContainerDefinition

    filterChainPhase(filterChain: FilterChain, phase: Phase): FilterChainPhase | undefined {
      const filterChainPhase: FilterChainPhase = { link: this }
      return filterChainPhase
    }

    filterChainServerFilters(filterChain: FilterChain, values: ValueObject): ServerFilters {
      return []
    }

    intrinsicDimensions(): Dimensions { throw new Error(Errors.unimplemented) }

    graphFiles(args: GraphFileArgs): GraphFiles { return [] }

    mutable = false

    muted = false

    positionable = true

    overlayFilter: Filter

    declare x: number

    declare y: number

    declare height: number

    protected scaleFilter: Filter

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

    protected setsarFilter: Filter


    svgContent(): SvgContent { throw new Error(Errors.unimplemented) }

    svgFilters(filterChain: TrackPreview): SvgFilters {
      return [
        ...this.opacityFilter.svgFilters(filterChain),
        ...this.blendFilter.svgFilters(filterChain),
      ]
    }

    transforms(filterChain: TrackPreview): Transforms {
      const dimensions = this.intrinsicDimensions()
      return [
        ...this.scaleFilter.transforms(dimensions, filterChain),
        ...this.overlayFilter.transforms(dimensions, filterChain),
      ]
    }

    transformSvgContent(filterChain: TrackPreview): SvgContent {
      throw new Error(Errors.unimplemented)
    }

    sizeable = true

    declare width: number

  }
}
