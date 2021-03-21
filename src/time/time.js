const greatestCommonDenominator = (a, b) => {
    var t
    while (b !== 0) {
      t = b
      b = a % b
      a = t
    }
    return a
  }
  
  const lowestCommonMultiplier = (a, b) => { return (a * b / greatestCommonDenominator(a, b)) }
  
  class Time {
    static fromSeconds(seconds, fps, rounding) {
      if (!rounding) rounding = 'round'
      if (!fps) fps = 1
      return new Time(Math[rounding](Number(seconds) * Number(fps)), fps)
    }
  
    static fromSomething(something) {
      if (! something) return new Time()
      if (something instanceof Time) return something.copy()
      return fromSeconds(something)
    }

    static scaleTimes(time1, time2, rounding) {
      if (! rounding) rounding = 'round'
      if (time1.fps !== time2.fps) {
        var gcf = lowestCommonMultiplier(time1.fps, time2.fps)
        time2.scale(gcf, rounding)
        time1.scale(gcf, rounding)
      }
    }
    
    constructor(frame, fps) {
      this.frame = 0
      this.fps = 0
      if (frame) this.frame = Number(frame) || 0
      if (fps) this.fps = Number(fps) || 0
    }
  
    add(time) {
      if (this.fps !== time.fps) {
        time = time.copy()
        Time.scaleTimes(this, time)
      }
      this.frame += time.frame
      return this
    }

    copy() { return new Time(this.frame, this.fps) }

    divide(number, rounding) {
      if (! rounding) rounding = 'round'
      this.frame = Math[rounding](Number(this.frame) / number)
    }
    
    equalsTime(time) {
      var equal = false
      if (time && time.fps && this.fps) {
        if (this.fps === time.fps) equal = (this.frame === time.frame)
        else {
          // make copies so neither time is changed
          const time1 = this.copy()
          const time2 = time.copy()
          Time.scaleTimes(time1, time2)
          equal = (time1.frame === time2.frame)
        }
      }
      return equal
    }

    min(time) {
      if (time) {
        Time.scaleTimes(this, time)
        this.frame = Math.min(time.frame, this.frame)
      }
    } 
  
    scale(fps = 1, rounding = "round") {
      if (this.fps !== fps) {
        this.frame = Math[rounding](Number(this.frame) / (Number(this.fps) / Number(fps)))
        this.fps = fps
      }
      return this
    }

    get seconds() { return Number(this.frame) / Number(this.fps) }
    
    setToTime(something) {
      something = Time.fromSomething(something)
      Time.scaleTimes(this, something)
      this.frame = something.frame
      return something
    }

    subtract(time) {
      if (this.fps !== time.fps) {
        time = time.copy()
        Time.scaleTimes(this, time)
      }
      var subtracted = time.frame
      if (subtracted > this.frame) {
        subtracted -= subtracted - this.frame
      }
      this.frame -= subtracted
      return subtracted
    }
  }
  
  export default Time