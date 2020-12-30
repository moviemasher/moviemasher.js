Mash = {
  clip_from_media: function(media){
    var key, type, property_type, property, clip = {id:media.id};
    if (media.properties){
      for (key in media.properties) {
        property = media.properties[key];
        if (Util.isnt(property.value)) {
          type = property.type;
          if (type){
            property_type = Constant.property_types[type];
            if (property_type){
              if (! Util.isnt(property_type.value)) clip[key] = property_type.value;
              else if (property_type.type) clip[key] = new property_type.type();
            }
          }
        }
        else clip[key] = property.value;
      }
    }
    return clip;
  },
  clip_has_audio: function(clip, media) {
    var has = false;
    switch(media.type){
      case Constant.video: {
        has = !! Audio.media_url(media);
        break;
      }
      case Constant.audio: {
        has = (media.url || media.source);
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
  },
  clip_time: function(clip, media, time, quantize, add_one_frame) {
    var clip_time = time.copyTime();
    clip_time.subtract(new TimeRange(clip.frame, quantize));
    var limit_time = new TimeRange(clip.frames, quantize);
    clip_time.min(limit_time);
    if (add_one_frame) {
      clip_time.frame += (clip.speed ? Math.ceil(clip.speed) : 1);
    }
    switch (media.type) {
      case Constant.video:
        if (clip.trim) {
          clip_time.add(new TimeRange(clip.trim, quantize));
        }
        if (clip.speed) {
          clip_time.divide(clip.speed, 'ceil');
        }
        break;
      case Constant.audio:
        if (clip.trim) clip_time.add(new TimeRange(clip.trim, quantize));
        break;
    }
    return clip_time;
  },
  effect_clips: function(vis_clips){
    var i, z, clip, clips = [];
    z = vis_clips.length;
    for (i = 0; i < z; i++){
      clip = vis_clips[i];
      if (Util.isarray(clip.effects) && clip.effects.length) clips = clips.concat(clip.effects);
    }
    return clips;
  },
  init_clip: function(mash, clip, media, track_index){
    if (! track_index) track_index = 0;
    if (clip && media && mash && (! Mash.init_media(media))) {
      if (Mash.is_modular_media(media)) Mash.init_module(media.type, clip, media);
      if (Constant.effect !== media.type){
        if (Util.isnt(clip.track)) clip.track = track_index;
        if (Util.isnt(clip.frame)) clip.frame = 0;
        switch(media.type){
          case Constant.video:
          case Constant.audio: {
            if (Util.isnt(clip[Constant.gain])) clip[Constant.gain] = 1.0;
            if (Util.isnt(clip.frames)) clip.frames = (new TimeRange(media.duration, 1)).scale(mash.quantize, 'floor').frame;
            if (Util.isnt(clip.trim)) clip.trim = 0;
            break;
          }
          default: {
            if (Util.isnt(clip.frames)) clip.frames = (new TimeRange(Option.mash[media.type + '_seconds'], 1)).scale(mash.quantize).frame;
          }
        }
        switch(media.type){
          case Constant.transition:
          case Constant.audio: break;
          default: {
            if (Util.isnt(clip.scaler)) clip.scaler = media.scaler || Defaults.module_from_type(Constant.scaler);
            if (Util.isnt(clip.merger)) clip.merger = media.merger || Defaults.module_from_type(Constant.merger);
            if (Util.isnt(clip.effects)) clip.effects = media.effects || [];
            media = clip.scaler;
            Mash.init_module(Constant.scaler, media, Mash.media_search(Constant.scaler, media.id, mash));
            media = clip.merger;
            Mash.init_module(Constant.merger, media, Mash.media_search(Constant.merger, media.id, mash));
            var i, z = clip.effects.length;
            for (i = 0; i < z; i++){
              media = clip.effects[i];
              Mash.init_module(Constant.effect, media, Mash.media_search(Constant.effect, media.id, mash));
            }
          }
        }
      }
    }
  },
  init_mash: function(mash){
    Util.copy_ob_scalars(Option.mash.default, mash, true);
    mash.quantize = (mash.quantize ? parseInt(mash.quantize) : 1);
    if (Util.isnt(mash.id)) mash.id = Util.uuid();
    var media_references, media, clip, tracks, track, key, i, z, j, y, x, k;
    media_references = {};
    if (! Util.isarray(mash.media)) mash.media = [];
    x = Constant.track_types.length;
    for (k = 0; k < x; k++){
      key = Constant.track_types[k];
      if (! Util.isarray(mash[key])) mash[key] = [];
      tracks = mash[key];
      z = tracks.length;
      if (z) {
        for (i = 0; i < z; i++){
          track = Mash.init_track(tracks[i], i);
          y = track.clips.length;
          if (y){
            for (j = 0; j < y; j++){
              clip = track.clips[j];
              media = Mash.media(mash, clip);
              Mash.init_clip(mash, clip, media, i);
            }
            Mash.media_count_for_clips(mash, track.clips, media_references);
          }
        }
      } else tracks.push(Mash.init_track(key, 0));
    }
    for(key in media_references){
      media_references[key] = media_references[key].count;
    }
    return media_references;
  },
  init_media: function(media){

    var error = ! Util.isob(media);
    if (! error) {
      if (Util.isnt(media.id)) media.id = Util.uuid();
      switch(media.type) {
        case Constant.video: {
          if (Util.isnt(media.fps)) media.fps = 10;
          if (Util.isnt(media.duration)) media.duration = 0;
          if (Util.isnt(media.begin)) media.begin = 1;
          if (Util.isnt(media.pattern)) media.pattern = '%.jpg';
          if (Util.isnt(media.increment)) media.increment = 1;
          if (Util.isnt(media.zeropadding)) media.zeropadding = String(media.begin + (media.increment * Math.floor(media.fps * media.duration))).length;
          break;
        }
        case Constant.transition: {
          if (Util.isnt(media.to)) media.to = {};
          if (Util.isnt(media.from)) media.from = {};
          if (Util.isnt(media.to.scaler)) media.to.scaler = Defaults.module_from_type(Constant.scaler);
          if (Util.isnt(media.to.merger)) media.to.merger = Defaults.module_from_type(Constant.merger);
          if (Util.isnt(media.from.scaler)) media.from.scaler = Defaults.module_from_type(Constant.scaler);
          if (Util.isnt(media.from.merger)) media.from.merger = Defaults.module_from_type(Constant.merger);
      //console.log('init_media', media, media.id);
          break;
        }
      }
    }
    if (error) console.error('init_media got invalid media', media);
    return error;
  },
  init_module: function(type, module, media){
    if (media) {
      if (media.properties) {
        var k;
        for (k in media.properties){
          if (Util.isnt(module[k])) module[k] = media.properties[k].value;
        }
      }
    } else return console.error("could not find media for module", module);
  },
  init_track: function(track, index){
    if (! Util.isob(track)) track = {type:track};
    track.index = index;
    if (! Util.isarray(track.clips)) track.clips = [];
    return track;
  },
  is_modular_clip: function(mash, clip){
    return Mash.is_modular_media(Mash.media(mash, clip));
  },
  is_modular_media: function(media){
    var is = false;
    if (Util.isob(media) && (! Util.isnt(media.type))) {
      switch(media.type){
        case Constant.image:
        case Constant.audio:
        case Constant.video:
        case 'frame': break;
        default: is = true;
      }
    }
    return is;
  },
  is_visual_media: function(media){
    var is = false;
    if (Util.isob(media)) {
      switch(media.type){
        case Constant.image:
        case Constant.video:
        case Constant.transition:
        case Constant.theme: is = true;
      }
    }
    return is;
  },
  length_of_clips: function(clips){
    var clip, frames = 0;
    if (Util.isarray(clips) && clips.length) {
      clip = clips[clips.length -1];
      frames = clip.frame + clip.frames;
    }
    return frames;
  },
  loaded_range: function(mash, range, audio_on){
    var urls = Mash.urls_for_clips(mash, Mash.range_clips(mash, range, audio_on), range);
    return Loader.loaded_urls_of_type(urls);
  },
  max_frames_for_clip: function(clip, media, quantize){
    var max = 0;
    switch(media.type){
      case Constant.audio:
      case Constant.video: {
        max = Math.floor(media.duration * quantize) - clip.trim;
        break;
      }
    }
    return max;
  },
  max_trim_for_clip: function(clip, media, quantize){
    var max = 0;
    switch(media.type){
      case Constant.audio:
      case Constant.video: {
        max = Math.floor(media.duration * quantize) - Option.mash.minframes;
        break;
      }
    }
    return max;
  },
  media: function(mash, ob_or_id){
    return Util.array_find(mash.media, ob_or_id);
  },
  media_count_for_clips: function(mash, clips, referenced){
    var clip, media, j, y, i, z, key, keys, reference;
    if (Util.isob(referenced) && Util.isarray(clips)) {
      y = clips.length;
      for (j = 0; j < y; j++){
        clip = clips[j];
        if (! clip) console.error('media_count_for_clips', clips);

        Mash.media_reference(mash, clip.id, referenced);
        reference = referenced[clip.id];
        if (reference){
          media = reference.media;
          if (media) {
            if (Mash.is_modular_media(media)) {
              keys = Mash.properties_for_media(media, Constant.font);
              z = keys.length;
              for (i = 0; i < z; i++){
                key = keys[i];
                key = clip[key];
                Mash.media_reference(mash, key, referenced, Constant.font);
              }
            }
            switch(media.type){
              case Constant.transition: {
                Mash.media_merger_scaler(mash, media.to, referenced);
                Mash.media_merger_scaler(mash, media.from, referenced);
                break;
              }
              case Constant.effect:
              case Constant.audio: break;
              default: {
                Mash.media_merger_scaler(mash, clip, referenced);
                Mash.media_count_for_clips(mash, clip.effects, referenced);
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
  },
  media_for_clips: function(mash, clips, media){
    var reference, k, referenced = {}, medias = [];
    if (! Util.isnt(clips)) {
      if (Util.isob(media)) {
        referenced[media.id] = {
          media: media,
          count: 1,
        };
      }
      if (! Util.isarray(clips)) clips = [clips];
      Mash.media_count_for_clips(mash, clips, referenced);
      for(k in referenced){
        reference = referenced[k];
        if (reference.media) medias.push(reference.media);
        else console.error('could not find media referenced in mash', k, reference.count);
      }
    }
    return medias;
  },
  media_merger_scaler: function(mash, object, referenced){
    if (Util.isob(object)) {
      //console.log(object[Constant.merger].id, object[Constant.scaler].id);
      if (Util.isob(object[Constant.merger])) Mash.media_reference(mash, object[Constant.merger].id, referenced, Constant.merger);
      if (Util.isob(object[Constant.scaler])) Mash.media_reference(mash, object[Constant.scaler].id, referenced, Constant.scaler);
    }
  },
  media_range: function(clip, media, range, quantize, add_one_frame) {
    var result = TimeRange.fromTimes(Mash.clip_time(clip, media, range, quantize), Mash.clip_time(clip, media, range.endTime, quantize, add_one_frame));
    return result;
  },
  media_reference: function(mash, media_id, referenced, type){
    if (referenced[media_id]) referenced[media_id].count++;
    else {
      referenced[media_id] = {};
      referenced[media_id].count = 1;
      referenced[media_id].media = Mash.media_search(type, media_id, mash);
    }
  },
  media_search: function(type, ob_or_id, mash){
    var ob = null;
    if ( ! Util.isnt(ob_or_id)) {
      if (mash) ob = Mash.media(mash, ob_or_id);
      if (! ob) ob = MovieMasher.find(type, ob_or_id);
      if (! ob) ob = Defaults.module_for_type(type);
    }
    return ob;
  },
  module_clips: function(mash){
    var clip, i, z, clips, vis_clips;
    vis_clips = Mash.visual_clips(mash);
    clips = Mash.effect_clips(vis_clips); // all effects are modules
    z = vis_clips.length;
    for (i = 0; i < z; i++) {
      clip = vis_clips[i];
      if (Mash.is_modular_clip(mash, clip)) clips.push(clip);
    }
    return clips;
  },
  modules_reference_media: function(mash, ob_or_id){
    var does, i, z, key, keys, j, y, media, clip, clips = Mash.module_clips(mash);
    if (Util.isob(ob_or_id)) ob_or_id = ob_or_id.id;
    if (ob_or_id) {
      z = clips.length;
      for (i = 0; i < z; i++) {
        clip = clips[i];
        if (clip.scaler) does = (ob_or_id === clip.scaler.id);
        if (clip.merger) does = (does || (ob_or_id === clip.merger.id));
        if (! does){
          media = Mash.media(mash, clip);
          if (media){
            keys = Mash.properties_for_media(media, Constant.font);
            y = keys.length;
            for (j = 0; j < y; j++){
              key = keys[j];
              does = (ob_or_id === clip[key]);
              if (does) break;
            }
          }
        }
        if (does) break;
      }
    }
    return does;
  },
  properties_for_media: function(media, type){
    var key, prop_keys = [];
    if ((! Util.isnt(type)) && Util.isob(media) && Util.isob(media.properties)){
      for(key in media.properties){
        if (type === media.properties[key].type){
          prop_keys.push(key);
        }
      }
    }
    return prop_keys;
  },
  range_clips: function(mash, time, include_audio){
    time = time.copyTimeRange();
    var clip_time, key, tracks, track, clips = [], clip, i, z, j, y, k, x;
    clip_time = new TimeRange(0, mash.quantize, 1);
    x = Constant.track_types.length;
    for (k = 0; k < x; k++){
      key = Constant.track_types[k];
      if ((key === Constant.audio) && (! include_audio)) continue;
      tracks = mash[key];
      z = tracks.length;
      for (i = 0; i < z; i++) {
        track = tracks[i];
        y = track.clips.length;
        for (j = 0; j < y; j++) {
          clip = track.clips[j];
          clip_time.frame = clip.frame;
          clip_time.frames = clip.frames;
          if (clip_time.intersection(time)) clips.push(clip);
        }
      }
    }
    return clips;
  },
  recalc_clips: function(clips){
    if (clips.length > 1) clips.sort(Util.sort_by_frame);
  },
  recalc_track: function(mash, track){
    if ((Constant.audio === track.type) || track.index) Mash.recalc_clips(track.clips);
    else Mash.recalc_video_clips(mash, track.clips);
  },
  recalc_video_clips: function(mash, clips) {
    var media, i, z, clip, start_time = 0;
    z = clips.length;
    for (i = 0; i < z; i++){
      clip = clips[i];
      media = Mash.media(mash, clip);
      if (i && (Constant.transition === media.type)) start_time -= clip.frames;
      clip.frame = start_time;
      if (Constant.transition !== media.type) start_time += clip.frames;
    }
    Mash.recalc_clips(clips); // sorts by frame
  },
  track_for_clip: function(mash, clip, media){
    if (! media) media = Mash.media(mash, clip);
    var track, tracks, i = 0, z;
    tracks = mash[Constant.audio === media.type ? Constant.audio : Constant.video];
    if (! Util.isnt(clip.track)) {
      i = clip.track;
      z = i + 1;
    } else z = tracks.length;
    for (; i < z; i++){
      track = tracks[i];
      if (-1 < track.clips.indexOf(clip)) return track;
    }
  },
  urls_for_clip: function(mash, clip, range, resources){
    var quantize, media, i, z, key, keys, font;
    quantize = mash.quantize;
    if (! Util.isob(resources)) resources = {};
    if (clip) {
      if (clip[Constant.merger]) {
        media = Mash.media_search(Constant.merger, clip[Constant.merger].id, mash);
        Mash.urls_for_media_filters(media, resources);
      }
      if (clip[Constant.scaler]) {
        media = Mash.media_search(Constant.scaler, clip[Constant.scaler].id, mash);
        Mash.urls_for_media_filters(media, resources);
      }
    media = Mash.media(mash, clip);
    if (media){
      switch(media.type){
        case 'frame':
        case Constant.video: {
          if (! resources.image) resources.image = {};
          Mash.urls_for_video_clip(clip, media, range, quantize, resources.image);
        }
        case Constant.audio: {
          if (Mash.clip_has_audio(clip, media)) {
            if (! resources.audio) resources.audio = {};
            resources.audio[Audio.media_url(media)] = true;
          }
          break;
        }
        case Constant.image: {
          if (! resources[media.type]) resources[media.type] = {};
          resources[media.type][media.url || media.source] = true;
          break;
        }
        default: { // modules
          Mash.urls_for_media_filters(media, resources);


          keys = Mash.properties_for_media(media, Constant.font);
          z = keys.length;
          if (z) {
            for (i = 0; i < z; i++){
              key = keys[i];
              font = Mash.media_search(Constant.font, clip[key], mash);
              //console.log(key, clip[key], font);
              if (font){
                if (font.source) {
                  //console.log(Constant.font, key, font.source);
                  if (! resources.font) resources.font = {};
                  resources.font[font.source] = true;
                }
              }
              else console.warn('could not find font', clip[key]);
            }
          }
        }
      }
      if (Mash.is_visual_media(media)){
        if (Util.isarray(clip.effects) && clip.effects.length) {
          //console.log('effects', clip.effects);
          z = clip.effects.length;
          for (i = 0; i < z; i++){
            Mash.urls_for_clip(mash, clip.effects[i], range, resources);
          }
        }
      }
    }
    }
    return resources;
  },
  urls_for_clips: function(mash, clips, range, avb){
    return Mash.urls_of_type(Mash.urls_for_clips_by_type(mash, clips, range), avb);
  },
  urls_for_clips_by_type: function(mash, clips, range){
    // range is in this.__fps
    range = range.copyTimeRange();
    var resources = {};
    var clip, j, y;
    y = clips.length;
    for (j = 0; j < y; j++){
      clip = clips[j];
      Mash.urls_for_clip(mash, clip, range, resources);
    }
    return resources;
  },
  urls_for_media_filters: function(media, referenced){
    var i, z, filter, filter_config;
      if (Util.isob(media) && Util.isob(referenced) && media.filters) {
        z = media.filters.length;
        for (i = 0; i < z; i++){
          filter = media.filters[i];
          filter_config = Filter.find(filter.id);
          if (filter_config) {
            if (! referenced[Constant.filter]) referenced[Constant.filter] = {};
              referenced[Constant.filter][filter_config.source] = true;
            }
          else console.warn('filter not registered', filter.id);
        }
      }
  },
  urls_for_video_clip: function(clip, media, range, quantize, resources){
    if (! resources) resources = {};
    var add_one_frame = (range.frames > 1);
    range = Mash.media_range(clip, media, range, quantize, add_one_frame);
    var s, url;
    var last_frame, frame,z;
    var media_time = new TimeRange(Math.floor(Number(media.duration) * Number(media.fps)), media.fps);
    var last_media_frame = media_time.frame;
    var limited_range = range.copyTimeRange();

    limited_range.minLength(media_time);
    z = limited_range.end;
    frame = limited_range.frame;
    for (; frame <= z; frame ++) {
      media_time = new TimeRange(frame, limited_range.fps);
      media_time.scale(media.fps);
      if ((frame !== limited_range.frame) && (last_frame === media_time.frame)) continue;
      last_frame = media_time.frame;
      last_frame = Math.min(last_frame, last_media_frame - 1);
      s = String((Math.min(last_frame, last_media_frame) * media.increment) + media.begin);
      if (media.zeropadding) s = Util.pad(s, media.zeropadding, '0');
      url = media.url + media.pattern;
      url = url.replace('%', s);
      //console.log('pattern', media.pattern, url);
      resources[url] = true;
    }
    return resources;
  },
  urls_of_type: function(urls_by_type, avb){
    var urls = {};
    var type, url, add_type;
    for (type in urls_by_type){
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
        for (url in urls_by_type[type]) urls[url] = type;
      }
    }
    return urls;
  },
  visual_clips: function(mash){
    var track, i, z, clips = [];
    z = mash.video.length;
    for (i = 0; i < z; i++) {
      track = mash.video[i];
      if (Util.isarray(track.clips) && track.clips.length) clips = clips.concat(track.clips);
    }
    return clips;
  },
};
MovieMasher.Mash = Mash;
