import type { CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, VisibleCommandFilterArgs } from '../Base/Code.js';
import type { ContentRectArgs } from "../Helpers/Content/ContentRectArgs.js";
import type { Filter } from '../Plugin/Filter/Filter.js';
import type { Tweening } from '../Helpers/TweenFunctions.js';
import { arrayLast } from '../Utility/ArrayFunctions.js';
import { assertPopulatedArray, assertPopulatedString, assertTimeRange, isTimeRange } from '../Shared/SharedGuards.js';
import { colorBlackOpaque, colorTransparent } from '../Helpers/Color/ColorConstants.js';
import { commandFilesInput } from '../Utility/CommandFilesFunctions.js';
import { filterFromId } from '../Plugin/Filter/FilterFactory.js';
import { PropertyTweenSuffix } from "../Base/PropertiedConstants.js";
import { rectsEqual } from "../Utility/RectFunctions.js";
import { tweenMaxSize } from '../Helpers/TweenFunctions.js';
import { ServerInstance, ServerVisibleInstance } from './ServerInstance.js';
import { Constrained } from '../Base/Constrained.js';
import { VisibleInstance } from '../Shared/Instance/Instance.js';
import { VisibleServerAsset } from './ServerAsset.js';


export function VisibleServerInstanceMixin<T extends Constrained<ServerInstance & VisibleInstance>>(Base: T):
  T & Constrained<ServerVisibleInstance> {

  return class extends Base implements ServerVisibleInstance {
    declare asset: VisibleServerAsset;

    initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
      const commandFilters: CommandFilters = [];
      const { filterInput, track } = args;

      if (container) {
        // relabel input as content
        assertPopulatedString(filterInput);
        commandFilters.push(this.copyCommandFilter(filterInput, track));
      }
      return commandFilters;
    }

    containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
      // console.log(this.constructor.name, 'containerCommandFilters')
      const commandFilters: CommandFilters = [];
      const {
        commandFiles, containerRects, filterInput: input, videoRate, track
      } = args;
      let filterInput = input;

      const maxSize = tweening.size ? tweenMaxSize(...containerRects) : containerRects[0];

      // add color box first
      const colorArgs: VisibleCommandFilterArgs = {
        ...args,
        contentColors: [colorBlackOpaque, colorBlackOpaque],
        outputSize: maxSize, //{ width: maxSize.width * 2, height: maxSize.height * 2 }
      };
      commandFilters.push(...this.colorBackCommandFilters(colorArgs, `container-${track}-back`));
      const colorInput = arrayLast(arrayLast(commandFilters).outputs);

      const { id } = this;
      // console.log(this.constructor.name, 'containerCommandFilters calling commandFilesInput', id)
      const fileInput = commandFilesInput(commandFiles, id, true);

      // then add file input, scaled
      commandFilters.push(...this.scaleCommandFilters({ ...args, filterInput: fileInput }));
      filterInput = arrayLast(arrayLast(commandFilters).outputs);

      if (tweening.size) {
        // overlay scaled file input onto color box
        assertPopulatedString(filterInput, 'overlay input');
        commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput));
        filterInput = arrayLast(arrayLast(commandFilters).outputs);
      }
      // crop file input
      const cropArgs: FilterCommandFilterArgs = { duration: 0, videoRate };
      assertPopulatedString(filterInput, 'crop input');
      const { cropFilter } = this;
      cropFilter.setValue(maxSize.width, 'width');
      cropFilter.setValue(maxSize.height, 'height');
      cropFilter.setValue(0, 'x');
      cropFilter.setValue(0, 'y');
      commandFilters.push(...cropFilter.commandFilters({ ...cropArgs, filterInput }));
      filterInput = arrayLast(arrayLast(commandFilters).outputs);
      if (!tweening.size) {
        // overlay scaled and cropped file input onto color box
        assertPopulatedString(filterInput, 'overlay input');
        commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput));
        filterInput = arrayLast(arrayLast(commandFilters).outputs);

      }

      assertPopulatedString(filterInput, 'alphamerge input');
      commandFilters.push(...this.alphamergeCommandFilters({ ...args, filterInput }));
      filterInput = arrayLast(arrayLast(commandFilters).outputs);

      // then we need to do effects, opacity, etc, and merge
      commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput }));
      return commandFilters;
    }



    contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
      const commandFilters: CommandFilters = [];
      const {
        containerRects, visible, time, videoRate, clipTime, commandFiles, 
        filterInput: input, track
      } = args;
      if (!visible)
        return commandFilters;

      assertTimeRange(clipTime);
      assertPopulatedArray(containerRects, 'containerRects');

      const { id } = this;
      let filterInput = input || commandFilesInput(commandFiles, id, visible);

      const contentArgs: ContentRectArgs = {
        containerRects: containerRects, time, timeRange: clipTime
      }
      const contentRects = this.contentRects(contentArgs);

      const tweeningContainer = !rectsEqual(...containerRects);

      const [contentRect, contentRectEnd] = contentRects;
      const duration = isTimeRange(time) ? time.lengthSeconds : 0;
      const maxContainerSize = tweeningContainer ? tweenMaxSize(...containerRects) : containerRects[0];

      const colorInput = `content-${track}-back`;

      const colorArgs: VisibleCommandFilterArgs = {
        ...args, contentColors: [colorTransparent, colorTransparent],
        outputSize: maxContainerSize
      };
      commandFilters.push(...this.colorBackCommandFilters(colorArgs, colorInput));



      const scaleArgs: CommandFilterArgs = {
        ...args, filterInput, containerRects: contentRects
      };
      commandFilters.push(...this.scaleCommandFilters(scaleArgs));


      filterInput = arrayLast(arrayLast(commandFilters).outputs);

      if (tweening.size) {
        commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput));
        filterInput = arrayLast(arrayLast(commandFilters).outputs);
      }

      const cropArgs: FilterCommandFilterArgs = {
        duration, videoRate
      };
      const { cropFilter } = this;
      cropFilter.setValue(maxContainerSize.width, 'width');
      cropFilter.setValue(maxContainerSize.height, 'height');
      cropFilter.setValue(contentRect.x, 'x');
      cropFilter.setValue(contentRect.y, 'y');
      cropFilter.setValue(contentRectEnd.x, `x${PropertyTweenSuffix}`);
      cropFilter.setValue(contentRectEnd.y, `y${PropertyTweenSuffix}`);
      commandFilters.push(...cropFilter.commandFilters({ ...cropArgs, filterInput }));
      filterInput = arrayLast(arrayLast(commandFilters).outputs);

      const { setsarFilter } = this;
      setsarFilter.setValue('1/1', 'sar');

      commandFilters.push(...setsarFilter.commandFilters({ ...cropArgs, filterInput }));
      filterInput = arrayLast(arrayLast(commandFilters).outputs);


      if (!tweening.size) {
        commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput, this.asset.alpha));
        filterInput = arrayLast(arrayLast(commandFilters).outputs);
      }

      commandFilters.push(...super.contentCommandFilters({ ...args, filterInput }, tweening));
      return commandFilters;
    }


    private _setsarFilter?: Filter;
    get setsarFilter() { return this._setsarFilter ||= filterFromId('setsar'); }

  };
}
