let masher;

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
  if (!masher) return;
  const textarea = document.getElementById('textarea');
  textarea.value = JSON.stringify(masher.mash, null, '\t');
}
function addClip(id)  {
  if (!masher) return;

  masher.add(definitionsById[id]);
  populateTextarea();
}

function handleEventMasher(event) {
  if (event.detail.type === "duration") {
    let range = document.getElementById('range');
    const value = masher.position;
    range.value = value;
  }
}
function handleLoadBody() {
  const canvas = document.getElementById('canvas');
  if (canvas && MovieMasher) {
    // register a default font, since we're allowing a module that uses fonts
    MovieMasher.MovieMasher.font.define({ id: "com.moviemasher.font.default", source: "BlackoutTwoAM.ttf" });
    canvas.addEventListener("masher", handleEventMasher);
    masher = MovieMasher.MovieMasher.masher.instance({ canvas });
    masher.changeMash("backcolor", "#000000FF");
    populateTextarea();
    console.log("fucking cool:)")
  }
}

export { handleLoadBody, addClip, masher }
