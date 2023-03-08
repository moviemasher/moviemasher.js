import { useStore, useContext, For } from '@builder.io/mitosis'
import ClientContext from '../../Contexts/ClientContext.context.lite'


type Props = {
  message: string
  children: Element
}

export default function MasherApp(props: Props) {
  const children = props.children
  // const { children } = props
  console.log('children', children)
  const clientContext = useContext(ClientContext)
  
  const state = useStore({
    name: 'Foo',
  })
  
  return (
    <div class='my-class-name'>
      {props.message || 'Hello'} {state.name}! !
      {props.children}
    </div>
  )
}

