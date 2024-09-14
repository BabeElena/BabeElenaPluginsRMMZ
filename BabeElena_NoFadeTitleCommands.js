Scene_Title.prototype.commandNewGame = function() {
    DataManager.setupNewGame();
    this._commandWindow.close();
    //this.fadeOutAll();
    SceneManager.goto(Scene_Map);
};
Scene_Load.prototype.onLoadSuccess = function() {
    SoundManager.playLoad();
    //this.fadeOutAll();
    this.reloadMapIfUpdated();
    SceneManager.goto(Scene_Map);
    this._loadSuccess = true;
};

Game_Player.prototype.setupForNewGame = function() {
    const mapId = $dataSystem.startMapId;
    const x = $dataSystem.startX;
    const y = $dataSystem.startY;
    this.reserveTransfer(mapId, x, y, 2, 2);
};
