

const Window = {
    ctx: false,
    audio_context: function(){
        if (! Window.ctx) {
          if (window.AudioContext) Window.ctx = new window.AudioContext();
          else if (window.webkitAudioContext) Window.ctx = new window.webkitAudioContext();
        }
        return Window.ctx;
    },
}
export default Window