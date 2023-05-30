import { ImageInstance } from "../Shared/Image/ImageInstance.js";
import { ServerInstanceClass } from "./ServerInstanceClass.js";
import { isTimeRange } from '../Shared/SharedGuards.js';
import { CommandFile, CommandFiles, VisibleCommandFileArgs } from '../Base/Code.js';
import { ImageServerAsset } from './ServerAsset.js';
import { ValueRecord } from '@moviemasher/runtime-shared';
import { VisibleInstanceMixin } from '../Shared/Visible/VisibleInstanceMixin.js';
import { VisibleServerInstanceMixin } from "./VisibleServerInstanceMixin.js";
import { ImageInstanceMixin } from '../Shared/Image/ImageInstanceMixin.js';

const WithBase = VisibleInstanceMixin(ServerInstanceClass)
const WithVisible = VisibleServerInstanceMixin(WithBase)
const WithImage = ImageInstanceMixin(WithVisible)

export class ImageServerInstanceClass extends WithImage implements ImageInstance {
  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = [];
    const { visible, time, videoRate } = args;
    if (!visible)
      return commandFiles;

    const files = this.graphFiles(args);
    const [file] = files;
    const duration = isTimeRange(time) ? time.lengthSeconds : 0;
    const options: ValueRecord = { loop: 1, framerate: videoRate };
    if (duration)
      options.t = duration;
    const { id } = this;
    const commandFile: CommandFile = { ...file, inputId: id, options };
    // console.log(this.constructor.name, 'commandFiles', id)
    commandFiles.push(commandFile);


    commandFiles.push(...this.effectsCommandFiles(args));
    return commandFiles;
  }

  declare asset: ImageServerAsset;
}
