import { ColorContent, ColorContentDefinition } from "./ColorContent"
import { InstanceBase } from "../../Instance/InstanceBase"
import { ChainLinks, Filter } from "../../Filter/Filter"
import { ContentMixin } from "../ContentMixin"
import { SvgContent } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"

import { TrackPreview } from "../../Editor/Preview/TrackPreview/TrackPreview"

export class ColorContentClass extends ContentMixin(InstanceBase) implements ColorContent {
  constructor(...args: any[]) {
    super(...args)
    this.colorFilter = this.definition.colorFilterDefinition.instanceFromObject()
  }

  chainLinks(): ChainLinks {
    const links: ChainLinks = []
    links.push(this.colorFilter, ...super.chainLinks())
    return links
  }

  svgContent(filterChain: TrackPreview, dimensions: Dimensions): SvgContent {
    return this.colorFilter.svgContent(dimensions, filterChain)
  }

  declare color: string

  private colorFilter: Filter

  declare definition: ColorContentDefinition

}
