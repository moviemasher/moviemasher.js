import { IconElement, FormElement } from "@moviemasher/client-component"

type CustomElement<T> = Partial<T & JSX.IntrinsicClassAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['moviemasher-icon']: CustomElement<IconElement>
      ['moviemasher-form']: CustomElement<FormElement>
    }
  }
}

