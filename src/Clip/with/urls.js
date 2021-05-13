

export const urls = {
  urlsVisibleInTimeRangeByType: { 
    value: function(mashTimeRange) { 
      const range = this.mediaTimeRange(mashTimeRange)
      const urls = this.media.urlsVisibleInTimeRangeForClipByType(range, this) 
      if (this.merger) {
        urls.concat(this.merger.urlsVisibleInTimeRangeByType(range))
      }
      if (this.scaler) {
        urls.concat(this.scaler.urlsVisibleInTimeRangeByType(range))
      }
      if (this.effects) this.effects.forEach(effect => 
        urls.concat(effect.urlsVisibleInTimeRangeByType(range))
      )
      return urls
    }
  },
}


