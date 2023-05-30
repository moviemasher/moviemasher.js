import { VideoServerAsset } from './ServerAsset.js';
import { ServerPromiseArgs } from '../Base/Code.js';
import { AudibleInstanceMixin } from '../Shared/Audible/AudibleInstanceMixin.js';
import { AudibleServerInstanceMixin } from "./AudibleServerInstanceMixin.js";
import { VisibleInstanceMixin } from '../Shared/Visible/VisibleInstanceMixin.js';
import { VisibleServerInstanceMixin } from "./VisibleServerInstanceMixin.js";
import { ServerInstanceClass } from "./ServerInstanceClass.js";
import { VideoInstanceMixin } from '../Shared/Video/VideoInstanceMixin.js';
import { VideoInstance } from '../Shared/Video/VideoInstance.js';

const WithAudibleInstance = AudibleInstanceMixin(ServerInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithServerAudibleInstance = AudibleServerInstanceMixin(WithVisibleInstance)
const WithServerVisibleInstanceD = VisibleServerInstanceMixin(WithServerAudibleInstance)
const WithVideo = VideoInstanceMixin(WithServerVisibleInstanceD)

export class VideoServerInstanceClass extends WithVideo implements VideoInstance {
  serverPromise(args: ServerPromiseArgs): Promise<void> {
    console.log(this.constructor.name, 'serverPromise', args)
    const { asset: definition } = this
    const { audio } = definition
    const { visible } = args
    if (visible || audio) return definition.serverPromise(args)

    return Promise.resolve()
  }

  declare asset: VideoServerAsset
}
