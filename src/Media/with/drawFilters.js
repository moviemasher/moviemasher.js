export const drawFilters = {
  drawFilters: { value: function(evaluator, context) {
    // console.log(this.constructor.name, this.id, "draw", evaluator)
    this.coreFilter.scopeSet(evaluator)
    return this.coreFilter.draw(evaluator, this.evaluateScope(evaluator), context)
  }}
}