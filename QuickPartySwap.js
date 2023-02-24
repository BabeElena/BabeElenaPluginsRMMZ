//-----------------------------------------------------------------------------
// Scene_PartyFormation
//
// The scene class of the party formation screen.

function Scene_PartyFormation() {
    this.initialize(...arguments);
}

Scene_PartyFormation.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PartyFormation.prototype.constructor = Scene_PartyFormation;

Scene_PartyFormation.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_PartyFormation.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createMemberListWindow();
    this.createFormationWindow();
};

Scene_PartyFormation.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help(1);
    this._helpWindow.setText("Select a member to swap.");
    this.addWindow(this._helpWindow);
};

Scene_PartyFormation.prototype.createMemberListWindow = function() {
    const rect = new Rectangle(0, this._helpWindow.height, Graphics.boxWidth, Graphics.boxHeight - this._helpWindow.height);
    this._memberListWindow = new Window_PartyMemberList(rect);
    this._memberListWindow.setHandler('cancel', this.popScene.bind(this));
    this._memberListWindow.setHandler('ok', this.onMemberOk.bind(this));
    this.addWindow(this._memberListWindow);
};

Scene_PartyFormation.prototype.createFormationWindow = function() {
    const rect = new Rectangle(0, this._helpWindow.height, Graphics.boxWidth, Graphics.boxHeight - this._helpWindow.height);
    this._formationWindow = new Window_PartyFormation(rect);
    this._formationWindow.setHandler('cancel', this.onFormationCancel.bind(this));
    this._formationWindow.hide();
    this.addWindow(this._formationWindow);
};

Scene_PartyFormation.prototype.onMemberOk = function() {
    const actor = this._memberListWindow.selectedActor();
    if (actor) {
        this._helpWindow.setText("Select a formation position.");
        this._memberListWindow.deactivate();
        this._formationWindow.show();
        this._formationWindow.activate();
        this._formationWindow.select(0);
        this._formationWindow.setActor(actor);
    }
};

Scene_PartyFormation.prototype.onFormationCancel = function() {
    this._helpWindow.setText("Select a member to swap.");
    this._formationWindow.hide();
    this._formationWindow.deselect();
    this._memberListWindow.activate();
};

//-----------------------------------------------------------------------------
// Window_PartyMemberList
//
// The window class for the list of party members.

function Window_PartyMemberList() {
    this.initialize(...arguments);
}

Window_PartyMemberList.prototype = Object.create(Window_Selectable.prototype);
Window_PartyMemberList.prototype.constructor = Window_PartyMemberList;

Window_PartyMemberList.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
};

Window_PartyMemberList.prototype.maxItems = function() {
    return $gameParty.members().length;
};

Window_PartyMemberList.prototype.item = function(index) {
    return $gameParty.members()[index];
};

Window_PartyMemberList.prototype.drawItem = function(index) {
    const actor = this.item(index);
    if (actor) {
        const rect = this.itemRect(index);
        this.changePaintOpacity(actor.isBattleMember());
        this.drawText(actor.name(), rect.x, rect.y, rect.width);
        this.changePaintOpacity(true);
    }
};

Window_PartyMemberList.prototype.selectedActor = function() {
    return this.item(this.index());
};

//-----------------------------------------------------------------------------
// Window_PartyFormation
//
// The window class for the party formation screen

