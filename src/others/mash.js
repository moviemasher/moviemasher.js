
import { v4 as uuid } from 'uuid'

import Audio from "./audio"
import Constant from "./constant"
import Defaults from "./defaults"
import Filter from "./filter"
import Option from "./option"
import TimeRange from "../time_range/time_range"
import Time from "../time/time"
import { array_find, isob, isnt, isarray, sort_by_frame } from "./util"
import Registry from "./registry"

const __pad = (n, width, z) => {
  z = z || '0';
  n = String(n);
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const clip_from_media = (object) => {
  var key, type, property_type, property, clip = {id:object.id};
  if (object.properties){
    for (key in object.properties) {
      property = object.properties[key];
      if (isnt(property.value)) {
        type = property.type;
        if (type){
          property_type = Constant.property_types[type];
          if (property_type){
            if (! isnt(property_type.value)) clip[key] = property_type.value;
            else if (property_type.type) clip[key] = new property_type.type();
          }
        }
      }
      else clip[key] = property.value;
    }
  }
  return clip;
}
const clip_has_audio = (clip, object) => {
  var has = false;
  switch(object.type){
    case Constant.video: {
      has = !! Audio.media_url(object);
      break;
    }
    case Constant.audio: {
      has = (object.url || object.source);
      break;
    }
  }
  if (has){
    switch(clip[Constant.gain]){
      case Constant.mute:
      case Constant.mute_shorthand: has = false;
    }
  }
  return has;
}
const clip_time = (clip, object, time, quantize, add_one_frame) => {
  var clip_time = time.copy();
  clip_time.subtract(new Time(clip.frame, quantize));
  var limit_time = new Time(clip.frames, quantize);
  clip_time.min(limit_time);
  if (add_one_frame) {
    clip_time.frame += (clip.speed ? Math.ceil(clip.speed) : 1);
  }
  switch (object.type) {
    case Constant.video:
      if (clip.trim) {
        clip_time.add(new Time(clip.trim, quantize));
      }
      if (clip.speed) {
        clip_time.divide(clip.speed, 'ceil');
      }
      break;
    case Constant.audio:
      if (clip.trim) clip_time.add(new Time(clip.trim, quantize));
      break;
  }
  return clip_time;
}
const init_clip = (mash, clip, object, track_index) => {
  if (! track_index) track_index = 0;
  if (clip && object && mash && (! init_media(object))) {
    if (is_modular_media(object)) __init_module(object.type, clip, object);
    if (Constant.effect !== object.type){
      if (isnt(clip.track)) clip.track = track_index;
      if (isnt(clip.frame)) clip.frame = 0;
      switch(object.type){
        case Constant.video:
        case Constant.audio: {
          if (isnt(clip[Constant.gain])) clip[Constant.gain] = 1.0;
          if (isnt(clip.frames)) clip.frames = (new Time(object.duration, 1)).scale(mash.quantize, 'floor').frame;
          if (isnt(clip.trim)) clip.trim = 0;
          break;
        }
        default: {
          if (isnt(clip.frames)) clip.frames = (new Time(Option.mash[object.type + '_seconds'], 1)).scale(mash.quantize).frame;
        }
      }
      switch(object.type){
        case Constant.transition:
        case Constant.audio: break;
        default: {
          if (isnt(clip.scaler)) clip.scaler = object.scaler || Defaults.module_from_type(Constant.scaler);
          if (isnt(clip.merger)) clip.merger = object.merger || Defaults.module_from_type(Constant.merger);
          if (isnt(clip.effects)) clip.effects = object.effects || [];
          object = clip.scaler;
          __init_module(Constant.scaler, object, media_search(Constant.scaler, object.id, mash));
          object = clip.merger;
          __init_module(Constant.merger, object, media_search(Constant.merger, object.id, mash));
          var i, z = clip.effects.length;
          for (i = 0; i < z; i++){
            object = clip.effects[i];
            __init_module(Constant.effect, object, media_search(Constant.effect, object.id, mash));
          }
        }
      }
    }
  }
}
const init_media = (object) => {

  var error = ! isob(object);
  if (! error) {
    if (isnt(object.id)) object.id = uuid();
    switch(object.type) {
      case Constant.video: {
        if (isnt(object.fps)) object.fps = 10;
        if (isnt(object.duration)) object.duration = 0;
        if (isnt(object.begin)) object.begin = 1;
        if (isnt(object.pattern)) object.pattern = '%.jpg';
        if (isnt(object.increment)) object.increment = 1;
        if (isnt(object.zeropadding)) object.zeropadding = String(object.begin + (object.increment * Math.floor(object.fps * object.duration))).length;
        break;
      }
      case Constant.transition: {
        if (isnt(object.to)) object.to = {};
        if (isnt(object.from)) object.from = {};
        if (isnt(object.to.scaler)) object.to.scaler = Defaults.module_from_type(Constant.scaler);
        if (isnt(object.to.merger)) object.to.merger = Defaults.module_from_type(Constant.merger);
        if (isnt(object.from.scaler)) object.from.scaler = Defaults.module_from_type(Constant.scaler);
        if (isnt(object.from.merger)) object.from.merger = Defaults.module_from_type(Constant.merger);
    //console.log('init_media', object, object.id);
        break;
      }
    }
  }
  if (error) console.error('init_media got invalid media', object);
  return error;
}
const init_track = (track, index) => {
  if (! isob(track)) track = {type:track};
  track.index = index;
  if (! isarray(track.clips)) track.clips = [];
  return track;
}
const is_modular_media = (object) => {
  var is = false;
  if (isob(object) && (! isnt(object.type))) {
    switch(object.type){
      case Constant.image:
      case Constant.audio:
      case Constant.video:
      case 'frame': break;
      default: is = true;
    }
  }
  return is;
}
const is_visual_media = (object) => {
  var is = false;
  if (isob(object)) {
    switch(object.type){
      case Constant.image:
      case Constant.video:
      case Constant.transition:
      case Constant.theme: is = true;
    }
  }
  return is;
}
const max_frames_for_clip = (clip, object, quantize) => {
  var max = 0;
  switch(object.type){
    case Constant.audio:
    case Constant.video: {
      max = Math.floor(object.duration * quantize) - clip.trim;
      break;
    }
  }
  return max;
}
const max_trim_for_clip = (clip, object, quantize) => {
  var max = 0;
  switch(object.type){
    case Constant.audio:
    case Constant.video: {
      max = Math.floor(object.duration * quantize) - Option.mash.minframes;
      break;
    }
  }
  return max;
}
const media = (mash, ob_or_id) => {
  return array_find(mash.media, ob_or_id);
}
const media_count_for_clips = (mash, clips, referenced) => {
  var clip, object, j, y, i, z, key, keys, reference;
  if (isob(referenced) && isarray(clips)) {
    y = clips.length;
    for (j = 0; j < y; j++){
      clip = clips[j];
      if (! clip) console.error('media_count_for_clips', clips);

      __media_reference(mash, clip.id, referenced);
      reference = referenced[clip.id];
      if (reference){
        object = reference.media;
        if (object) {
          if (is_modular_media(object)) {
            keys = properties_for_media(object, Constant.font);
            z = keys.length;
            for (i = 0; i < z; i++){
              key = keys[i];
              key = clip[key];
              __media_reference(mash, key, referenced, Constant.font);
            }
          }
          switch(object.type){
            case Constant.transition: {
              __media_merger_scaler(mash, object.to, referenced);
              __media_merger_scaler(mash, object.from, referenced);
              break;
            }
            case Constant.effect:
            case Constant.audio: break;
            default: {
              __media_merger_scaler(mash, clip, referenced);
              media_count_for_clips(mash, clip.effects, referenced);
            }
          }
        } else {
          console.error('could not find media', clip.id, reference);
        }
      } else {
        console.error('could not find reference');
      }
    }
  }
}
const media_for_clips = (mash, clips, object) => {
  const referenced = {}
  const medias = [];
  if (! isnt(clips)) {
    if (isob(object)) {
      referenced[object.id] = {
        media: object,
        count: 1,
      };
    }
    if (! isarray(clips)) clips = [clips];
    media_count_for_clips(mash, clips, referenced);
    
    for(var k in referenced){
      const reference = referenced[k];
      if (reference.media) medias.push(reference.media);
      else console.error('could not find media referenced in mash', k, reference.count);
    }
  }
  return medias;
}
const media_search = (type, ob_or_id, mash) => {
  var ob = null;
  if (!isnt(ob_or_id)) {
    if (mash) ob = media(mash, ob_or_id);
    if (! ob) ob = Registry.find(type, ob_or_id);
    if (! ob) ob = Defaults.module_for_type(type);
  }
  return ob;
}
const properties_for_media = (object, type) => {
  var key, prop_keys = [];
  if ((! isnt(type)) && isob(object) && isob(object.properties)){
    for(key in object.properties){
      if (type === object.properties[key].type){
        prop_keys.push(key);
      }
    }
  }
  return prop_keys;
}

const recalc_clips = (clips) => {
  if (clips.length > 1) clips.sort(sort_by_frame);
}
const recalc_track = (mash, track) => {
  if ((Constant.audio === track.type) || track.index) recalc_clips(track.clips);
  else recalc_video_clips(mash, track.clips);
}
const recalc_video_clips = (mash, clips) => {
  var clip, start_time = 0;
  for (var i = 0; i < clips.length; i++){
    clip = clips[i];
    const object = media(mash, clip)
    if (i && (Constant.transition === object.type)) start_time -= clip.frames;
    clip.frame = start_time;
    if (Constant.transition !== object.type) start_time += clip.frames;
  }
  recalc_clips(clips); // sorts by frame
}
const track_for_clip = (mash, clip, object) => {
  if (! object) object = media(mash, clip);
  var track, tracks, i = 0, z;
  tracks = mash[Constant.audio === object.type ? Constant.audio : Constant.video];
  if (! isnt(clip.track)) {
    i = clip.track;
    z = i + 1;
  } else z = tracks.length;
  for (; i < z; i++){
    track = tracks[i];
    if (-1 < track.clips.indexOf(clip)) return track;
  }
}
const urls_for_clips = (mash, clips, range, avb) => {
  return urls_of_type(urls_for_clips_by_type(mash, clips, range), avb);
}
const urls_for_clips_by_type = (mash, clips, range) => {
  // range is in this.__fps
  range = range.copy();
  const urls_by_type = {};
  var clip, j, y;
  y = clips.length;
  for (j = 0; j < y; j++){
    clip = clips[j];
    __urls_for_clip(mash, clip, range, urls_by_type);
  }
  //("Mash.urls_for_clips_by_type", urls_by_type)
  return urls_by_type;
}
const urls_for_video_clip = (clip, object, range, quantize, urls_by_type) => {
  if (! urls_by_type) urls_by_type = {};
  var add_one_frame = (range.frames > 1);
  range = __media_range(clip, object, range, quantize, add_one_frame);
  var s, url;
  var last_frame, frame,z;
  var media_time = new Time(Math.floor(Number(object.duration) * Number(object.fps)), object.fps);
  var last_media_frame = media_time.frame;
  var limited_range = range.copy();

  limited_range.minLength(media_time);
  z = limited_range.end;
  frame = limited_range.frame;
  for (; frame <= z; frame ++) {
    media_time = new Time(frame, limited_range.fps);
    media_time.scale(object.fps);
    if ((frame !== limited_range.frame) && (last_frame === media_time.frame)) continue;
    last_frame = media_time.frame;
    last_frame = Math.min(last_frame, last_media_frame - 1);
    s = String((Math.min(last_frame, last_media_frame) * object.increment) + object.begin);
    if (object.zeropadding) s = __pad(s, object.zeropadding, '0');
    url = object.url + object.pattern;
    url = url.replace('%', s);
    //console.log('pattern', object.pattern, url);
    urls_by_type[url] = true;
  }
  return urls_by_type;
}
const urls_of_type = (by_type, avb) => {
  var urls = {};
  var type, url, add_type;
  for (type in by_type){
    add_type = true;
    switch(avb){
      case Constant.audio: {
        add_type = (type === Constant.audio);
        break;
      }
      case Constant.video: {
        add_type = (type !== Constant.audio);
        break;
      }
    }
    if (add_type) {
      for (url in by_type[type]) urls[url] = type;
    }
  }
  return urls;
}
const __init_module = (type, module, object) => {
  if (object) {
    if (object.properties) {
      var k;
      for (k in object.properties){
        if (isnt(module[k])) module[k] = object.properties[k].value;
      }
    }
  } else return console.error("could not find media for module", module);
}
const __media_merger_scaler = (mash, object, referenced) => {
  if (isob(object)) {
    //console.log(object[Constant.merger].id, object[Constant.scaler].id);
    if (isob(object[Constant.merger])) __media_reference(mash, object[Constant.merger].id, referenced, Constant.merger);
    if (isob(object[Constant.scaler])) __media_reference(mash, object[Constant.scaler].id, referenced, Constant.scaler);
  }
}
const __media_range = (clip, object, range, quantize, add_one_frame) => {
  var result = TimeRange.fromTimes(clip_time(clip, object, range, quantize), clip_time(clip, object, range.endTime, quantize, add_one_frame));
  return result;
}
const __media_reference = (mash, media_id, referenced, type) => {
  if (referenced[media_id]) referenced[media_id].count++;
  else {
    referenced[media_id] = {};
    referenced[media_id].count = 1;
    referenced[media_id].media = media_search(type, media_id, mash);
  }
}
const __urls_for_clip = (mash, clip, range, urls_by_type) => {
  if (! isob(urls_by_type)) return console.error("Mash.__urls_for_clip with no urls_by_type", clip)
  
  var quantize, object, i, z, key, keys, font;
  quantize = mash.quantize;

  if (clip) {
    if (clip[Constant.merger]) {
      object = media_search(Constant.merger, clip[Constant.merger].id, mash);
      __urls_for_media_filters(object, urls_by_type);
    }
    if (clip[Constant.scaler]) {
      object = media_search(Constant.scaler, clip[Constant.scaler].id, mash);
      __urls_for_media_filters(object, urls_by_type);
    }
    object = media(mash, clip);
    if (object){
      switch(object.type){
        case 'frame':
        case Constant.video: {
          if (! urls_by_type.image) urls_by_type.image = {};
          urls_for_video_clip(clip, object, range, quantize, urls_by_type.image);
        }
        case Constant.audio: {
          if (clip_has_audio(clip, object)) {
            if (! urls_by_type.audio) urls_by_type.audio = {};
            urls_by_type.audio[Audio.media_url(object)] = true;
          }
          break;
        }
        case Constant.image: {
          if (! urls_by_type[object.type]) urls_by_type[object.type] = {};
          urls_by_type[object.type][object.url || object.source] = true;
          break;
        }
        default: { // modules
          __urls_for_media_filters(object, urls_by_type);

          keys = properties_for_media(object, Constant.font);
          z = keys.length;
          if (z) {
            for (i = 0; i < z; i++){
              key = keys[i];
              font = media_search(Constant.font, clip[key], mash);
              //console.log(key, clip[key], font);
              if (font) {
                const source = font.source
                if (source) {
                  if (! urls_by_type.font) urls_by_type.font = {}
                  urls_by_type.font[source] = true
                } else console.error("Mash.__urls_for_clip found font with no source", font)
              }
              else console.warn('could not find font', clip[key]);
            }
          }
        }
      }
      if (is_visual_media(object)){
        if (isarray(clip.effects) && clip.effects.length) {
          //console.log('effects', clip.effects);
          z = clip.effects.length;
          for (i = 0; i < z; i++){
            __urls_for_clip(mash, clip.effects[i], range, urls_by_type);
          }
        }
      }
    }
  }
}
const __urls_for_media_filters = (object, urls_by_type) => {
  var i, z, filter, filter_config;
  if (isob(object) && isob(urls_by_type) && object.filters) {
    z = object.filters.length;
    for (i = 0; i < z; i++){
      filter = object.filters[i];
      filter_config = Filter.find(filter.id);
      if (filter_config) {
        const source = filter_config.source
        if (source) {
          // standard filters don't have a source
          if (! urls_by_type[Constant.filter]) urls_by_type[Constant.filter] = {};
          urls_by_type[Constant.filter][source] = true;
        } 
      }
      else console.warn('filter not registered', filter.id);
    }
  }
}
const Mash = {
  clip_from_media,
  clip_has_audio,
  clip_time,
  init_clip,
  init_media,
  init_track,
  is_modular_media,
  is_visual_media,
  max_frames_for_clip,
  max_trim_for_clip,
  media,
  media_count_for_clips,
  media_for_clips,
  media_search,
  properties_for_media,
  recalc_clips,
  recalc_track,
  recalc_video_clips,
  track_for_clip,
  urls_for_clips,
  urls_for_clips_by_type,
  urls_for_video_clip,
  urls_of_type,
}

export default Mash