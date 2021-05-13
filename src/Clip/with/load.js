export const load = {
  load: { value: function(mashTimeRange) {
    const urls = this.urlsVisibleInTimeRangeByType(mashTimeRange)
    return urls.load()
  }}
}