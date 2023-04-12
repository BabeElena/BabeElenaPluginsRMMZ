//=============================================================================
// Fullscreen Settings Plugin
// by BabeElena, Glory Forever PCL
// Date: April 11, 2023
// Version: 1.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc A plugin that adds a Fullscreen Settings option in the Options menu.
 * @author Glory Forever
 *
 * @help Fullscreen Settings Plugin
 *
 * This plugin allows the player to toggle fullscreen mode on/off in the Options menu.
 *
 * To use this plugin, simply add it to your plugin list and enable it.
 *
 * @param Fullscreen Text
 * @text Fullscreen Text
 * @desc The text to display for the Fullscreen option in the Options menu.
 * @type text
 * @default Fullscreen
 *
 * @param Window Mode Text
 * @text Window Mode Text
 * @desc The text to display for the Window mode option in the Options menu.
 * @type text
 * @default Window
 *
 * @param Fullscreen Mode Text
 * @text Fullscreen Mode Text
 * @desc The text to display for the Fullscreen mode option in the Options menu.
 * @type text
 * @default Fullscreen
 *
 * @param Default Fullscreen
 * @text Default Fullscreen
 * @desc Whether to enable Fullscreen mode by default.
 * @type boolean
 * @default false
 *
 * @param Default Window
 * @text Default Window
 * @desc Whether to enable Window mode by default.
 * @type boolean
 * @default true
 */

(function() {
  var parameters = PluginManager.parameters('GF_Fullscreen_Settings');
  var fullscreenText = parameters['Fullscreen Text'] || 'Fullscreen';
  var windowModeText = parameters['Window Mode Text'] || 'Window';
  var fullscreenModeText = parameters['Fullscreen Mode Text'] || 'Fullscreen';
  var defaultFullscreen = parameters['Default Fullscreen'] === 'true' ? true : false;
  var defaultWindow = parameters['Default Window'] === 'true' ? true : false;

  //=============================================================================
  // Window_Options
  //=============================================================================

  var GF_Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
  Window_Options.prototype.makeCommandList = function() {
    GF_Window_Options_makeCommandList.call(this);
    this.addCommand(fullscreenText, 'fullscreen');
  };

  var GF_Window_Options_statusText = Window_Options.prototype.statusText;
  Window_Options.prototype.statusText = function(index) {
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    if (symbol === 'fullscreen') {
      return value ? fullscreenModeText : windowModeText;
    } else {
      return GF_Window_Options_statusText.call(this, index);
    }
  };

  var GF_Window_Options_processOk = Window_Options.prototype.processOk;
  Window_Options.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol === 'fullscreen') {
      var value = this.getConfigValue(symbol);
      this.changeValue(symbol, !value);
    } else {
      GF_Window_Options_processOk.call(this);
    }
  };

  //=============================================================================
  // ConfigManager
  //=============================================================================

  ConfigManager.fullscreen = defaultFullscreen;

  var GF_ConfigManager_makeData = ConfigManager.makeData;
  ConfigManager.makeData = function() {
    var config = GF_ConfigManager_makeData.call(this);
    config.fullscreen = this.fullscreen;
    return config;
  };

  var GF_ConfigManager_applyData = ConfigManager.applyData;
  ConfigManager.applyData = function(config) {
    GF_ConfigManager_applyData.call(this, config);
    this.fullscreen = this.readFlag(config, 'fullscreen');
  };

  //=============================================================================
  // SceneManager
  //=============================================================================

  var GF_SceneManager_initialize = SceneManager.initialize;
  SceneManager.initialize = function() {
    GF_SceneManager_initialize.call(this);
    Graphics.fullscreen = ConfigManager.fullscreen;
  };
})();
