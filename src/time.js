var Time = function(start, rate, duration){
	if (start) this.frame = Number(start) || 0;
	if (rate) this.fps = Number(rate) || 0;
	if (duration) this.length = Math.max(1, Number(duration));
};
Time.fromTimes = function(start, end) {
	start.synchronize(end);
	return new Time(start.frame, start.fps, Math.max(1, end.frame - start.frame));
};
Time.fromSeconds = function(seconds, rate, rounding) {
	if (! rounding) rounding = 'round';
	if (! rate) rate = 1;
	return new Time(Math[rounding](Number(seconds) * Number(rate)), rate);
};
Time.fromSomething = function(something){
	var frame, length, fps;
	if (! something) something = new Time();
	else if (typeof something === 'number') something = new Time.fromSeconds(something);
	else if (typeof something === 'string') {
		something = something.split('-');
		frame = something.shift();
		length = fps = 1;
		if (something.length) { // there was a dash - length was specified
			something = something.shift().split('@');
			length = something.shift();
		} else {
			something = frame.split('@');
			frame = something.shift();
		}
		if (something.length) {
			fps = something.shift();
		}
		something = new Time(frame, fps, length);
	}
	return something;
};
(function(pt){
	pt.length = 0;
	pt.frame = 0;
	pt.fps = 0;	
	Object.defineProperty(pt, 'end', { 
		get: function() { return this.frame + this.length; },
		set: function(n) {this.length = Math.max(1, Number(n) - Number(this.frame));}
	});
	Object.defineProperty(pt, 'endTime', { get: function() { return new Time(this.end, this.fps); } } );
	Object.defineProperty(pt, 'lengthTime', { get: function() { return new Time(this.length, this.fps); } } );
	Object.defineProperty(pt, 'description', { get: function() { 
		var descr = this.frame;
		if (this.length) descr += '-' + this.end;
		descr += '@' + this.fps;
		return descr; 
	} } );
	Object.defineProperty(pt, 'seconds', { 
		get: function() { return Number(this.frame) / Number(this.fps); },
		set: function(time) { this.setToTime(time); },
	} );
	Object.defineProperty(pt, 'lengthSeconds', { get: function() { return Number(this.length) / Number(this.fps); } } );
	Object.defineProperty(pt, 'timeRange', { get: function() { 
		var range = this.copyTime();
		range.length = 1;
		return range;
	} } );	
	pt.add = function(time) {
		if (this.fps !== time.fps) {
			time = time.copyTime();
			this.synchronize(time);
		}
		this.frame += time.frame;
		return this;
	};
	pt.setToTime = function(something){
		something = Time.fromSomething(something);
		this.synchronize(something);
		this.frame = something.frame;
		return something;
	};
	pt.setToTimeRange = function(something){
		something = this.setToTime(something);
		this.length = something.length;
		return something;
	};
	pt.copyTime = function(length) {
		return new Time(this.frame, this.fps, length);			
	};
	pt.divide = function(number, rounding) {
		if (! rounding) rounding = 'round';
		this.frame = Math[rounding](Number(this.frame) / number);
	};
	pt.frameForRate = function(rate, rounding){
		if (! rounding) rounding = 'round';
		var start = this.frame;
		if (rate !== this.fps) {
			var time = Time.fromSeconds(this.seconds, this.fps, rounding);
			start = time.frame;
		}
		return start;	
	};
	pt.isEqualToTime = function(time) {
		var equal = false;
		if (time && time.fps && this.fps) {
			if (this.fps === time.fps) equal = (this.frame === time.frame);
			else {
				// make copies so neither time is changed
				var time1 = this.copyTime();
				var time2 = time.copyTime();
				time1.synchronize(time2);
				equal = (time1.frame === time2.frame);
			}
		}
		return equal;
	};
	pt.lessThan = function(time) {
		var less = false;
		if (time && time.fps && this.fps) {
			if (this.fps === time.fps) less = (this.frame < time.frame);
			else {
				// make copies so neither time is changed
				var time1 = this.copyTime();
				var time2 = time.copyTime();
				time1.synchronize(time2);
				less = (time1.frame < time2.frame);
			}
		}
		return less;
	};
	pt.max = function(time) {
		if (time) {
			this.synchronize(time);
			this.frame = Math.max(time.frame, this.frame);
		}
	};
	pt.min = function(time) {
		if (time) {
			this.synchronize(time);
			this.frame = Math.min(time.frame, this.frame);
		}
	};
	pt.multiply = function(number, rounding) {
		if (! rounding) rounding = 'round';
		this.frame = Math[rounding](Number(this.frame) * number);
	};
	pt.ratio = function(time) {
		var n = 0;
		if (time && time.fps && this.fps && time.frame) {
			if (this.fps === time.fps) n = (this.frame / time.frame);
			else {
				// make copies so neither time is changed
				var time1 = this.copyTime();
				var time2 = time.copyTime();
				time1.synchronize(time2);
				n = (Number(time1.frame) / Number(time2.frame));
			}
		}
		return n;
	};
	pt.scale = function(rate, rounding) {
		if (this.fps !== rate) {
			if (! rounding) rounding = 'round';
			this.frame = Math[rounding](Number(this.frame) / (Number(this.fps) / Number(rate)));
			if (this.length) this.length = Math.max(1, Math[rounding](Number(this.length) / (Number(this.fps) / Number(rate))));
			this.fps = rate;
		}
		return this;
	};
	pt.subtract = function(time) {
		if (this.fps !== time.fps) {
			time = time.copyTime();
			this.synchronize(time);
		}
		var subtracted = time.frame;
		if (subtracted > this.frame) {
			subtracted -= subtracted - this.frame;
		}
		this.frame -= subtracted;
		return subtracted;
	};
	pt.synchronize = function(time, rounding) {
		if (! rounding) rounding = 'round';
		if (time.fps !== this.fps) {
			var gcf = this.__lcm(time.fps, this.fps);
			this.scale(gcf, rounding);
			time.scale(gcf, rounding);
		}
	};
	pt.expand = function(time){
		this.min(time);
		this.maxLength(time.lengthTime);
	};
	pt.__gcd = function(a, b) {
		var t;
		while (b !== 0) {
			t = b;
			b = a % b;
			a = t;
		}
		return a;
	};
	pt.__lcm = function(a, b) { return (a * b / this.__gcd(a, b)); };
	pt.copyTimeRange = function() {
		return new Time(this.frame, this.fps, this.length);			
	};
	pt.touches = function(range){
		return this.intersection(range, true);
	};
	pt.intersection = function(range, or_equals) {
		var result = null;
		var range1 = this;
		var range2 = range;
		if (range1.fps !== range2.fps)
		{
			range1 = range1.copyTimeRange();
			range2 = range2.copyTimeRange();
			range1.synchronize(range2);
		}
		var last_start = Math.max(range1.frame, range2.frame);
		var first_end = Math.min(range1.end + (range1.length ? 0 : 1), range2.end + (range2.length ? 0 : 1));
		if ((last_start < first_end) || (or_equals && (last_start === first_end)))
		{
			result = new Time(last_start, range1.fps, first_end - last_start);
		}
		//if (or_equals) console.log('intersection', result, range1.description, range2.description);
		return result;
	};
	pt.isEqualToTimeRange = function(range){
		var equal = false;
		if (range && range.fps && this.fps) {
			if (this.fps === range.fps) equal = ((this.frame === range.frame) && (this.length === range.length));
			else {
				// make copies so neither range is changed
				var range1 = this.copyTimeRange();
				var range2 = range.copyTimeRange();
				range1.synchronize(range2);
				equal = ((range1.frame === range2.frame) && (range1.length === range2.length));
			}
		}
		return equal;
	};
	pt.maxLength = function(time) {
		this.synchronize(time);
		this.length = Math.max(time.frame, this.length);
	};
	pt.minLength = function(time) {
		this.synchronize(time);
		this.length = Math.min(time.frame, this.length);
	};
})(Time.prototype);
