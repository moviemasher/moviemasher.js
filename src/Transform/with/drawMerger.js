export const drawMerger = {
  drawMerger: { value: function(clipTimeRange, inputContext, outputContext) {
    this.media.filters.forEach(filter => {
      filter.drawFilters(this.evaluator(clipTimeRange, inputContext, outputContext.canvas), outputContext)
    })
    return outputContext
  }}
}