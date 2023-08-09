/*:
 * @target MZ
 * @plugindesc Plugin for move SV sprites to front looks
 * @author BabeElena
 * 
 */


Sprite_Actor.prototype.setActorHome = function(index) {
    this.setHome(100 + index * 204, 444 + index);
};

Sprite_Actor.prototype.stepForward = function() {
    this.startMove(0, 0, 12);
};

Sprite_Actor.prototype.stepBack = function() {
    this.startMove(0, 0, 12);
};

Sprite_Actor.prototype.moveToStartPosition = function() {
    this.startMove(0, 0, 0);
};