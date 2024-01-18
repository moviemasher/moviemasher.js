import React, { ComponentProps } from 'react'
import { createRoot } from 'react-dom/client'
import { MovieMasher } from './Components/MovieMasher.js'

export const renderRoot = (id: string, props: ComponentProps<typeof MovieMasher>) => {
  const element = globalThis.document.getElementById(id)!
  const root = createRoot(element);
  root.render(<MovieMasher { ...props }/>);
}

