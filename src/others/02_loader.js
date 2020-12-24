/*global opentype:true*/
/*global $script:true*/
var Loader = {
  load_audio: function(url){
    if (! (Loader.requested_urls[url] || Loader.cached_urls[url])){
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
          Audio.get_ctx().decodeAudioData(request.response, function(buffer) {
            //console.log('audio.onload', url);
            Loader.cached_urls[url] = buffer;
            delete Loader.requested_urls[url];
            Players.draw_delayed();
          }, function() { console.error('problem decoding audio', url); });
        };
        Loader.requested_urls[url] = request;
        request.send();
    }
  },
  load_filter: function(url){
    if (! (Loader.requested_urls[url] || Loader.cached_urls[url])){
      Loader.requested_urls[url] = url;
      $script(url, function() {
        delete Loader.requested_urls[url];
        Loader.cached_urls[url] = true;
        Players.draw_delayed();
    });
    }
  },
  load_font: function(url){
    if (! (Loader.requested_urls[url] || Loader.cached_urls[url])){
      Loader.requested_urls[url] = url;
      opentype.load(url, function (err, loaded_font) {
        if (err) console.error('could not find registered font with url', url, err);
        else {
          //console.log('loaded font', loaded_font.draw);
          Loader.cached_urls[url] = loaded_font;
          delete Loader.requested_urls[url];
          Players.draw_delayed();
        }
      });
    }
  },
  load_image: function(url){
    if (! (Loader.requested_urls[url] || Loader.cached_urls[url])){
      Loader.requested_urls[url] = new Image();
      Loader.requested_urls[url].onload = function(){
        //console.log('image.onload', url);
        Loader.cached_urls[url] = Loader.requested_urls[url];
        delete Loader.requested_urls[url];
        Players.draw_delayed();
      };
      Loader.requested_urls[url].crossOrigin = "Anonymous";
      Loader.requested_urls[url].src = url;
    }
  },
  load_urls_of_type: function(urls){
    var url, loaded = false;
    for (url in urls){
      if (! (Loader.cached_urls[url] || Loader.requested_urls[url])) {
        loaded = true;
        //console.log('Loader.load_urls_of_type', urls[url], url);
        switch(urls[url]){
          case Constant.font: {
            Loader.load_font(url);
            break;
          }
          case Constant.image: {
            Loader.load_image(url);
            break;
          }
          case Constant.filter: {
            Loader.load_filter(url);
            break;
          }
          case Constant.audio: {
            Loader.load_audio(url);
            break;
          }
          default: {
            console.error('cannot load media of unsupported type', urls[url], url);
          }
        }
      }
    }
    return loaded;
  },
  loaded_urls_of_type: function(urls){
    var url, loaded = true;
    for (url in urls){
      if (! Loader.cached_urls[url]) {
        loaded = false;
        break;
      }
    }
    return loaded;
  },
  cached_urls: {},
  requested_urls: {},
};
// set up unbuffer timer
setInterval(function(){
  var url, i, z = Players.instances.length, deletable = Loader.cached_urls;
  for (i = 0; i < z; i++) {
    deletable = Players.instances[i].deleteable_urls(deletable);
  }
  for (url in deletable) {
    delete Loader.cached_urls[url];
    delete Loader.requested_urls[url];
  }
}, 2000);
MovieMasher.Loader = Loader;
