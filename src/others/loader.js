import Constant from "./constant"
import Players from "./players"
import Window from "./window"
import Cache from "./cache"
// import Util from "./util"
import { load } from 'opentype.js'

const requested_urls = {}

const load_audio = (url) => {
  if (needs_requesting(url)){
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
        Window.audio_context().decodeAudioData(request.response, function(buffer) {
          //console.log('audio.onload', url);
          Cache.add(url, buffer)
          delete requested_urls[url];
          Players.draw_delayed();
        }, function() { console.error('problem decoding audio', url); });
      };
      requested_urls[url] = request;
      request.send();
  }
}
const load_filter = (url) => {
  console.log("Loader.load_filter", url)
  if (url === "undefined") {
    console.error("Loader.load_filter got undefined")
  }
  if (url && needs_requesting(url)){
    requested_urls[url] = url;
    import(url).then(() => {
      console.log("Loader.load_filter callback", url)

      delete requested_urls[url];
      Cache.add(url, true)
      Players.draw_delayed();
    })
  }
}

const load_font = (url) => {
  //console.debug("Loader.load_font", url)
  if (needs_requesting(url)){
    requested_urls[url] = url;
    load(url, function (err, loaded_font) {
      if (err) console.error('could not find registered font with url', url, err);
      else {
        //console.log('loaded font', loaded_font.draw);
        Cache.add(url, loaded_font);
        delete requested_urls[url];
        Players.draw_delayed();
      }
    });
  }
}
const load_image = (url) => {
  if (needs_requesting(url)){
    requested_urls[url] = new Image();
    requested_urls[url].onload = function(){
      //console.log('image.onload', url);
      Cache.add(url, requested_urls[url])
      delete requested_urls[url];
      Players.draw_delayed();
    };
    requested_urls[url].crossOrigin = "Anonymous";
    requested_urls[url].src = url;
  }
}

const needs_requesting = url => (!(requested_urls[url] || Cache.cached(url)))

const load_urls_of_type = (types_by_url) => {
  var url, loaded = false;
  for (url in types_by_url){
    const type = types_by_url[url]
    if (needs_requesting(url)) {
      loaded = true;
      //console.log('load_urls_of_type', types_by_url[url], url);
      switch(type){
        case Constant.font: {
          load_font(url);
          break;
        }
        case Constant.image: {
          load_image(url);
          break;
        }
        case Constant.filter: {
          load_filter(url);
          break;
        }
        case Constant.audio: {
          load_audio(url);
          break;
        }
        default: {
          console.error('cannot load media of unsupported type', types_by_url[url], url);
        }
      }
    }
  }
  return loaded;
}
const loaded_urls_of_type = (types_by_url) => {
  var loaded = true;
  for (var url in types_by_url){
    const type = types_by_url[url]
    if (! Cache.cached(url)) {
      loaded = false;
      break;
    }
  }
  return loaded;
}

// set up unbuffer timer
setInterval(function(){
  var deletable = Cache.urls()
  for (var i = 0; i < Players.instances.length; i++) {
    deletable = Players.instances[i].deleteable_urls(deletable);
  }
  for (var j = 0; j < deletable.length; j++) {
    const url = deletable[j]
    Cache.remove(url)
    delete requested_urls[url];
  }
}, 2000);

const Loader = {
  load_audio, 
  load_filter,
  load_font, 
  load_image,
  load_urls_of_type, 
  loaded_urls_of_type,
  requested_urls,
}

export default Loader
