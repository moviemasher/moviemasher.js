import { Size } from '@moviemasher/moviemasher.js'

export const elementSetPreviewSize = (current?: HTMLDivElement | null, size?: Size) => {
  if (!(size && current))
    return

  const { width, height } = size
  current.style.setProperty('--preview-width', `${width}px`)
  current.style.setProperty('--preview-height', `${height}px`)
}
