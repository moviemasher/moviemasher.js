
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MovieMasherUmd = {}));
}(this, (function (exports) { 'use strict';

  exports.masher = void 0;

  const definitionsById = {
    'color': { "id": "com.moviemasher.theme.color" },
    'title': { "id": "com.moviemasher.theme.text" },
    'cable': {
      'label': 'Cable',
      'type': 'image',
      'id': 'cable',
      'url': 'cable.jpg'
    },
    'frog': {
      'label': 'Frog',
      'type': 'image',
      'id': 'frog',
      'url': 'frog.jpg'
    },
    'globe': {
      'label': 'Globe',
      'type': 'image',
      'id': 'globe',
      'url': 'globe.jpg'
    }
  };

  function populateTextarea() {
    if (!exports.masher) return;
    const textarea = document.getElementById('textarea');
    textarea.value = JSON.stringify(exports.masher.mash, null, '\t');
  }
  function addClip(id)  {
    if (!exports.masher) return;

    exports.masher.add(definitionsById[id]);
    populateTextarea();
  }

  function handleEventMasher(event) {
    if (event.detail.type === "duration") {
      let range = document.getElementById('range');
      const value = exports.masher.position;
      range.value = value;
    }
  }
  function handleLoadBody() {
    const canvas = document.getElementById('canvas');
    if (canvas && MovieMasher) {
      // register a default font, since we're allowing a module that uses fonts
      MovieMasher.MovieMasher.font.define({ id: "com.moviemasher.font.default", source: "BlackoutTwoAM.ttf" });
      canvas.addEventListener("masher", handleEventMasher);
      exports.masher = MovieMasher.MovieMasher.masher.instance({ canvas });
      exports.masher.changeMash("backcolor", "#000000FF");
      populateTextarea();
      console.log("fucking cool:)");
    }
  }

  exports.addClip = addClip;
  exports.handleLoadBody = handleLoadBody;

})));
//# sourceMappingURL=index.js.map
