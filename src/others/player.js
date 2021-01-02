Player = function(evaluated) {
  if (! Util.isob(evaluated)) evaluated = {};
  var value, key, new_mash = {};
  Util.copy_ob_scalars(Option.player, evaluated);
  this.__drawing = {drawings: []};
  this.__load_timer = null;
  this.__moving = false;
  this.__muted = false;
  this.__paused = true;
  this.__stalling = false;
  this.__minbuffertime = new TimeRange(evaluated.minbuffertime, 1);
  this.__unbuffertime = new TimeRange(evaluated.unbuffertime, 1);
  this.__buffertime = new TimeRange(evaluated.buffertime, 1);
  this.__time = new TimeRange(0, 1);
  this.__time_drawn = new TimeRange(0, 1);
  for (key in evaluated){
    value = evaluated[key];
    switch(key){
      case "mash": new_mash = value;
      case "minbuffertime":
      case "unbuffertime":
      case "buffertime":
      case "fps": continue;
      default: this[key] = value; // gain, loop, autoplay, volume, etc.
    }
  }
  this.fps = evaluated.fps; // sets this.__fps and scales other times
  this.mash = new_mash;
};
(function(pt){
  var dp = Object.defineProperty;
  dp(pt, "action_index", {
    get: function() { return this.__action_index;}
  }); // action_index
  dp(pt, "autoplay", {
    get: function() {return this.__autoplay;},
    set: function(bool) {
      this.__autoplay = bool;
    }
  }); // autoplay
  dp(pt, "buffertime", {
    get: function() {return this.__buffertime.seconds;},
    set: function(seconds) { this.__buffertime = TimeRange.fromSeconds(seconds, this.__fps); }
  }); // buffertime
  dp(pt, "canvas_context", {
    get: function() { return this.__drawing.context; },
    set: function(drawing_context) {
      // console.log('canvas_context=', drawing_context);
      this.__drawing.context = drawing_context;
      this.__drawing.canvas = (drawing_context ? drawing_context.canvas : null);
      if (this.__mash) {
        this.__draw_context();
        this.redraw(); // will draw if buffered, otherwise start buffering
      }
    }
  }); // canvas_context
  dp(pt, "canvas_container", {
    get: function() { return this.__drawing.container; },
    set: function(element) {
      // console.log('canvas_container=', element);
      this.__drawing.container = element;
    }
  }); // canvas_container
  dp(pt, "currentTime", {
    get: function() { return this.__time.seconds; },
    set: function(seconds) {
      // console.log('currentTime=');
      this.time = TimeRange.fromSeconds(seconds, this.__fps);
    }
  }); // currentTime
  dp(pt, "duration", {
    get: function() { return (this.__mash_length ? Number(this.__mash_length) / Number(this.__mash.quantize) : 0.0); }
  }); // duration
  dp(pt, "fps", {
    get: function() { return this.__fps;},
    set: function(rate) {
      if (rate) {
        rate = Math.round(Number(rate));
        if (rate && (this.__fps !== rate)) {
          this.__fps = rate;
          this.__time.scale(this.__fps);
          this.__minbuffertime.scale(this.__fps);
          this.__unbuffertime.scale(this.__fps);
          this.__buffertime.scale(this.__fps);
          this.__time_drawn.scale(this.__fps);
        }
      }
    }
  }); // fps
  dp(pt, "frame", {
    get: function() { return this.__time.frame;},
    set: function(num) {
      // called from ruler to change position
      // console.log('frame=', num);
      this.time = new TimeRange(num, this.__fps);
    }
  }); // frame
  dp(pt, "frames", {
    get: function() { return Math.round(Number(this.__mash_length) / Number(this.__mash.quantize) * Number(this.__time.fps));}
  }); // frames
  dp(pt, "loop", {
    get: function() { return this.__loop; },
    set: function(bool) {
      this.__loop = bool;
    }
  }); // loop
  dp(pt, "mash", {
    get: function() { return this.__mash; },
    set: function(obj) {
      this.paused = true;
      this.__action_index = -1;
      this.__action_stack = [];
      this.__selected_effects = [];
      this.__mash = obj || {};
      this.__media_references = Mash.init_mash(this.__mash);
      this.selectedClips = []; // so mash gets copied into __pristine_clip
      this.mash_length_changed();
      this.rebuffer();
      this.redraw();
      if (this.__autoplay) this.paused = false;
    }
  }); // mash
  dp(pt, "minbuffertime", {
    get: function() {return this.__minbuffertime.seconds;},
    set: function(seconds) { this.__minbuffertime = TimeRange.fromSeconds(seconds, this.__fps); }
  }); // minbuffertime
  dp(pt, "muted", {
    get: function() { return this.__muted;},
    set: function(bool) {
      this.__muted = bool;
      if (this.__moving) this.__adjust_gain(Mash.range_clips(this.__mash, this.__time, true));
    }
  }); // muted
  dp(pt, "paused", {
    get: function() { return this.__paused;},
    set: function(bool) {
      if (! this.__mash_length) bool = true;
      if (this.__paused !== bool){
        this.__paused = bool;
        if (this.__paused) {
          // console.log('paused __set_moving(false)');
          this.__set_moving(false);
          if (this.__buffer_timer) {
            clearInterval(this.__buffer_timer);
            this.__buffer_timer = 0;
          }
          Players.stop_playing();
        } else {
          Players.start_playing(this);
          if (! this.__buffer_timer){
            var $this = this;
            this.__buffer_timer = setInterval(function(){$this.rebuffer();}, 2000);
          }
          this.rebuffer();
          this.redraw();
        }
        this.__set_stalling((! this.__moving) && (! this.__paused));
      }
    }
  }); // paused
  dp(pt, "position", {
    get: function() {
      var dur, per = 0;
      if (this.__time.frame) {
        dur = this.duration;
        if (dur) {
          per = this.__time.seconds / dur;
          if (per !== 1) per = parseFloat(per.toFixed(this.position_precision));
        }
      }
      // console.log('position ! get', per);
      return per;
    },
    set: function(per) {
      // called from player's slider
      // console.log('position set', per);
      var time_range = new TimeRange(this.duration * per, 1);
      time_range.scale(this.__fps);
      this.time = time_range;
    }
  }); // position
  dp(pt, "position_step", {
    get: function() {
      return parseFloat("0." + "0".repeat(this.position_precision - 1) + "1");
    }
  }); // position
  dp(pt, 'selectedClip', { get: function(){
    return (this.__selected_clips.length === 1 ? this.__selected_clips[0] : null);
  }, set: function(item){
    // console.log('selectedClip=', item);
    var selected_clips = [];
    if (Util.isob(item) && !Util.isempty(item)) {
      selected_clips.push(item);
    }
    this.selectedClips = selected_clips;
  }}); // selectedClip
  dp(pt, "selectedClipOrMash", {
    get: function() { return this.selectedClip || this.__mash; },
  }); // selectedClipOrMash
  dp(pt, "selectedClips", {
    get: function() { return this.__selected_clips; },
    set: function(selection) {
      // console.log('selectedClips=', selection);
      var key, media, clip, i, z, types;
      if (! Util.isob(selection)) selection = [];
      if (selection.length){
        types = {};
        z = selection.length;
        for (i = 0; i < z; i++){
          clip = selection[i];
          media = Mash.media(this.__mash, clip);
          if (!media) {
            console.error('no media for selected clip', clip);
          } else {

            key = media.type;
            switch(key){
              case Constant.audio: break;
              case Constant.effect: continue; // effects are ignored
              default: key = 'video-' + (clip.track || 0);
            }
            if (! types[key]) types[key] = [];
            types[key].push(clip);
          }
        }
        for(key in types) {
          selection = types[key];
          break; // we only select first track type found
        }
      }
      this.__selected_clips = selection;
      this.selectedEffects = false;
      this.__pristine_clip = Util.copy_ob_scalars(this.selectedClipOrMash);
      // console.log('__pristine_clip', this.__pristine_clip);
      if (this.selectedClipOrMash.scaler) this.__pristine_clip.scaler = Util.copy_ob_scalars(this.selectedClipOrMash.scaler);
      if (this.selectedClipOrMash.merger) this.__pristine_clip.merger = Util.copy_ob_scalars(this.selectedClipOrMash.merger);
    },
  }); // selectedClips
  dp(pt, 'selectedEffect', { get: function(){
    return (this.__selected_effects.length === 1 ? this.__selected_effects[0] : null);
  }, set: function(item){
    this.selectedEffects = (Util.isob(item) ? [item] : []);
  }}); // selectedEffect
  dp(pt, "selectedEffects", {
    get: function() { return this.__selected_effects; },
    set: function(selection) {
      var effect, i, z, media, effects, target;
      if (! Util.isarray(selection)) selection = [];
      if (selection.length && (this.__selected_clips.length < 2)){ // a clip or the mash
        target = this.selectedClip;
        effects = [];
        if (target && Util.isarray(target.effects)) {
          z = selection.length;
          for (i = 0; i < z; i++){
            effect = selection[i];
            media = Mash.media(this.__mash, effect);
            if (media && (Constant.effect === media.type) && (-1 < target.effects.indexOf(effect))) effects.push(effect);
          }
        }
        selection = effects;
      }
      this.__selected_effects = selection;
      this.__pristine_effect = Util.copy_ob_scalars(this.selectedEffect);
    }
  }); // selectedEffects
  dp(pt, "stalling", {
    get: function() { return this.__stalling;}
  }); // stalling
  dp(pt, "time", {
    get: function() { return this.__time;},
    set: function(something) {
      var new_time = TimeRange.fromSomething(something);
      new_time = this.__limit_time(new_time);
      if (! this.__time.isEqualToTime(new_time)) {
        // console.log('time= __changed_mash_or_time', this.__time.description, new_time.description);
        this.__changed_mash_or_time(new_time);
      }
    }
  }); // time
  dp(pt, "unbuffertime", {
    get: function() {return this.__unbuffertime.seconds;},
    set: function(seconds) { this.__unbuffertime = TimeRange.fromSeconds(seconds, this.__fps); }
  }); // unbuffertime
  dp(pt, "volume", {
    get: function() { return this.__gain;},
    set: function(per) {
      this.__gain = per;
      if (this.__moving) this.__adjust_gain(Mash.range_clips(this.__mash, this.__time, true));
    }
  }); // volume (gain)
  pt.add = function(media, type, frame_or_index, track_index){
    var action, objects, clip;
    if (! Mash.init_media(media)) {
      if (! type) type = (Mash.is_visual_media(media) ? Constant.video : media.type);
      if (! track_index) track_index = 0;
      if (! frame_or_index) frame_or_index = 0;
      clip = Mash.clip_from_media(media);
      if (! clip) console.error('add got no clip from media', clip, media);
      Mash.init_clip(this.__mash, clip, media, track_index);
      if (Constant.effect === type) action = this.__action_effect_add(clip, frame_or_index);
      else if ((Constant.audio === type) || track_index) action = this.__action_track_add(media.type, clip, track_index, frame_or_index);
      else action = this.__action_video_add(clip, track_index, frame_or_index);
      if (action){
        objects = Mash.media_for_clips(this.__mash, clip, media);
        // console.log('media_for_clips', clip, objects, media);
        action.redo_add_objects = objects;
        action.undo_delete_objects = objects;
        if (Constant.effect === media.type) action.redo_selected_effects = [clip];
        else action.redo_selected_clips = [clip];
        this.__action_add(action);
      }
    }
    return clip;
  };
  pt.add_media = function(array){
    var media_id, media, i, z;
    if (! Util.isarray(array)) array = [array];
    z = array.length;
    for (i = 0; i < z; i++){
      media = array[i];
      media_id = (Util.isob(media) ? media.id : media);
      if (! this.__media_references[media_id]){
        this.__media_references[media_id] = 0;
        if (! Util.array_find(this.__mash.media, media)) {
          this.__mash.media.push(media);
        }
      }
      this.__media_references[media_id]++;
    }
  }; // called by Action
  pt.addTrack = function(type){
    // console.log('addTrack creating action');
    this.__action_add(new Action(this, function(){
      this.player.__track_create(type);
    }, function(){
      this.player.__track_delete(type);
    }));
  };
  pt.can = function(method){
    var should_be_enabled = false;
    var z = this.__selected_clips.length;
    switch(method){
      case 'undo':{
        should_be_enabled = (this.__action_index > -1);
        break;
      }
      case 'redo':{
        should_be_enabled = (this.__action_index < (this.__action_stack.length - 1));
        break;
      }
      case 'adjust':{
        should_be_enabled = (z > 0);
        if (should_be_enabled) should_be_enabled = (this.__selected_clips[0].track > 0);
        break;
      }
      case 'copy':{
        should_be_enabled = (z > 0);
        break;
      }
      case 'cut':
      case 'remove':{
        should_be_enabled = (this.__selected_clips.length);
        if (should_be_enabled) {
          // TODO: test that removing won't create transition problem
        }
        break;
      }
      case 'split':{
        should_be_enabled = (z === 1);
        if (should_be_enabled) should_be_enabled = this.__canSplitAtTime(this.__selected_clips[0], this.__time);
        break;
      }
      case 'freeze':{
        should_be_enabled = (z > 0);
        if (should_be_enabled) should_be_enabled = (Constant.video === Mash.media(this.__mash, this.__selected_clips[0]).type);
        if (should_be_enabled) should_be_enabled = this.__canSplitAtTime(this.__selected_clips[0], this.__time);
        break;
      }
    }
    return should_be_enabled;
  };
  pt.change = function(prop, is_effect){
    if (prop && prop.length) {
      var media, action, target, id = 'change-property';
      target = (is_effect ? this.selectedEffect : this.selectedClipOrMash);
      if ( (!is_effect) && (!this.selectedClip)) {
        // the mash is selected
        if (Util.isnt(target[prop])) target = null;
      }
      if (target){
        if (
          (this.__action_index > -1) && // at least one action
          (this.__action_index === this.__action_stack.length - 1) && // current one is last one
          (Util.keys_found_equal({id: id, target: target, property: prop}, this.__action_stack[this.__action_index]))
        ) { // so, reuse existing action
          action = this.__action_stack[this.__action_index];
          action.value = Util.ob_property(target, prop);
          //console.warn('reusing action', action.value);
          action._redo();
          this.__changed_mash_or_time();
        } else {
          var target_copy = (is_effect ? this.__pristine_effect : this.__pristine_clip);
          var undo_func = function() { this.set_property(this.orig_value); };
          var redo_func = function() { this.set_property(this.value); };
          var action_is_id = false;
          media = Mash.media(this.__mash, target);
          // check to see if we're changing a module's property of type font
          if (media && Mash.is_modular_media(media)) action_is_id = ((-1 < Mash.properties_for_media(media, Constant.font).indexOf(prop)) ? Constant.font : null);
          // check to see if we're changing merger.id or scaler.id
          if (! action_is_id) action_is_id = (('.id' === prop.substr(-3)) ? prop.substr(0, prop.length-3) : null);
          if (action_is_id) {
            undo_func = function() { this.change_data(this.orig_value, true); };
            redo_func = function(){ this.change_data(this.value); };
          }
          // console.log('change creating action', prop, target);

          action = new Action(this, redo_func, undo_func);
          switch(prop){
            case 'frames': {
              action.max = Mash.max_frames_for_clip(target, media, this.__mash.quantize);
              action.set_property = function(new_value){
                new_value = Math.max(Option.mash.minframes, new_value);
                if (this.max) new_value = Math.min(this.max, new_value);
                Util.set_ob_property(this.target, this.property, new_value);
                Mash.recalc_track(this.player.mash, Mash.track_for_clip(this.player.mash, this.target));
                this.player.mash_length_changed();
              };
              break;
            }
            case 'trim': {
              action.orig_length = Util.ob_property(target, 'frames');
              action.max = Mash.max_trim_for_clip(target, media, this.__mash.quantize);
              action.set_property = function(new_value){
                new_value = Math.max(0, new_value);
                if (this.max) new_value = Math.min(this.max, new_value);
                Util.set_ob_property(this.target, this.property, new_value);
                new_value = this.orig_length - (new_value - this.orig_value);
                Util.set_ob_property(this.target, 'frames', new_value);
                Mash.recalc_track(this.player.mash, Mash.track_for_clip(this.player.mash, this.target));
                this.player.mash_length_changed();
              };
              break;
            }
            case Constant.gain: {
              action.set_property = function(new_value){
                Util.set_ob_property(this.target, this.property, new_value);
                Audio.gain_source(Audio.source_for_clip(this.target));
              };
              break;
            }
            default: {
              action.set_property = function(new_value){
                Util.set_ob_property(this.target, this.property, new_value);
              };
            }
          }
          action.target = target;
          action.id = id;
          action.property = prop;
          action.value = Util.ob_property(target, prop);
          action.orig_value = Util.ob_property(target_copy, prop);
          if (action_is_id) {
            action.is_id = action_is_id;
            action.last_value = action.orig_value;
            action.change_data = function(new_value, is_undo){
              // console.log('change_data', this.is_id, new_value);
              var new_ob = Mash.media_search(this.is_id, new_value, this.player.mash);
              if (! new_ob) return console.error("could not find " + this.is_id + " for " + new_value);
              this.player.add_media(new_ob);
              if (Constant.font === this.is_id) {
                this.set_property(new_value);
              } else this.target[this.is_id] = (is_undo ? target_copy[this.is_id] : Mash.clip_from_media(new_ob));
              //if (! Mash.modules_reference_media(this.player.mash, this.last_value))
              this.player.remove_media(Mash.media_search(this.is_id, this.last_value, this.player.mash));
              this.last_value = new_value;

            };
          }
          this.__action_add(action);
        }
      }
    }
  };
  pt.changeEffect = function(prop){
    this.change(prop, true);
  };
  pt.deleteable_urls = function(urls){
    var url, unneeded_urls = {};
    for (url in urls) {
      if (! this.__needed_urls[url]) unneeded_urls[url] = true;
    }
    return unneeded_urls;
  }; // called by Loader
  pt.destroy = function(){
    this.mash = null;
    this.canvas_context = null;
  }; // call when player removed from DOM
  pt.did = function(){}; // override me for action undo/redo callback
  pt.mash_length_changed = function(){
    var i, z, x, k, key, tracks, mash_length = 0;
    x = Constant.track_types.length;
    for (k = 0; k < x; k++){
      key = Constant.track_types[k];
      tracks = this.__mash[key];
      z = tracks.length;
      for (i = 0; i < z; i++) {
        mash_length = Math.max(mash_length, Mash.length_of_clips(tracks[i].clips));
      }
    }
    if (this.__mash_length !== mash_length){
      this.__mash_length = mash_length;
      var time_range = new TimeRange(this.__mash_length, this.__mash.quantize);
      time_range.scale(this.__fps, 'floor');
      this.__mash_frames = time_range.frame;
      this.frame = Math.max(0, Math.min(this.__mash_frames - 1, this.__time.frame)); // move back if we need to
    }
  };
  pt.media = function(ob_or_id){
    return Mash.media(this.__mash, ob_or_id);
  };
  pt.move = function(ob_or_array, type, frame_or_index, track_index) {
    if (! Util.isnt(ob_or_array, type)) {
      if (! Util.isarray(ob_or_array)) ob_or_array = [ob_or_array];
      if (Util.isob.apply(Util, ob_or_array)) {
        if (! track_index) track_index = 0;
        if (! frame_or_index) frame_or_index = 0;
        var action;
        if (Constant.effect === type) {
          frame_or_index = Util.index_after_removal(frame_or_index, ob_or_array, this.selectedClipOrMash.effects);
          if (-2 < frame_or_index) action = this.__action_effects_move(frame_or_index, ob_or_array, this.selectedClipOrMash.effects);
        } else if ((Constant.audio === type) || track_index) {
          action = this.__action_clips_move(type, track_index, frame_or_index, ob_or_array);
        } else {
          frame_or_index = Util.index_after_removal(frame_or_index, ob_or_array, this.__mash[type][track_index].clips);
          if (-2 < frame_or_index) action = this.__action_video_move(track_index, frame_or_index, ob_or_array);
        }
        if (action) this.__action_add(action);
      }
    }
  };
  pt.pause = function() {
    this.paused = true;
  };
  pt.play = function() {
    this.paused = false;
  };
  pt.rebuffer = function(){
    var delayed_draw, audio_on, range, media, clip, clips, i, z, needed_urls = {}, audio_clips = [];
    if (this.__mash) {
      audio_on = this.__audio_is_on();
      // time we want to buffer - just the current frame if paused, otherwise from it to it plus buffertime
      range = (this.__paused ? this.__time.copyTime() : new TimeRange(this.__time.frame, this.__time.fps, this.__buffertime.frame));
      // make sure range is within the mash range
      if (! range.intersection(new TimeRange(0, this.__mash.quantize, this.__mash_length))) range = null;
      if (range) {
        clips = Mash.range_clips(this.__mash, range, audio_on);
        needed_urls = Mash.urls_for_clips(this.__mash, clips, range, (audio_on ? Constant.both : Constant.video));
        Loader.load_urls_of_type(needed_urls);
        if (audio_on) {
          z = clips.length;
          for (i = 0; i < z; i++) {
            clip = clips[i];
            media = Mash.media(this.__mash, clip);
            if (Mash.clip_has_audio(clip, media)) {
              // makes sure there is a source for clip
              if (! Audio.source_for_clip(clip)) {
                Audio.source_from_clip(clip, media, this);
                delayed_draw = true;
              }
              audio_clips.push(clip);
            }
          }
          if (audio_clips.length) Audio.destroy_sources(audio_clips);
          if (delayed_draw) Players.draw_delayed(); // is this needed??
        }
      }
    }
    this.__needed_urls = needed_urls;
  };
  pt.redo = function(removed_count){
    if (this.__action_index < (this.__action_stack.length - 1)) {
      this.__action_index ++;
      // console.log('redoing', this.__action_stack[this.__action_index]);
      this.__action_stack[this.__action_index].redo();
      this.did(removed_count);
      // console.log('redo __changed_mash_or_time');
      this.__changed_mash_or_time();
    }
  };
  pt.redraw = function() {
    if (this.__drawing.context) {
      var url_types, audio_on, clips, audio_buffered, video_buffered;
      audio_on = this.__audio_is_on();
      clips = Mash.range_clips(this.__mash, this.__time, audio_on); // includes clips on audio tracks if audio_on
      url_types = Mash.urls_for_clips_by_type(this.__mash, clips, this.__time);
      video_buffered = Loader.loaded_urls_of_type(Mash.urls_of_type(url_types, Constant.video));
      audio_buffered = (audio_on ? Loader.loaded_urls_of_type(Mash.urls_of_type(url_types, Constant.audio)) : true);
      // console.log('redraw', video_buffered, audio_buffered, this.__moving);
      if ((video_buffered && audio_buffered) !== this.__moving){
        if (this.__moving) {
          // console.log('not buffered but moving', video_buffered, audio_buffered);
          this.__set_moving(false);
        } else if ( (! this.__paused) && Mash.loaded_range(this.__mash, this.__time_drawn.copyTime(this.__buffertime.frame), audio_on)) {
          // console.log('all buffered but not moving');
          this.__set_moving(true);
        }
      }
      if (video_buffered) {
        this.__time_drawn = this.__time.copyTime();
        this.__draw_request(clips);
      }
      else if (this.__paused) this.rebuffer(); // to reset the buffering
    }
  };
  pt.remove = function(ob_or_array, type, track_index){
    if (! Util.isnt(ob_or_array, type)) {
      if (! Util.isarray(ob_or_array)) ob_or_array = [ob_or_array];
      if (Util.isob.apply(Util, ob_or_array)) {
        if (! track_index) track_index = 0;
        var action, objects;
        if (Constant.effect === type) {
          action = this.__action_effects_remove(ob_or_array, this.selectedClipOrMash.effects);
          action.redo_selected_effects = [];
        } else {
          if ((Constant.audio === type) || track_index) {
            action = this.__action_clips_remove(type, track_index, ob_or_array);
          } else {
            action = this.__action_video_remove(track_index, ob_or_array);
          }
          // console.log('remove setting redo_selected_clips empty');
          action.redo_selected_clips = [];
        }
        if (action) {
          objects = Mash.media_for_clips(this.__mash, ob_or_array);
          action.undo_add_objects = objects;
          action.redo_delete_objects = objects;
          this.__action_add(action);
        }
      }
    }
  };
  pt.remove_media = function(array){
    var id, ob, i, z;
    if (! Util.isarray(array)) array = [array];
    z = array.length;
    for (i = 0; i < z; i++){
      ob = array[i];
      id = (Util.isob(ob) ? ob.id : ob);
      if (! this.__media_references[id]) console.warn('remove_media unreferenced media', id);
      else this.__media_references[id]--;
      if (! this.__media_references[id]) {
        if (-1 === Util.array_delete_ref(this.__mash.media, ob)) {
          console.error("remove_media no mash media", id, this.__mash.media);
        }
        delete this.__media_references[id];
      }
      // console.log('remove_media', this.__media_references[id], id);
    }
  }; // called by Action
  pt.select = function(clip_or_effect, toggle_selected){
    // console.log('select', clip_or_effect, toggle_selected);
    var media, i, array = [], array_key = '__selected_clips', prop_key = 'selectedClips';
    media = Mash.media(this.__mash, clip_or_effect);
    if (media){
      if (Constant.effect === media.type){
        array_key = '__selected_effects';
        prop_key = 'selectedEffects';
      }
      if (toggle_selected) {
        i = this[array_key].indexOf(clip_or_effect);
        switch(this[array_key].length){
          case 0: {
            array.push(clip_or_effect);
            break;
          }
          case 1: {
            if (i > -1) break;
          } // potential intentional fall through to default
          default: {
            if (i < 0) {
              array.push(clip_or_effect);
              array = array.concat(this[array_key]);
            } else {
              if (i) array = array.concat(this[array_key].slice(0, i));
              if (i < (this[array_key].length - 1)) array = array.concat(this[array_key].slice(i + 1));
            }
          }

        }
      }
      else {
        if (-1 < this[array_key].indexOf(clip_or_effect)) return;
        array.push(clip_or_effect);
      }
    }
    // console.log('select', prop_key, array);
    this[prop_key] = array;
  };
  pt.selected = function(clip_or_effect){
    return (-2 < (this.__selected_effects.indexOf(clip_or_effect) + this.__selected_clips.indexOf(clip_or_effect)));
  };
  pt.selectEffect = function(effect, toggle_selected){
    if (Util.isob(effect)) return this.select(effect, toggle_selected);
    else if (! toggle_selected) this.selectedEffect = effect;
  };
  pt.split = function(){
    var clip = this.selectedClip;
    var at_time = this.__time.copyTime();
    if (Util.isob(clip) && this.__canSplitAtTime(clip, at_time)) {
      var action = this.__action_split_clip(clip, at_time);
      this.__action_add(action);
    }
  };
  pt.freeze = function() {
    var clip = this.selectedClip;
    var at_time = this.__time.copyTime();
    if (Util.isob(clip) && this.__canSplitAtTime(clip, at_time)) {
      var action = this.__action_freeze_clip(clip, at_time);
      this.__action_add(action);
    }
  };
  pt.undo = function() {
    if (this.__action_index > -1) {
      this.__action_stack[this.__action_index].undo();
      this.__action_index --;
      this.did();
      // console.log('undo __changed_mash_or_time');
      this.__changed_mash_or_time();
    }
  };
  pt.uuid = function() {
    return Util.uuid(); // so new mash IDs can be generated before mash itself
  };
  pt.__action_add = function(action){
    var i, z, removed;
    if (this.__action_index < this.__action_stack.length - 1) {
      removed = this.__action_stack.splice(this.__action_index + 1, this.__action_stack.length - (this.__action_index + 1));
      z = removed.length;
      for (i = 0; i < z; i++){
        removed[i].destroy();
      }
    }
    this.__action_stack.push(action);
    // console.log('__action_add redoing', z);
    this.redo(z);
  };
  pt.__action_clips_move = function(type, track_index, frame, clips){
    clips.sort(Util.sort_by_frame); // so they are all a block
    var action, orig, orig_track, track, clip, i, z = clips.length;
    track = this.__mash[type][track_index];
    orig_track = track;
    clip = clips[0];
    if (-1 === track.clips.indexOf(clip)) { // move from different track
      orig_track = Mash.track_for_clip(this.__mash, clip);
      if (Util.isnt(orig_track)) {
        console.error('clip not found in tracks', clip);
        return false;
      }
    }
    orig = [];
    for (i = 0; i < z; i++) {
      clip = clips[i];
      orig.push({
        clip: clip, offset: (i ? clip.frame - clips[0].frame : 0),
        frame: clip.frame, track: clip.track, i: i, index: orig_track.clips.indexOf(clip)
      });
    }
    // console.log('__action_clips_move creating action');
    action = new Action(this, function(){
      if (track !== orig_track) { // take them out
        orig.sort(function(a, b){return b.index-a.index;});
        for (i = 0; i < z; i++) orig_track.clips.splice(orig[i].index, 1);
      }
      orig.sort(function(a, b){return a.i - b.i;});
      if (track !== orig_track) track.clips = track.clips.concat(clips);
      for (i = z - 1; i > -1; i--) {
        clip = clips[i];
        clip.track = track_index;
        clip.frame = frame + orig[i].offset;
      }
      if (track !== orig_track) Mash.recalc_track(this.player.mash, orig_track);
      Mash.recalc_track(this.player.mash, track);
      this.player.mash_length_changed();
    }, function(){
      orig.sort(function(a, b){return a.index-b.index;});
      if (track !== orig_track) { // we added to track, so remove
        for (i = 0; i < z; i++) Util.array_delete(track.clips, clips[i]);
      }
      for (i = 0; i < z; i++) {
        clip = orig[i].clip; //clips[orig[i].i];
        clip.frame = orig[i].frame;
        if (track !== orig_track) {
          orig_track.clips.splice(orig[i].index, 0, clip);
          clip.track = orig[i].track;
        }
      }
      if (track !== orig_track) Mash.recalc_track(this.player.mash, orig_track);
      Mash.recalc_track(this.player.mash, track);
      this.player.mash_length_changed();
    });
    return action;
  };
  pt.__action_effects_move = function(index, effects, container){
    var action, i, z = effects.length, indexed_effects = [];
      // console.log('__action_effects_move creating action');

    action = new Action(this, function(){
      indexed_effects.sort(function(a, b){ return b.i - a.i; });
      for (i = 0; i < z; i++) container.splice(indexed_effects[i].i, 1);
      for (i = z - 1; i > -1; i--) container.splice(index, 0, effects[i]);
    }, function(){
      indexed_effects.sort(function(a, b){ return a.i - b.i; });
      for (i = 0; i < z; i++) container.splice(index, 1);
      for (i = 0; i < z; i++) {
        container.splice(indexed_effects[i].i, 0, indexed_effects[i].effect);
      }
    });
    for (i = 0; i < z; i++) {
      indexed_effects.push({i: container.indexOf(effects[i]), effect: effects[i]});
    }
    return action;
  };
  pt.__action_video_move = function(track_index, index, clips){
    // console.log('__action_video_move', track_index, index, clips);
    var indexed_clips, orig_track, target_track, clip, i, z = clips.length;
    target_track = this.__mash.video[track_index];
    orig_track = target_track;
    clip = clips[0];
    if (-1 === target_track.clips.indexOf(clip)) { // move from different video track
      orig_track = Mash.track_for_clip(this.__mash, clip);
      if (! orig_track) return console.error('no track for first clip'); // problem, clip not found in any tracks
    }
    indexed_clips = [];
    for (i = 0; i < z; i++) {
      clip = clips[i];
      indexed_clips.push({clip: clip, frame: clip.frame, track: clip.track, i: i, index: orig_track.clips.indexOf(clip)});
    }
      // console.log('__action_video_move creating action');

    return new Action(this, function(){
      // console.log('REDO __action_video_move');
      indexed_clips.sort(function(a, b){return b.index-a.index;});
      for (i = 0; i < z; i++) orig_track.clips.splice(indexed_clips[i].index, 1);
      indexed_clips.sort(function(a, b){return a.i-b.i;});
      for (i = z - 1; i > -1; i--) {
        clip = clips[i];
        target_track.clips.splice(index, 0, clip);
        clip.track = track_index;
      }
      if (target_track !== orig_track) Mash.recalc_track(this.player.mash, orig_track);
      Mash.recalc_track(this.player.mash, target_track);
      this.player.mash_length_changed();
    }, function(){
      // console.log('UNDO __action_video_move');
      indexed_clips.sort(function(a, b){return a.index-b.index;});
      target_track.clips.splice(index, z);
      for (i = 0; i < z; i++) {
        clip = indexed_clips[i].clip;
        orig_track.clips.splice(indexed_clips[i].index, 0, clip);
        // console.log('__action_video_move', indexed_clips[i].index, orig_track.clips.length);
        clip.track = indexed_clips[i].track;
        clip.frame = indexed_clips[i].frame;
      }
      if (target_track !== orig_track) Mash.recalc_track(this.player.mash, orig_track);
      Mash.recalc_track(this.player.mash, target_track);
      this.player.mash_length_changed();
    });
  };
  pt.__action_clips_remove = function(type, track_index, clips) {
    clips.sort(Util.sort_by_frame); // so they are all a block
    var action, orig, track, clip, i, z = clips.length;
    track = this.__mash[type][track_index];
    clip = clips[0];
    orig = [];
    for (i = 0; i < z; i++) {
      clip = clips[i];
      orig.push({offset: (i ? clip.frame - clips[0].frame : 0), frame: clip.frame, track: clip.track, i: i, index: track.clips.indexOf(clip)});
    }
    // console.log('__action_clips_remove creating action');

    action = new Action(this, function(){
      orig.sort(function(a, b){return b.index-a.index;});
      for (i = 0; i < z; i++) track.clips.splice(orig[i].index, 1);
      Mash.recalc_track(this.player.mash, track);
      this.player.mash_length_changed();
    }, function(){
      orig.sort(function(a, b){return a.index-b.index;});
      for (i = 0; i < z; i++) {
        clip = clips[orig[i].i];
        track.clips.splice(orig[i].index, 0, clip);
        clip.track = orig[i].track;
        clip.frame = orig[i].frame;
      }
      Mash.recalc_track(this.player.mash, track);
      this.player.mash_length_changed();
    });
    return action;
  };
  pt.__action_effects_remove = function(effects, container){
    // index always -1
    var action, i, z = effects.length;
        // console.log('__action_effects_remove creating action');

    action = new Action(this, function(){
      this.orig.sort(function(a, b){return b.index-a.index;});
      for (i = 0; i < z; i++) container.splice(this.orig[i].index, 1);
    }, function(){
      this.orig.sort(function(a, b){return a.index-b.index;});
      for (i = 0; i < z; i++) {
        container.splice(this.orig[i].index, 0, effects[this.orig[i].i]);
      }
    });

    action.orig = [];
    for (i = 0; i < z; i++) action.orig.push({i: i, index: container.indexOf(effects[i])});
    return action;
  };
  pt.__action_video_remove = function(track_index, clips){
    var action, orig, track, clip, i, z = clips.length;
    track = this.__mash.video[track_index];
    clip = clips[0];
    orig = [];
    for (i = 0; i < z; i++) {
      clip = clips[i];
      orig.push({frame: clip.frame, track: clip.track, i: i, index: track.clips.indexOf(clip)});
    }
      // console.log('__action_video_remove creating action');

    action = new Action(this, function(){
      orig.sort(function(a, b){return b.index-a.index;});
      for (i = 0; i < z; i++) {
        // console.log('removing', orig[i].index);
        track.clips.splice(orig[i].index, 1);
      }
      Mash.recalc_track(this.player.mash, track);
      this.player.mash_length_changed();
    }, function(){
      orig.sort(function(a, b){return a.index-b.index;});
      var container_index;
      for (i = 0; i < z; i++) {
        container_index = orig[i].index;
        clip = clips[orig[i].i];
        track.clips.splice(container_index, 0, clip);
        clip.track = orig[i].track;
        clip.frame = orig[i].frame;
      }
      Mash.recalc_track(this.player.mash, track);
      this.player.mash_length_changed();
    });
    return action;
  };
  pt.__action_effect_add = function(effect, index){
    // .add handles redo_add_objects and undo_delete_objects
    var action, effects, target = this.selectedClipOrMash;
    if (target) {
      effects = target.effects;
    // console.log('__action_effects_add creating action');
      action = new Action(this, function(){
        effects.splice(index, 0, effect);
      }, function() {
        Util.array_delete(effects, effect);
      });
    }
    return action;
  };
  pt.__action_freeze_clip = function(clip, at_time){
    console.warn('testing __action_freeze_clip');
    // THIS IS NOT YET WORKING!!
    var media = Mash.media(this.__mash, clip);
    var new_clip = Util.copy_keys_recursize(clip);
    var freeze_clip = Util.copy_keys_recursize(clip);
    var freeze_frames = 2 * this.__mash.quantize;
    at_time.scale(media.fps);
    freeze_clip.freeze = at_time.frame;
    freeze_clip.frames = freeze_frames;
    at_time.scale(this.__mash.quantize);
    var trim_frames = clip.frames - (at_time.frame - clip.frame);
    var track_clips = Mash.track_for_clip(this.__mash, clip).clips;
    var index = 1 + track_clips.indexOf(clip);
    new_clip.frames = trim_frames;
    new_clip.frame = clip.frame + freeze_frames + (clip.frames - trim_frames);
    new_clip.trim = clip.trim + trim_frames;
    // console.log('__action_freeze_clip creating action');
    var action = new Action(this, function(){
      track_clips.splice(index, 0, new_clip);
      track_clips.splice(index, 0, freeze_clip);
      clip.frames -= trim_frames;
      Mash.recalc_video_clips(this.player.mash, this.target);
    }, function() {
      clip.frames += trim_frames;
      track_clips.splice(index, 2);
      Mash.recalc_video_clips(this.player.mash, this.target);
    });
    action.redo_selected_clips = [clip];
    action.target = track_clips;
    return action;
  };
  pt.__action_split_clip = function(orig_clip, at_time){
    at_time.scale(this.__mash.quantize);
    var undo_frames = orig_clip.frames;

    var media = Mash.media(this.__mash, orig_clip);
    var track_clips = Mash.track_for_clip(this.__mash, orig_clip).clips;
    var index = 1 + track_clips.indexOf(orig_clip);
    var new_clip = Util.copy_keys_recursize(orig_clip);
    var orig_frame = orig_clip.frame;
    var new_frame = at_time.frame;
    var orig_frames = new_frame - orig_frame;
    var new_frames = undo_frames - orig_frames;
    new_clip.frames = new_frames;
    new_clip.frame = new_frame;
    switch(media.type){
      case Constant.audio:
      case Constant.video: new_clip.trim += orig_frames;
    }
    // console.log('__action_split_clip creating action');
    var action = new Action(this, function(){
      track_clips.splice(index, 0, new_clip);
      orig_clip.frames = orig_frames;
    }, function() {
      orig_clip.frames = undo_frames;
      track_clips.splice(index, 1);
    });
    action.redo_selected_clips = [new_clip];
    action.undo_selected_clips = [orig_clip];
    var objects = Mash.media_for_clips(this.__mash, new_clip, media);
    action.redo_add_objects = objects;
    action.undo_delete_objects = objects;
    return action;
  };
  pt.__action_track_add = function(media_type, clip, index, frame){

    // console.log('__action_track_add creating action');
    var action = new Action(this, function(){
      var target;
      for (var i = 0; i < this.tracks; i++){
        this.player.__track_create(this.type);
      }
      target = this.player.mash[this.type][this.index].clips;
      this.clip.frame = this.frame;
      target.push(this.clip);
      Mash.recalc_clips(target);
      this.player.mash_length_changed();
    }, function() {
      var target;
      target = this.player.mash[this.type][this.index].clips;
      Util.array_delete(target, this.clip);
      for (var i = 0; i < this.tracks; i++){
        this.player.__track_delete(this.type);
      }
      Mash.recalc_clips(target);
      this.player.mash_length_changed();
    });
    action.clip = clip;
    action.frame = frame;
    action.index = index;
    action.type = (Constant.audio === media_type ? media_type : Constant.video);
    action.tracks = (index + 1) - this.__mash[action.type].length;
    return action;
  };
  pt.__action_video_add = function(clip, track_index, index){
    // console.log('__action_video_add creating action');
    var action = new Action(this, function(){
      this.target.splice(this.index, 0, this.clip);
      Mash.recalc_video_clips(this.player.mash, this.target);
      this.player.mash_length_changed();
    }, function() {
      Util.array_delete(this.target, this.clip);
      Mash.recalc_video_clips(this.player.mash, this.target);
      this.player.mash_length_changed();
    });
    action.clip = clip;
    action.index = index;
    action.target = this.__mash.video[track_index].clips;
    return action;
  };
  pt.__adjust_gain = function(clips){
    // only some clips have audio
    var source, media, clip, i, z = clips.length;
    for (i = 0; i < z; i++){
      clip = clips[i];
      media = Mash.media(this.__mash, clip);
      if (Mash.clip_has_audio(clip, media)) {
        source = Audio.source_for_clip(clip);
        Audio.gain_source(source);
      }
    }
  };
  pt.__audio_is_on = function(){
    return ((! this.__paused) && (!this.__muted) && this.__gain);
  };
  pt.__canSplitAtTime = function(clip, now){
    // true if now intersects clip time, but is not start or end frame
    var clip_time = new TimeRange(clip.frame, this.__mash.quantize, clip.frames);
    var can_split = clip_time.intersection(now);
    if (can_split) {
      now = now.copyTime();
      now.scale(clip_time.fps);
      can_split = (now.frame !== clip_time.frame);
      if (can_split) can_split = (now.end !== clip_time.end);
    }
    return can_split;
  };
  pt.__delete_drawings = function(drawings){
    if (drawings) {
      var drawing = drawings.pop();
      while(drawing){
        this.__delete_drawings(drawing.drawings);
        if (drawing !== this.__drawing) Filter.destroy_drawing(drawing);
        drawing = drawings.pop();
      }
    }
  };
  pt.__draw_context = function(drawing_context) {
    if (! drawing_context) drawing_context = this.__drawing.context;
    if (drawing_context) {
      drawing_context.clearRect(0, 0, drawing_context.canvas.width, drawing_context.canvas.height);
      drawing_context.fillStyle = this.__mash.backcolor;
      drawing_context.fillRect(0, 0, drawing_context.canvas.width, drawing_context.canvas.height);
    }
  };
  pt.__draw_layer_clip = function(time, clip, media, drawing){
    var url, copy_time, resource, raw_drawing, quantize = this.__mash.quantize;
    var swidth,sheight;
    var __label = function(w, h, media){
      return w + 'x' + h + ' ' + media.type + ' clip ' + (media.label || media.id);
    };
    switch(media.type){
      case Constant.image: {
        url = (media.url || media.source);
        resource = Loader.cached_urls[url];
        if (resource) {
          swidth = resource.width;
          sheight = resource.height;
          raw_drawing = Filter.create_drawing(swidth, sheight, __label(swidth, sheight, media), drawing.container);
          raw_drawing.context.drawImage(resource,0,0,swidth,sheight,0,0,swidth,sheight);
        } //else console.error('attempt to draw unloaded' + media.type, url);
        break;
      }
      case 'frame':
      case Constant.video: {
        copy_time = time.copyTime();
        copy_time.scale(media.fps);
        copy_time.frames = 1;
        for (url in Mash.urls_for_video_clip(clip, media, copy_time, quantize)){
          resource = Loader.cached_urls[url];
          if (resource) {
            swidth = resource.width;
            sheight = resource.height;
            raw_drawing = Filter.create_drawing(swidth, sheight, __label(swidth, sheight, media), drawing.container);
            raw_drawing.context.drawImage(resource,0,0,swidth,sheight,0,0,swidth,sheight);
          } //else console.error('attempt to draw unloaded' + media.type, url);
          break;
        }
        break;
      }
      case Constant.theme: {
        raw_drawing = this.__draw_module_filters(time, clip, [drawing], clip, media).shift();
        break;
      }
      default: console.error(media.type + ' unsupported on video track');
    }
    if (raw_drawing) {//console.error('no raw drawing', clip, time); else
      drawing.drawings.push(raw_drawing);
      drawing = this.__draw_scale_and_effects(time, clip, raw_drawing);
    }
    return drawing;
  };
  pt.__draw_layer_clips = function(clips, time){
    // console.log('__draw_layer_clips', clips.length, time.description);
    this.__delete_drawings(this.__drawing.drawings);
    var back_drawing, drawing, transition_indexes, transition_index, medias, clip, media, w, h, y, i, z = clips.length;
    //transition_drawings = [],
    medias = {};
    transition_index = -1;
    transition_indexes = [];
    for (i = 0; i < z; i++) {
      clip = clips[i];
      media = Mash.media(this.__mash, clip);
      medias[media.id] = media;
      if (Constant.audio === media.type) continue;
      if (0 === clip.track) {
        if (Constant.transition === media.type) transition_index = i;
        else transition_indexes.push(i);
      }
    }
    this.__draw_context(); // fill __drawing.context with background
    if (-1 < transition_index) {
      y = transition_indexes.length;
      if (0 < y) { // ignore if no clips to transition between
        w = this.__drawing.canvas.width;
        h = this.__drawing.canvas.height;
        for (i = 0; i < y; i++) {
          clip = clips[transition_indexes[i]];
          media = medias[clip.id];
          // each clip being transitioned gets it's own drawing, which it affects
          back_drawing = Filter.create_drawing(w, h, w + 'x' + h + ' background for ' + media.type + ' clip ' + (media.label || media.id), this.__drawing.container);
          this.__drawing.drawings.push(back_drawing);
          this.__draw_context(back_drawing.context);
          drawing = this.__draw_layer_clip(time, clip, media, back_drawing);
          this.__drawings_merge(time, clip, clip.merger, back_drawing, drawing);

          //transition_drawings.push(drawing);
        }
        clip = clips[transition_index];
        // this only affects this.__drawing.context, using the other drawing(s)
        this.__draw_transition(this.__drawing.drawings, clip, medias[clip.id], time);
      }
      transition_indexes.push(transition_index); // so caught below
    } else transition_indexes = [];
    for (i = 0; i < z; i++){
      if (-1 < transition_indexes.indexOf(i)) continue;
      clip = clips[i];
      media = medias[clip.id];
      if (Constant.audio === media.type) continue;
      // clips not being transitioned just affect main drawing
      drawing = this.__draw_layer_clip(time, clip, media, this.__drawing);
      this.__drawings_merge(time, clip, clip.merger, this.__drawing, drawing);
    }
  };
  pt.__draw_transition = function(clip_drawings, transition_clip, transition_media, time){
    // console.log('__draw_transition', clip_drawings, transition_clip, transition_media);
    if (2 > clip_drawings.length) clip_drawings.push(this.__drawing); // make another reference to the background
    var from_drawing = clip_drawings[0];
    var to_drawing = clip_drawings[1];
    if (transition_media.to.filters) {
      // console.log('to filters', to_drawing, transition_media.to);
      to_drawing = this.__draw_module_filters(time, transition_clip, [to_drawing], transition_clip, transition_media.to).shift();
    }
    if (transition_media.from.filters) from_drawing = this.__draw_module_filters(time, transition_clip, [from_drawing], transition_clip, transition_media.from).shift();
    this.__drawings_merge(time, transition_clip, transition_media.from.merger, from_drawing, to_drawing);
    this.__drawings_merge(time, transition_clip, transition_media.to.merger, this.__drawing, from_drawing);
  };
  pt.__draw_request = function(clips){
    var $this = this;
    requestAnimationFrame(function(){
      $this.__draw_layer_clips(clips, $this.__time_drawn);
    });
  };
  pt.__drawings_merge = function(time, layer_clip, merger, btm_drawing, top_drawing) {
    var merger_media;
    if (merger) {
      merger_media = Mash.media_search(Constant.merger, merger, this.__mash);
      if (! merger_media) console.error('no merger media', merger);
      else {
        btm_drawing = this.__draw_module_filters(time, layer_clip, [btm_drawing, top_drawing], merger, merger_media).shift();
      }
    } else console.error('false merger', layer_clip);
  };
  pt.__draw_scale_and_effects = function(time, layer_clip, raw_drawing) {
    var scaler_media, scaler;
    scaler = layer_clip.scaler;
    if (scaler) {
      scaler_media = Mash.media_search(Constant.scaler, scaler, this.__mash);
      if (! scaler_media) console.error('no scaler media', scaler);
      else raw_drawing = this.__draw_module_filters(time, layer_clip, [raw_drawing], scaler, scaler_media).shift();
      if (! raw_drawing) console.error('scaler produced no drawing', scaler, layer_clip);
    }else console.error('no scaler found', layer_clip);

    if (Util.isarray(layer_clip.effects) && layer_clip.effects.length) {
      raw_drawing = this.__draw_effects([raw_drawing], layer_clip, time).shift();
    }
    return raw_drawing;
  };
  pt.__draw_module_filters = function(time, layer_clip, drawings, module, module_media) {
    var __evaluate_scope = function(time, clip, scope, module, filter_config){
      var eval_key, eval_str, filter, conditional_in, condition, test_bool, parameter, conditional, parameter_name, parameter_value, parameters_array, j, y, i, z, evaluated = {};
      filter = Filter.load(filter_config.id);
      if (filter) {
        scope = Util.copy_ob(scope);
        parameters_array = filter_config.parameters;
        if (! parameters_array) parameters_array = filter.parameters;
        if (parameters_array) {
          z = parameters_array.length;
          for (i = 0; i < z; i++){
            parameter = parameters_array[i];
            parameter_name = parameter.name;
            if (parameter_name){
              parameter_value = parameter.value;
              if (Util.isarray(parameter_value)){
                test_bool = false;
                y = parameter_value.length;
                for (j = 0; j < y; j++){
                  conditional = parameter_value[j];
                  condition = conditional.condition;
                  // not strict equality, since we may have strings and numbers
                  if (conditional.is) condition = condition + '==' + conditional.is;
                  else if (conditional.in) {
                    conditional_in = conditional.in;
                    if (Util.isstring(conditional_in)) conditional_in = conditional_in.split(',');

                    condition = '(-1 < [' + conditional_in.join(',') + '].indexOf(' + (Util.isstring(conditional_in[0]) ? 'String' : 'Number') + '(' + condition + ')))';
                  }
                  condition = condition.replace(' or ', ' || ');
                  condition = condition.replace(' and ', ' && ');
                  for (eval_key in scope) {
                    condition = condition.replace(new RegExp('\\b' + eval_key + '\\b', 'g'), 'scope.' + eval_key);
                  }
                  eval_str = 'test_bool = (' + condition + ');';
                  try {
                    eval(eval_str);
                  } catch (exception) {
                    console.error(exception.message, eval_str);
                  }
                  if (test_bool) {
                    parameter_value = conditional.value;
                    // console.log(parameter_name, eval_str, parameter_value);
                    break;
                  } // else console.warn(parameter_name, eval_str, parameter_value);
                }
                if (! test_bool) console.error('no conditions were true', parameter_value);
              }
              if (Util.isstring(parameter_value)) { // could well be a number by now
                for (eval_key in scope) {
                  parameter_value = parameter_value.replace(new RegExp('\\b' + eval_key + '\\b', 'g'), 'scope.' + eval_key);
                }
              }
              eval_str = 'evaluated.' + parameter_name + ' = ' + parameter_value + ';';
              try {
                eval(eval_str);
              } catch (exception) {
                //console.error(exception.message, eval_str, parameter_value);
                evaluated[parameter_name] = parameter_value;
              }
              // sort of like lookahead, but they have to be in order!
              scope[parameter_name] = evaluated[parameter_name];
            }
          }
        } else console.error('no parameters_array found', filter_config);
      } else console.error('filter not found', filter_config.id);
      return evaluated;
    };
    var ctime, scope, evaluated, filter_config, filter, i, z;
    if (module_media) {
      if (module_media.filters) {
        if (layer_clip.frames) {
          ctime = new TimeRange(0, this.__mash.quantize, this.__mash_length);
          ctime.frame = layer_clip.frame;
          ctime.frames = layer_clip.frames;
          z = module_media.filters.length;
          for (i = 0; i < z; i++){
            filter_config = module_media.filters[i];
            filter = Filter.load(filter_config.id);
            if (filter) { // otherwise, just ignore unknown filters

              scope = this.__module_scope(time, ctime, drawings, module, module_media);
              if (filter.parse) scope = filter.parse(drawings, scope, filter_config);
              evaluated = __evaluate_scope(time, layer_clip, scope, module, filter_config);
              if (filter.render) drawings = filter.render(drawings, scope, evaluated, filter_config);
            }
          }
        } else console.error('invalid layer clip with no frames', layer_clip);
      } else console.error('invalid module media with no filters', module, module_media);
    } else console.error('false media while drawing module filters', module, layer_clip);
    return drawings;
  };
  pt.__draw_effects = function(drawings, layer_clip, time) {
    var effect, effect_media, i, z;
    if (layer_clip) {
      if (layer_clip.frames){
        if (layer_clip.effects) {
          z = layer_clip.effects.length;
          for (i = z - 1; i > -1; i--){ // zero is 'top', so go backwards
            effect = layer_clip.effects[i];
            effect_media = Mash.media(this.__mash, effect);
            if (effect_media) drawings = this.__draw_module_filters(time, layer_clip, drawings, effect, effect_media);
            else console.error('could not find effect media', effect, layer_clip, this.__mash.media);
          }
        }  else console.error('invalid layer clip with no effects', layer_clip);
      } else console.error('invalid layer clip with no frames, so no effects', layer_clip);
    } else console.error('false layer clip, so no effects', drawings);
    return drawings;
  };
  pt.__limit_time = function(time){
    var start_time = time.copyTime();
    var limit_time = new TimeRange(this.__mash_length, this.__mash.quantize);
    limit_time.frame = Math.max(0, limit_time.frame - 1);
    start_time.min(limit_time);
    start_time.scale(this.__fps, 'floor');
    return start_time;
  };
  pt.__load_timed = function(){
    if (this.__moving){
      // hopefully runs twice a frame
      var now = TimeRange.fromSeconds(Audio.time(), this.__fps, 'ceil');
      if (now.frame !== this.__limit_time(now).frame) {
        // loop back to start or pause
        if (! this.__loop) {
          this.paused = true;
        } else {
          this.frame = 0;
          this.paused = false;
        }
      } else {
        if (! now.isEqualToTime(this.__time_drawn)) {
          this.__time.setToTime(now);
          this.redraw();
        }
      }
    }
  };
  pt.__module_scope = function(time, clip_time, drawings, module, media){
    // if (time.fps !== this.__fps) console.warn('__module_scope FPS', time.fps, this.__fps);
    if (! this.__drawing.canvas) return {};
    var clip_value, module_properties, type_ob, type_id, property_key, property_options, drawing;
    module_properties = {};
    if (media.properties) {
      for (property_key in media.properties){
        clip_value = module[property_key];
        if (Util.isnt(clip_value)){
          property_options = media.properties[property_key];
          clip_value = property_options.value;
          if (Util.isnt(clip_value)){
            type_id = property_options.type;
            if (type_id){
              type_ob = Constant.property_types[type_id];
              if (type_ob) clip_value = type_ob.value;
            }
            if (Util.isnt(clip_value)) clip_value = '';
          }
        } else clip_value = module[property_key];
        module_properties[property_key] = clip_value;
      }
    }
    var __horz_vert = function(w_h, size, proud){
      var value = parseFloat(size);
      var w_h_value = parseFloat(module_properties[w_h]);
      var w_h_value_scaled = w_h_value * value;
      if (proud) {
        var h_w = ('mm_height' === w_h ? 'mm_width' : 'mm_height');
        var h_w_value = parseFloat(module_properties[h_w]);
        if (h_w_value > w_h_value) {
          w_h_value_scaled = w_h_value + (value - 1.0) * h_w_value;
        }
      }
      return (w_h_value_scaled);
    };
    module_properties.mm_vert = function(size, proud){
      return __horz_vert('mm_height', size, proud);
    };
    module_properties.mm_horz = function(size, proud){
      return __horz_vert('mm_width', size, proud);
    };
    module_properties.mm_cmp = function(a, b, a_val, b_val){
      return ((a > b) ? a_val : b_val);
    };
    module_properties.mm_max = Math.max;
    module_properties.mm_min = Math.min;
    module_properties.floor = Math.floor;
    module_properties.ceil = Math.ceil;
    module_properties.mm_fps = this.__fps;

    if (clip_time) module_properties.t = module_properties.mm_duration = clip_time.lengthSeconds;

    clip_time.scale(time.fps);
    module_properties.mm_t = (time.frame - clip_time.frame) / clip_time.frames;
    module_properties.mm_width = this.__drawing.canvas.width;
    module_properties.mm_height = this.__drawing.canvas.height;
    drawing = drawings[drawings.length-1];
    if (drawing && drawing.canvas) {
      module_properties.mm_input_width = drawing.canvas.width;
      module_properties.mm_input_height = drawing.canvas.height;
      module_properties.mm_input_dimensions = module_properties.mm_input_width + 'x' + module_properties.mm_input_height; // input height
    } else console.warn('no drawing?', drawings);
    module_properties.mm_dimensions = module_properties.mm_width + 'x' + module_properties.mm_height; // output height
    return module_properties;
  };
  pt.__changed_mash_or_time = function(new_time){
    // console.log('__changed_mash_or_time', new_time);
    if (new_time) this.__time.setToTime(new_time);
    this.paused = true; // make sure we are not playing
    this.redraw();
  };
  pt.__set_moving = function(tf) {
    if (this.__moving !== tf) {
      // console.log('__set_moving', this.__moving, tf, this.__time_drawn.description, this.__time.description);
      // console.log('Audio.sources', Audio.sources);
      this.__moving = tf;
      if (this.__moving) {
        var $this = this;
        this.__load_timer = setInterval(function() {$this.__load_timed();}, 500 / this.__fps);
        Audio.start(this.__time.seconds); // start up the sound buffer with our current time, rather than displayed
        this.rebuffer(); // get sounds bufferring now, rather than next timer execution
      } else {
        Audio.stop();
        clearInterval(this.__load_timer);
        this.__load_timer = 0;
      }
      this.__set_stalling((! this.__moving) && (! this.__paused));
    }
  };
  pt.__set_stalling = function(tf){
    var changed = false; // whether or not __stalling changed
    if (this.__stalling !== tf) {
      // console.log('__set_stalling', tf, this.__time.description);
      this.__stalling = tf;
      changed = true;
    }
    return changed;
  };
  pt.__stop_buffer_timer = function() {
    if (this.__bufferProcessTimer) {
      // console.log('__stop_buffer_timer');
      clearInterval(this.__bufferProcessTimer);
      this.__bufferProcessTimer = 0;
    }
  };
  pt.__track_create = function(audio_or_video){
    var container = this.__mash[audio_or_video];
    container.push(Mash.init_track(audio_or_video, container.length));
  };
  pt.__track_delete = function(audio_or_video){
    var track = this.__mash[audio_or_video].pop();
    if (this.__mash_length === Mash.length_of_clips(track.clips)) this.mash_length_changed();
  };
})(Player.prototype);
MovieMasher.Player = Player;
