
class Context {
  createDrawing(width, height) {
    const context = this.createVideo()
    if (1 <= width) context.canvas.width = width
    if (1 <= height) context.canvas.height = height
    return context
  }

  createDrawingLike(drawing) {
    return this.createDrawing(drawing.canvas.width, drawing.canvas.height)
  }

  createAudio() {
    const Klass = window.AudioContext
    if (!Klass) return

    return new Klass
  }

  createCanvas() {
    return document && document.createElement("canvas")
  }

  createVideo(canvas) {
    const element = canvas || this.createCanvas()
    return element && element.getContext("2d")
  }
}

const ContextFactoryInstance = new Context

export { ContextFactoryInstance as Context }
