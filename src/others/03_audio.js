var Audio = {
  buffer_source: function(buffer){
    // console.log('Audio.buffer_source', buffer);
    var context = Audio.get_ctx();
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    return source;
  },
  load: function(url){
    Loader.load_audio(url);
  },
  clip_timing: function(clip, zero_seconds, quantize) {
    if (isNaN(zero_seconds)) console.error('Audio.clip_timing got NaN for zero_seconds', clip);
    var now, dif, range, result = {offset: 0};
    range = new TimeRange(clip.frame, quantize, clip.frames);
    result.start = zero_seconds + range.seconds;
    if (isNaN(result.start)) console.error('Audio.clip_timing start is NaN', range);
    result.duration = range.lengthSeconds;
    if (clip.trim) {
      range.frame = clip.trim;
      result.offset = range.seconds;
    }
    now = Audio.get_ctx().currentTime;
    if (now > result.start) {
      dif = now - result.start;
      result.start = now;
      if (isNaN(result.start)) console.error('Audio.clip_timing currentTime is NaN');
      result.offset += dif;
      result.duration -= dif;
    }
    return result;
  },
  connect_source: function(source, start, offset, duration){
    var context = Audio.get_ctx();
    source.gainNode = context.createGain();
    source.buffer_source.connect(source.gainNode);
    source.gainNode.connect(context.destination);
    //console.log('Audio.connect_source', start, offset, duration);
    source.buffer_source.start(start, offset, duration);
  },
  config_gain: function(gainNode, gain, start, duration, volume){
    gainNode.cancelScheduledValues(0);
    var gain_val, time_per, i, z, gains;
    gains = gain.split(',');
    z = gains.length / 2;
    for (i = 0; i < z; i++) {
      time_per = gains[i * 2];
      gain_val = volume * gains[i * 2 + 1];
      gainNode[Constant.gain].linearRampToValueAtTime(gain_val, start + time_per * duration);
    }
  },
  destroy_sources: function(except_clips){
    var new_sources = [];
    var source, i, z = Audio.sources.length;
    for (i = 0; i < z; i++){
      source = Audio.sources[i];
      if (except_clips && (-1 < except_clips.indexOf(source.clip))) {
        new_sources.push(source);
        continue;
      }
      // console.log('Audio.destroy_sources', source);
      Audio.disconnect_source(source);
      delete source.buffer_source;
    }
    Audio.sources = new_sources;
  },
  disconnect_source: function(source){
    // console.log('Audio.disconnect_source', source);
    var context = Audio.get_ctx();
    source.buffer_source.disconnect(source.gainNode);
    source.gainNode.disconnect(context.destination);
    delete source.gainNode;
  },
  get_ctx: function(){
    if (! Audio.ctx) {
      if (window.AudioContext) Audio.ctx = new window.AudioContext();
      else if (window.webkitAudioContext) Audio.ctx = new window.webkitAudioContext();
    }
    return Audio.ctx;
  },
  gain_source: function(source){
    if (source){
      if (source.player.muted || !source.player.volume) {
        source.gainNode[Constant.gain].value = 0;
      } else if (isNaN(Number(source.clip[Constant.gain]))) {
        // support for a matrix of volumes...
        var times = Audio.clip_timing(source.clip, Audio.zero_seconds(), source.quantize);
        Audio.config_gain(source.gainNode, source.clip[Constant.gain], times.start, times.duration, source.player.volume);
      } else {
        source.gainNode[Constant.gain].value = source.clip[Constant.gain] * source.player.volume;
      }
    }
  },
  media_url: function(media){
    var url;
    switch(media.type){
      case Constant.video: {
        switch (media.audio){
          case undefined: {
            url = media.source;
            break;
          }
          case '0': {
            break;
          }
          default: url = media.audio;
        }
        break;
      }
      case Constant.audio: {
        url = (media.url || media.source);
        break;
      }
    }
    return url;
  },
  start: function(){
    // console.log('Audio.start');
    var context = Audio.get_ctx();
    Audio.__buffer_source = context.createBufferSource();
    Audio.__buffer_source.loop = true;
    Audio.__buffer_source.buffer = context.createBuffer(2, 44100, 44100);
    Audio.__buffer_source.connect(context.destination);
    Audio.__buffer_source.start(0);
  },
  stop: function(){
    // console.log('Audio.stop');
    Audio.destroy_sources();
    if (Audio.__buffer_source) {
      Audio.__buffer_source.disconnect(Audio.get_ctx().destination);
      Audio.__buffer_source = null;
    }
  },
  source_for_clip: function(clip){
    return Util.array_find(Audio.sources, {clip: clip}, 'clip');
  },
  source_from_clip: function(clip, media, player) {
    var quantize, times, source, url = Audio.media_url(media);
    if (url && Loader.cached_urls[url]) {
      quantize = player.mash.quantize;
      times = Audio.clip_timing(clip, Audio.zero_seconds(), quantize);
      if ((times.duration > 0) && (! isNaN(times.start))) {
        source = {};
        source.clip = clip;
        source.media = media;
        source.url = url;
        source.player = player;
        source.quantize = quantize;
        source.buffer_source = Audio.buffer_source(Loader.cached_urls[url]);
        if ((Constant.audio === media.type) && media.loops) Audio.__buffer_source.loop = true;
        Audio.connect_source(source, times.start, times.offset, times.duration);
        Audio.gain_source(source);
        Audio.sources.push(source);
      }
    }
    return source;
  },
  sync: function(now_seconds){//_drawn
    Audio.__last_seconds = now_seconds;
    Audio.__sync_seconds = Audio.get_ctx().currentTime;
    //console.log(Audio.time());
  },
  time: function(){
    return Audio.__last_seconds + (Audio.get_ctx().currentTime - Audio.__sync_seconds);
  },
  zero_seconds: function() {
    return Audio.__sync_seconds - Audio.__last_seconds;
  },
  sources: [],
  ctx: null,
  __last_seconds: 0,
  __sync_seconds: 0,
};
MovieMasher.Audio = Audio;
