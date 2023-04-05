import { DataDefaultResponse, Size } from "@moviemasher/lib-core";
import { ClientOptions } from "@moviemasher/client-core";
import { WithClassName } from "../../Types/Core";
import { PropsWithChildren } from "../../Types/Props";
import { ActivityPropsDefault } from '../Activity/ActivityDefaultProps';
import { BrowserPropsDefault } from '../Browser/BrowserDefaultProps';
import { InspectorPropsDefault } from '../Inspector/InspectorDefaultProps';
import { PanelOptions } from '../Panel/Panel';
import { PlayerPropsDefault } from '../Player/PlayerDefaultProps';
import { TimelinePropsDefault } from '../Timeline/TimelineDefaultProps';
import { MashingType } from '@moviemasher/lib-core';
import { ElementRecord } from "../../Types/Element";



export interface MasherAppProps extends MasherAppBaseOptions, PropsWithChildren { }

export interface MasherAppBaseOptions extends WithClassName {
  previewSize?: Size;
  icons?: ElementRecord;
  mashingType?: MashingType;
  mashMedia?: DataDefaultResponse;
  clientOptions?: ClientOptions;
}


export type PanelOptionsOrFalse = PanelOptions | false;

export interface UiOptions {
  [index: string]: PanelOptionsOrFalse;
  browser: BrowserPropsDefault | false;
  player: PlayerPropsDefault | false;
  inspector: InspectorPropsDefault | false;
  timeline: TimelinePropsDefault | false;
  activity: ActivityPropsDefault | false;
}