function Window_PartyFormation() {
    this.initialize(...arguments);
    }
    
    Window_PartyFormation.prototype = Object.create(Window_Selectable.prototype);
    Window_PartyFormation.prototype.constructor = Window_PartyFormation;
    
    Window_PartyFormation.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._actor = null;
    this.refresh();
    };
    
    Window_PartyFormation.prototype.maxItems = function() {
    return $gameParty.maxBattleMembers();
    };
    
    Window_PartyFormation.prototype.item = function(index) {
    return $gameParty.battleMembers()[index];
    };
    
    Window_PartyFormation.prototype.drawItem = function(index) {
    const actor = this.item(index);
    if (actor) {
    const rect = this.itemRect(index);
    this.changePaintOpacity(actor.isBattleMember());
    this.drawText(actor.name(), rect.x, rect.y, rect.width);
    this.changePaintOpacity(true);
    }
    };
    
    Window_PartyFormation.prototype.setActor = function(actor) {
    this._actor = actor;
    };
    
    Window_PartyFormation.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (Input.isTriggered('cancel')) {
    this.processCancel();
    } else if (Input.isTriggered('ok')) {
    this.processOk();
    } else if (Input.isTriggered('up') || Input.isTriggered('down') || Input.isTriggered('left') || Input.isTriggered('right')) {
    this.playCursorSound();
    this.updatePlacement();
    }
    };
    
    Window_PartyFormation.prototype.updatePlacement = function() {
    const index = this.index();
    const members = $gameParty.battleMembers();
    const newIndex = members.indexOf(this._actor);
    if (Input.isTriggered('up') && newIndex > 0) {
    members[newIndex] = members[newIndex - 1];
    members[newIndex - 1] = this._actor;
    this.refresh();
    this.select(newIndex - 1);
    } else if (Input.isTriggered('down') && newIndex < members.length - 1) {
    members[newIndex] = members[newIndex + 1];
    members[newIndex + 1] = this._actor;
    this.refresh();
    this.select(newIndex + 1);
    } else if (Input.isTriggered('left') && index > 0) {
    this.select(index - 1);
    } else if (Input.isTriggered('right') && index < this.maxItems() - 1) {
    this.select(index + 1);
    }
    };
    
    Window_PartyFormation.prototype.playCursorSound = function() {
    SoundManager.playCursor();
    };
    
    Window_PartyFormation.prototype.processOk = function() {
    this.playOkSound();
    this._actor = null;
    this.hide();
    this.deselect();
    this.callHandler('ok');
    };
    
    Window_PartyFormation.prototype.processCancel = function() {
    this.playCancelSound();
    this.hide();
    this.deselect();
    this.callHandler('cancel');
    };
    
    Window_PartyFormation.prototype.refresh = function() {
    this.createContents();
    this.drawAllItems();
    };
    
    Window_PartyFormation.prototype.drawItem = function(index) {
    const actor = this.item(index);
    if (actor) {
    const rect = this.itemRect(index);
    this.changePaintOpacity(actor.isBattleMember());
    this.drawText(actor.name(), rect.x, rect.y, rect.width);
    this.changePaintOpacity(true);
    }
    };
    
    Window_PartyFormation.prototype.drawAllItems = function() {
    for (let i = 0; i < this.maxItems(); i++) {
    this.drawItem(i);
    }
    };
    
    Window_PartyFormation.prototype.itemRect = function(index) {
        const rect = new Rectangle();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % 2 === 0 ? 0 : rect.width;
        rect.y = Math.floor(index / 2) * rect.height;
        return rect;
        };
        
        function Scene_PartyFormation() {
        this.initialize(...arguments);
        }
        
        Scene_PartyFormation.prototype = Object.create(Scene_MenuBase.prototype);
        Scene_PartyFormation.prototype.constructor = Scene_PartyFormation;
        
        Scene_PartyFormation.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        };
        
        Scene_PartyFormation.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createFormationWindow();
        };
        
        Scene_PartyFormation.prototype.createFormationWindow = function() {
        const rect = new Rectangle(0, this._helpWindow.height, Graphics.boxWidth, Graphics.boxHeight - this._helpWindow.height);
        this._formationWindow = new Window_PartyFormation(rect);
        this._formationWindow.setHelpWindow(this._helpWindow);
        this._formationWindow.setHandler('ok', this.onFormationOk.bind(this));
        this._formationWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._formationWindow);
        };
        
        Scene_PartyFormation.prototype.onFormationOk = function() {
        $gamePlayer.refresh();
        this.popScene();
        };
        
        Scene_PartyFormation.prototype.refreshActor = function() {
        const actor = this.actor();
        this._formationWindow.setActor(actor);
        this._statusWindow.setActor(actor);
        };
        
        Scene_PartyFormation.prototype.actor = function() {
        return $gameParty.members()[this._actorIndex];
        };
        
        Scene_PartyFormation.prototype.onActorChange = function() {
        this.refreshActor();
        this._statusWindow.refresh();
        };
        
        Scene_PartyFormation.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        if (this._actorIndex !== this._formationWindow.index()) {
        this._actorIndex = this._formationWindow.index();
        this.onActorChange();
        }
        };
        
        Scene_PartyFormation.prototype.helpWindowText = function() {
        return "Select a party member and use the arrow keys to swap their position in the formation.";
        };
        
        PluginManager.registerCommand('QuickPartySwap', 'openPartyFormation', function() {
        SceneManager.push(Scene_PartyFormation);
        });

        function Window_PartyFormation() {
            this.initialize(...arguments);
            }
            
            Window_PartyFormation.prototype = Object.create(Window_Selectable.prototype);
            Window_PartyFormation.prototype.constructor = Window_PartyFormation;
            
            Window_PartyFormation.prototype.initialize = function(rect) {
            Window_Selectable.prototype.initialize.call(this, rect);
            this._actor = null;
            this.refresh();
            };
            
            Window_PartyFormation.prototype.maxCols = function() {
            return 2;
            };
            
            Window_PartyFormation.prototype.maxItems = function() {
            return $gameParty.size();
            };
            
            Window_PartyFormation.prototype.itemHeight = function() {
            return this.innerHeight / 4;
            };
            
            Window_PartyFormation.prototype.drawItem = function(index) {
            const actor = $gameParty.members()[index];
            const rect = this.itemRect(index);
            this.changePaintOpacity(this.isEnabled(actor));
            this.drawActorFace(actor, rect.x + 1, rect.y + 1, rect.width - 2, rect.height - 2);
            this.changePaintOpacity(true);
            };

            Window_PartyFormation.prototype.isEnabled = function(actor) {
            return this._actor !== actor && actor.isFormationChangeAllowed();
            };

            Game_Actor.prototype.isFormationChangeAllowed = function() {
                return $gameMap.isPartyChangeAllowed() && !this.isDead();
            };
            

            Window_PartyFormation.prototype.setActor = function(actor) {
            this._actor = actor;
            this.refresh();
            };
            
            Window_PartyFormation.prototype.updateHelp = function() {
            this.setHelpWindowItem(this.helpItem());
            };
            
            Window_PartyFormation.prototype.helpItem = function() {
            const actor = $gameParty.members()[this.index()];
            return actor ? actor.name() : '';
            };
            
            Window_PartyFormation.prototype.processHandling = function() {
            if (this.isOpenAndActive() && this.isHandled('down') && Input.isRepeated('down')) {
            this.playCursorSound();
            this.cursorDown(Input.isTriggered('down'));
            }
            if (this.isOpenAndActive() && this.isHandled('up') && Input.isRepeated('up')) {
            this.playCursorSound();
            this.cursorUp(Input.isTriggered('up'));
            }
            if (this.isOpenAndActive() && this.isHandled('right') && Input.isRepeated('right')) {
            this.playCursorSound();
            this.cursorRight(Input.isTriggered('right'));
            }
            if (this.isOpenAndActive() && this.isHandled('left') && Input.isRepeated('left')) {
            this.playCursorSound();
            this.cursorLeft(Input.isTriggered('left'));
            }
            if (this.isOpenAndActive() && this.isHandled('ok') && Input.isTriggered('ok')) {
            SoundManager.playOk();
            this.callOkHandler();
            }
            if (this.isOpenAndActive() && this.isHandled('cancel') && Input.isTriggered('cancel')) {
            SoundManager.playCancel();
            this.callCancelHandler();
            }
            };
            
            Window_PartyFormation.prototype.cursorDown = function(wrap) {
            const index = this.index();
            const lastIndex = this.maxItems() - 1;
            if (index < lastIndex) {
            const actor = $gameParty.members()[index];
            let nextIndex = index + 2;
            while (nextIndex <= lastIndex && !this.isEnabled($gameParty.members()[nextIndex])) {
            nextIndex += 2;
            }
            if (nextIndex > lastIndex && wrap) {
            nextIndex = 1;
            while (nextIndex <= index && !this.isEnabled($gameParty.members()[nextIndex])) {
            nextIndex += 2;
            }
            }
            if (nextIndex <= lastIndex) {
            $gameParty.swapOrder(index, nextIndex);
            this.select(nextIndex);
            this.refresh();
            }
            }
            };

            Window_PartyFormation.prototype.cursorUp = function(wrap) {
                const index = this.index();
                if (index > 0) {
                const actor = $gameParty.members()[index];
                let nextIndex = index - 2;
                while (nextIndex >= 0 && !this.isEnabled($gameParty.members()[nextIndex])) {
                nextIndex -= 2;
                }
                if (nextIndex < 0 && wrap) {
                nextIndex = this.maxItems() - 2;
                while (nextIndex >= index && !this.isEnabled($gameParty.members()[nextIndex])) {
                nextIndex -= 2;
                }
                }
                if (nextIndex >= 0) {
                $gameParty.swapOrder(index, nextIndex);
                this.select(nextIndex);
                this.refresh();
                }
                }
                };
                
                Window_PartyFormation.prototype.cursorRight = function(wrap) {
                const index = this.index();
                if (index % 2 === 0) {
                const actor = $gameParty.members()[index];
                let nextIndex = index + 1;
                while (nextIndex < this.maxItems() && !this.isEnabled($gameParty.members()[nextIndex])) {
                nextIndex += 1;
                }
                if (nextIndex >= this.maxItems() && wrap) {
                nextIndex = 0;
                while (nextIndex <= index && !this.isEnabled($gameParty.members()[nextIndex])) {
                nextIndex += 1;
                }
                }
                if (nextIndex < this.maxItems()) {
                $gameParty.swapOrder(index, nextIndex);
                this.select(nextIndex);
                this.refresh();
                }
                }
                };
                
                Window_PartyFormation.prototype.cursorLeft = function(wrap) {
                const index = this.index();
                if (index % 2 === 1) {
                const actor = $gameParty.members()[index];
                let nextIndex = index - 1;
                while (nextIndex >= 0 && !this.isEnabled($gameParty.members()[nextIndex])) {
                nextIndex -= 1;
                }
                if (nextIndex < 0 && wrap) {
                nextIndex = this.maxItems() - 1;
                while (nextIndex >= index && !this.isEnabled($gameParty.members()[nextIndex])) {
                nextIndex -= 1;
                }
                }
                if (nextIndex >= 0) {
                $gameParty.swapOrder(index, nextIndex);
                this.select(nextIndex);
                this.refresh();
                }
                }
                };
                
                Window_PartyFormation.prototype.selectActor = function(actor) {
                const index = $gameParty.members().indexOf(actor);
                if (index >= 0) {
                this.select(index);
                this.ensureCursorVisible();
                }
                };
