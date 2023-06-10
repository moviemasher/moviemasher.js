import { Size, Time, TypeVideo } from "@moviemasher/runtime-shared";
import { ServerMashAssetClass } from "./ServerMashClasses.js";
import { ServerVideoAsset } from '../Asset/ServerAsset.js';


export class ServerMashVideoAssetClass extends ServerMashAssetClass implements ServerVideoAsset {
  // audio: boolean;
  // audioUrl: string;
  frames(quantize: number): number {
    throw new Error("Method not implemented.");
  }
  previewSize?: Size | undefined;
  sourceSize?: Size | undefined;
  alpha?: boolean | undefined;

  audio = false;
  audioUrl = '';
  // // duration = 0;
  // frames(quantize: number): number {
  //   throw new Error('Method not implemented.');
  // }
  // loop = false;
  // previewSize?: Size | undefined;
  // sourceSize?: Size | undefined;
  // alpha?: boolean | undefined;

  // type = TypeVideo;

}
