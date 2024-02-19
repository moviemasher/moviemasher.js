import type { DataOrError, Rect, TextRectArgs } from '../types.js'

import { $SERVER, ERROR, MOVIEMASHER, RECT_ZERO, namedError } from '../runtime.js'
import { isAboveZero, isPopulatedString } from '../utility/guard.js'

export const textRect = (args: TextRectArgs): DataOrError<Rect> => {
  const {text: string, family, size: height} = args
  const rect = { ...RECT_ZERO, height }
  if (!(isPopulatedString(string) && isAboveZero(height))) return { data: rect }

  const { window, context } = MOVIEMASHER
  const canvas = window.document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return namedError(ERROR.Internal, 'context2d')

  ctx.font = `${height}px ${family}`
  const metrics: TextMetrics = ctx.measureText(string)
  const {
    actualBoundingBoxAscent: ascent, actualBoundingBoxDescent: descent, 
    actualBoundingBoxLeft, actualBoundingBoxRight: right,
  } = metrics

  // Assumed bug in canvas on server returns negative actualBoundingBoxLeft!
  // Not sure why they are subtracting x_offset everywhere except this line...
  // https://vscode.dev/github/Automattic/node-canvas/blob/master/src/CanvasRenderingContext2d.cc#L2774
  const left = actualBoundingBoxLeft * (context === $SERVER ? -1 : 1)
  const data = {
    x: left, y: ascent, width: right + left, height: ascent + descent
  }
  // console.log('textRect', ctx.font, data, metrics)
  return { data }
}
