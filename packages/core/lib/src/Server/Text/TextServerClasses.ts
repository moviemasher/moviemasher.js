import { VisibleInstanceMixin } from '../../Shared/Visible/VisibleInstanceMixin.js'
import { VisibleServerInstanceMixin } from "../VisibleServerInstanceMixin.js"
import { ServerInstanceClass } from '../ServerInstanceClass.js'
import { ImageInstance } from "../../Shared/Image/ImageInstance.js"
import type {Tweening} from '../../Helpers/TweenFunctions.js'
import type {CommandFile, CommandFiles, CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, GraphFile, GraphFiles, PreloadArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs} from '../../Base/Code.js'

import {colorBlack, colorBlackTransparent, colorWhite} from '../../Helpers/Color/ColorConstants.js'
import {assertPopulatedString, assertTrue} from '../../Shared/SharedGuards.js'
import {arrayLast} from '../../Utility/ArrayFunctions.js'
import { tweenMaxSize} from '../../Helpers/TweenFunctions.js'
import { PropertyTweenSuffix } from "../../Base/PropertiedConstants.js"
import { GraphFileTypeTxt, LockNone, TypeFont } from '../../Setup/EnumConstantsAndFunctions.js'
import { ScalarRecord } from '@moviemasher/runtime-shared'
import { TextAsset, TextInstance, TextInstanceObject } from '../../Shared/Text/TextTypes.js'
import { ServerAsset } from '../ServerAsset.js'
import { VisibleAssetMixin } from '../../Shared/Visible/VisibleAssetMixin.js'
import { TextAssetMixin, TextInstanceMixin } from '../../Shared/Text/TextMixins.js'
import { VisibleServerAssetMixin } from '../VisibleServerAssetMixin.js'
import { TextServerAsset } from './TextServerTypes.js'
import { TextHeight } from '../../Shared/Text/TextConstants.js'
import { assertEndpoint, endpointUrl } from '../../Helpers/Endpoint/EndpointFunctions.js'
import { ServerImportedAssetClass } from '../Imported/ServerImportedAssetClass.js'

const WithAsset = VisibleAssetMixin(ServerImportedAssetClass)
const WithServerAsset = VisibleServerAssetMixin(WithAsset)
const WithTextAsset = TextAssetMixin(WithServerAsset)

export class ServerTextAssetClass extends WithTextAsset implements TextServerAsset {


  canColor(args: CommandFilterArgs): boolean { return true }

  canColorTween(args: CommandFilterArgs): boolean { return true }

 
  graphFiles(args: PreloadArgs): GraphFiles {
    const { visible } = args
    if (!visible) return []
    
    const { request } = this
    const { endpoint } = request
    assertEndpoint(endpoint)
    const file = endpointUrl(endpoint) 


    // const file = editing ? url : source
    const graphFile: GraphFile = {
      type: TypeFont, file, definition: this
    }
    return [graphFile]
  }


  instanceFromObject(object?: TextInstanceObject): TextInstance {
    const args = this.instanceArgs(object)
    return new ServerTextInstanceClass(args)
  }
}

const WithInstance = VisibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = VisibleServerInstanceMixin(WithInstance)
const WithTextInstance = TextInstanceMixin(WithServerInstance)

export class ServerTextInstanceClass extends WithTextInstance implements ImageInstance { 
  
  declare asset: TextAsset & ServerAsset


  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { 
      contentColors: colors = [], outputSize, track, filterInput: input,
      containerRects, videoRate, commandFiles, duration
    } = args
  
    let filterInput = input
    // console.log(this.constructor.name, 'initialCommandFilters', filterInput, tweening)

    if (filterInput) {
      commandFilters.push(this.copyCommandFilter(filterInput, track))
    }

    const [rect, rectEnd] = containerRects
    const { height, width } = rect
 
    // console.log(this.constructor.name, 'initialCommandFilters', merging, ...containerRects)
    const maxSize = tweenMaxSize(...containerRects) 

