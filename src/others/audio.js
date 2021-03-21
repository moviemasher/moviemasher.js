
import Constant from "./constant"
import Cache from "./cache"
import { array_find } from "./util"
import TimeRange from "../time_range/time_range"
import Window from "./window"

const Audio = {
  buffer_source: function(buffer){
    // console.log('Audio.buffer_source', buffer);
    var context = Window.audio_context();
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    return source;
  },
  // load: function(url){
  //   Loader.load_audio(url);
  // },
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
    now = Window.audio_context().currentTime;
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
    var context = Window.audio_context()
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
  create_buffer_source: function() {
    if (Audio.__buffer_source) return;

    var context = Window.audio_context()
    Audio.__buffer_source = context.createBufferSource();
    Audio.__buffer_source.loop = true;
    Audio.__buffer_source.buffer = context.createBuffer(2, 44100, 44100);
    Audio.__buffer_source.connect(context.destination);
  },
  destroy_buffer_source: function() {
    if (Audio.__buffer_source) {
      Audio.__buffer_source.disconnect(Window.audio_context().destination);
      Audio.__buffer_source = null;
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
    var context = Window.audio_context()
    source.buffer_source.disconnect(source.gainNode);
    source.gainNode.disconnect(context.destination);
    delete source.gainNode;
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
        url = (media.audio || media.url || media.source);
        break;
      }
    }
    return url;
  },
  start: function(now_seconds){//_drawn
    Audio.__last_seconds = now_seconds;
    Audio.__sync_seconds = Window.audio_context().currentTime;
    Audio.__playing_start();

  },
  stop: function(){
    // console.log('Audio.stop');
    Audio.__playing_stop();
    Audio.destroy_sources();
    Audio.__last_seconds = 0;
    Audio.__sync_seconds = 0;
  },
  source_for_clip: function(clip){
    return array_find(Audio.sources, {clip: clip}, 'clip');
  },
  source_from_clip: function(clip, media, player) {
    var quantize, times, source, url = Audio.media_url(media);
    if (url && Cache.cached(url)) {
      quantize = player.mash.quantize;
      times = Audio.clip_timing(clip, Audio.zero_seconds(), quantize);
      if ((times.duration > 0) && (! isNaN(times.start))) {
        source = {};
        source.clip = clip;
        source.media = media;
        source.url = url;
        source.player = player;
        source.quantize = quantize;
        source.buffer_source = Audio.buffer_source(Cache.get(url))
        if ((Constant.audio === media.type) && media.loops) Audio.__buffer_source.loop = true;
        Audio.connect_source(source, times.start, times.offset, times.duration);
        Audio.gain_source(source);
        Audio.sources.push(source);
      }
    }
    return source;
  },
  time: function(){
    return Audio.__last_seconds + (Window.audio_context().currentTime - Audio.__sync_seconds);
  },
  zero_seconds: function() {
    return Audio.__sync_seconds - Audio.__last_seconds;
  },
  __playing_start: function() {
    if (Audio.__playing) return;

    Audio.__playing = true;
    // console.log('Audio.start');
    if (Audio.__buffer_source) Audio.__buffer_source.start(0);

  },
  __playing_stop: function() {
    if (!Audio.__playing) return;

    Audio.__playing = false;
    if (Audio.__buffer_source) Audio.__buffer_source.stop();
  },
  sources: [],
  ctx: null,
  __last_seconds: 0,
  __sync_seconds: 0,
  __playing: false,
};
export default Audio