import { PropsAndChildren } from "../../Types/Props";
import { JsxAndChildren } from "../../Types/Element";


export interface ShowProps extends PropsAndChildren {
  when: unknown;
  else?: JsxAndChildren;
}