    let colorInput = ''
    const merging = !!filterInput || tweening.size
    if (merging) {
      const backColor = filterInput ? colorBlack : colorBlackTransparent
      const colorArgs: VisibleCommandFilterArgs = { 
        ...args, 
        contentColors: [backColor, backColor], 
        outputSize: maxSize
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs))
      colorInput = arrayLast(arrayLast(commandFilters).outputs) 
    }

    const textFile = commandFiles.find(commandFile => (
      commandFile.inputId === this.id && commandFile.type === GraphFileTypeTxt
    ))
    assertTrue(textFile, 'text file') 
    const { resolved: textfile } = textFile
    assertPopulatedString(textfile, 'textfile')

    const fontFile = commandFiles.find(commandFile => (
      commandFile.inputId === this.id && commandFile.type === TypeFont
    ))
    assertTrue(fontFile, 'font file') 
    
    const { resolved: fontfile } = fontFile
    assertPopulatedString(fontfile, 'fontfile')

    const { textFilter, lock } = this
    const intrinsicRect = this.intrinsicRect()
    const x = intrinsicRect.x * (rect.width / intrinsicRect.width)
    const y = 0 // intrinsicRect.y * (height / intrinsicRect.height)
    const [color = colorWhite, colorEnd] = colors
    assertPopulatedString(color)

    const xEnd = intrinsicRect.x * (rectEnd.width / intrinsicRect.width)
    const yEnd = 0 // intrinsicRect.y * (rectEnd.height / intrinsicRect.height)
    // console.log(this.constructor.name, 'initialCommandFilters', lock)
    const intrinsicRatio = TextHeight / intrinsicRect.height
    const textSize = Math.round(height * intrinsicRatio)
    const textSizeEnd = Math.round(rectEnd.height * intrinsicRatio)
    const options: ScalarRecord = { 
      x, y, width, height: textSize, color, textfile, fontfile,
      stretch: lock === LockNone,
      intrinsicHeight: intrinsicRect.height,
      intrinsicWidth: intrinsicRect.width,
    }
    if (xEnd) options[`x${PropertyTweenSuffix}`] = xEnd
    if (yEnd) options[`y${PropertyTweenSuffix}`] = yEnd
    if (colorEnd) options[`color${PropertyTweenSuffix}`] = colorEnd
    if (textSizeEnd) options[`height${PropertyTweenSuffix}`] = textSizeEnd
    if (rectEnd.width) options[`width${PropertyTweenSuffix}`] = rectEnd.width

    textFilter.setValues(options)
    // console.log(this.constructor.name, 'initialCommandFilters', options)

    const textArgs: FilterCommandFilterArgs = {
      dimensions: outputSize, videoRate, duration, filterInput
    }
    commandFilters.push(...textFilter.commandFilters(textArgs))
    
    if (merging) {
      filterInput = arrayLast(arrayLast(commandFilters).outputs)
      assertPopulatedString(filterInput, 'overlay filterInput')
      commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))

      filterInput = arrayLast(arrayLast(commandFilters).outputs) 
      assertPopulatedString(filterInput, 'crop filterInput')

      const cropArgs: FilterCommandFilterArgs = { 
        duration: 0, videoRate, filterInput
      }
      const { cropFilter } = this
      cropFilter.setValue(maxSize.width, 'width')
      cropFilter.setValue(maxSize.height, 'height')
      cropFilter.setValue(0, 'x')
      cropFilter.setValue(0, 'y')
      commandFilters.push(...cropFilter.commandFilters(cropArgs))
    } 
    return commandFilters
  }

  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const files = super.visibleCommandFiles(args)
    const { string, asset: definition } = this
    const textGraphFile: CommandFile = {
      definition, type: GraphFileTypeTxt, 
      file: this.id, inputId: this.id,
      content: string, 
    }
    files.push(textGraphFile)
    return files
  }

  
}
