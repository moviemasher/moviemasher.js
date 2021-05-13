
export const drawMediaFilters = { 
  drawMediaFilters: { value: function(clipTimeRange, context, dimensions) { 
    // clipTimeRange's frame is offset of draw time within clip = frames is duration
    this.media.filters.forEach(filter => {
      context = filter.drawFilters(this.evaluator(clipTimeRange, context, dimensions))
    })
    return context
  }},
  
}



