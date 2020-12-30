Action = function(player, redo_func, undo_func, destroy_func){
  this.player = player;
  this._redo = redo_func;
  this._undo = undo_func;
  this._destroy = destroy_func;
  this.undo_selected_clips = this.redo_selected_clips = Util.copy_array(player.selectedClips);
  // console.log('Action initializer', this.redo_selected_clips);
  this.undo_selected_effects = this.redo_selected_effects = Util.copy_array(player.selectedEffects);
  this.redo_add_objects = [];
  this.undo_delete_objects = [];
  this.undo_add_objects = [];
  this.redo_delete_objects = [];
};
(function(pt){
  pt.redo = function(){
    this.player.add_media(this.redo_add_objects);
    this._redo();
    this.player.remove_media(this.redo_delete_objects);
    // console.log('Action.redo selectedClips =', this.redo_selected_clips);
    this.player.selectedClips = this.redo_selected_clips;
    // console.log('Action.redo selectedEffects = ', this.redo_selected_effects);
    this.player.selectedEffects = this.redo_selected_effects;
    this.player.rebuffer();
    this.player.redraw();
    // console.log('Action.redo is done');
  };
  pt.undo = function(){
    this.player.add_media(this.undo_add_objects);
    this._undo();
    this.player.remove_media(this.undo_delete_objects);
    // console.log('Action.undo', this.undo_selected_clips);
    this.player.selectedClips = this.undo_selected_clips;
    this.player.selectedEffects = this.undo_selected_effects;
    this.player.rebuffer();
    this.player.redraw();
    // console.log('Action.undo is done');
 };
  pt.destroy = function(){
    if (this._destroy) this._destroy();
    delete this._destroy;
    delete this.player;
    delete this._redo;
    delete this._undo;
    delete this.undo_selected_clips;
    delete this.redo_selected_clips;
    delete this.undo_selected_effects;
    delete this.redo_selected_effects;
    delete this.redo_add_objects;
    delete this.undo_delete_objects;
    delete this.undo_add_objects;
    delete this.redo_delete_objects;
  };

})(Action.prototype);
MovieMasher.Action = Action;
