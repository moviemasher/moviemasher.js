Players = {
  draw_delayed: function(){
    // called when assets are cached
    if (! Players.delayed_timer) {
      Players.delayed_timer = setTimeout(function(){
        Players.delayed_timer = 0;
        var i, z = Players.instances.length;
        for (i = 0; i < z; i++){
          Players.instances[i].redraw();
        }
      }, 50);
    }
  },
  start_playing: function(instance){
    Players.stop_playing();
    Players.current = instance;
    Audio.create_buffer_source();
  },
  stop_playing: function(){
    if (Players.current) {
      Players.current.paused = true;
      Players.current = null;
      Audio.stop();
      Audio.destroy_buffer_source();
    }
  },
  instances: [],
  current: null,
  delayed_timer: 0,
};
MovieMasher.Players = Players;
