/*:
 * @target MZ
 * @plugindesc Plugin for setup Title that based on Variables (Must installed Global Events plugins first)
 * @author BabeElena
 * 
 * 
 * @param Variable4Title
 * @type variable
 * @text Variable for Title
 * @desc Variable you need to input for Title screen output
 * @default 2
 * 
 * @command TitleID
 * @text Title ID
 * @desc Title ID for output (TitleName + _ + TitleID)
 * 
 * @arg Variable4Title
 * @text Title ID
 * @type note
 * @desc skill issue
 */

////----- Declare Variable -----

var _BabeElena = _BabeElena || {};
_BabeElena.VariablesBasedTitles = _BabeElena.VariablesBasedTitles || {};
_BabeElena.VariablesBasedTitles.parameters = PluginManager.parameters('BabeElena_VariablesBasedTitles');

_BabeElena.VariablesBasedTitles.Variable4Title = (_BabeElena.VariablesBasedTitles.parameters["Variable4Title"]);

PluginManager.registerCommand('BabeElena_VariablesBasedTitles', "TitleID", args => {
	$gameVariables.setValue(_BabeElena.VariablesBasedTitles.Variable4Title, args.Variable4Title);
});

////////////////Scene_Title based on Variables

Scene_Title.prototype.createBackground = function() {
    this._backSprite1 = new Sprite(
        ImageManager.loadTitle1($dataSystem.title1Name + "_" + $gameVariables.value(_BabeElena.VariablesBasedTitles.Variable4Title))
    );
    this._backSprite2 = new Sprite(
        ImageManager.loadTitle2($dataSystem.title2Name)
    );
    this.addChild(this._backSprite1);
    this.addChild(this._backSprite2);
};