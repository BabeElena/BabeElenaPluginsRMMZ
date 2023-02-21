/*:
 * @target MZ
 * @plugindesc Plugin for add BGS sound while low health
 * @author BabeElena, Owen6936
 * 
 *
 * @param HPPercentage
 * @type number
 * @text Health Percentage
 * @desc Settings health percentage check when below
 * @default 0
 * 
 * @param BGSChosen
 * @type file
 * @dir audio/bgs/
 * @desc Choose Low Health Sound Music here
 * @default Clock
 */

////----- Declare Variable -----

var _BabeElena = _BabeElena || {};
_BabeElena.LowHealthBGS = _BabeElena.LowHealthBGS || {};
_BabeElena.LowHealthBGS.parameters = PluginManager.parameters('BabeElena_LowHealthBGS');

_BabeElena.LowHealthBGS.HPPercentage = (_BabeElena.LowHealthBGS.parameters["HPPercentage"]);
_BabeElena.LowHealthBGS.BGSChosen = (_BabeElena.LowHealthBGS.parameters["BGSChosen"]);

////////////////Script

Scene_Battle.prototype.LowHealthBGS = function() {


    if (($gameParty.members()[0].hp / $gameParty.members()[0].param(0)) * 100 <= (_BabeElena.LowHealthBGS.HPPercentage)) {
        AudioManager.playBgm({ name: AudioManager._currentBgm === null? '' : AudioManager._currentBgm.name, volume: 50, pitch: 100 });
        AudioManager.playBgs({ name: _BabeElena.LowHealthBGS.BGSChosen, volume: 100, pitch: 100 });

        if ($plugins.find(plugin => plugin.name == "FilterControllerMZ")?.status == true) {
            $gameMap.enableFilter("lowhealth", true);
        }

    } else {
        AudioManager.playBgm({ name: AudioManager._currentBgm === null? '' : AudioManager._currentBgm.name, volume: 90, pitch: 100 });
        AudioManager.fadeOutBgs(0);

        if ($plugins.find(plugin => plugin.name == "FilterControllerMZ")?.status == true) {
            $gameMap.enableFilter("lowhealth", false);
        }
    }
    setTimeout(() => {  this.LowHealthBGS(); }, 1000);
};

Scene_Battle.prototype.initialize = function() {
    Scene_Message.prototype.initialize.call(this);
    this.LowHealthBGS();
};


