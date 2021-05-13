function CoreFilter() {}

Object.defineProperties(CoreFilter.prototype, {
  scopeSet: { value: function() {}},
  draw: { value: function(evaluator) { return evaluator.context } },
})

export { CoreFilter }
