import ChatHandler from './chat-handler.js';
import Controls from './controls.js';
import ConvenientEffectsApp from './app/convenient-effects-app.js';
import CustomEffectsHandler from './effects/custom-effects-handler.js';
import EffectDefinitions from './effects/effect-definitions.js';
import EffectInterface from './effect-interface.js';
import HandlebarHelpers from './handlebar-helpers.js';
import Settings from './settings.js';
import StatusEffects from './status-effects.js';
import { libWrapper } from './lib/shim.js';

Hooks.once('init', () => {
  new Settings().registerSettings();
  new HandlebarHelpers().registerHelpers();
});

Hooks.once('socketlib.ready', () => {
  game.dfreds = game.dfreds || {};

  game.dfreds.effects = new EffectDefinitions();
  game.dfreds.effectInterface = new EffectInterface();
  game.dfreds.statusEffects = new StatusEffects();

  game.dfreds.effectInterface.initialize();
});

Hooks.once('ready', () => {
  const customEffects = new CustomEffectsHandler();
  customEffects.initialize();
  customEffects.deleteInvalidEffects();
  game.dfreds.statusEffects.initializeStatusEffects();
});

Hooks.once('setup', () => {
  const MODULE_ID = 'dfreds-convenient-effects';

  libWrapper.register(
    MODULE_ID,
    'TokenHUD.prototype._onToggleEffect',
    function (wrapper, ...args) {
      game.dfreds.statusEffects.onToggleEffect({
        token: this.object,
        wrapper,
        args,
      });
    }
  );

  libWrapper.register(
    MODULE_ID,
    'TokenHUD.prototype._getStatusEffectChoices',
    function (_wrapper, ..._args) {
      const token = this.object;
      return game.dfreds.statusEffects.getStatusEffectChoices(token);
    }
  );
});

Hooks.on('getSceneControlButtons', (controls) => {
  new Controls().initializeControls(controls);
});

Hooks.on('preCreateActiveEffect', (activeEffect, config, userId) => {
  if (!activeEffect?.data?.flags?.isConvenient) return;

  const chatHandler = new ChatHandler();
  chatHandler.createChatForEffect({
    effectName: activeEffect?.data?.label,
    reason: 'Applied to',
    actor: activeEffect?.parent,
  });
});

Hooks.on('createActiveEffect', (activeEffect, config, userId) => {
  if (!activeEffect?.data?.flags?.isConvenient) return;

  if (activeEffect?.data?.flags?.requiresActorUpdate) {
    game.dfreds.effectInterface.addActorDataChanges(
      activeEffect?.data?.label,
      activeEffect?.parent?.uuid
    );
  }
});

Hooks.on('preDeleteActiveEffect', (activeEffect, config, userId) => {
  if (!activeEffect?.data?.flags?.isConvenient) return;

  const isExpired =
    activeEffect?.duration?.remaining !== null &&
    activeEffect?.duration?.remaining <= 0;

  const chatHandler = new ChatHandler();
  chatHandler.createChatForEffect({
    effectName: activeEffect?.data?.label,
    reason: isExpired ? 'Expired from' : 'Removed from',
    actor: activeEffect?.parent,
  });
});

/**
 * Handle removing any actor data changes when an active effect is deleted from an actor
 */
Hooks.on('deleteActiveEffect', (activeEffect, config, userId) => {
  if (!activeEffect?.data?.flags?.isConvenient) return;

  if (activeEffect?.data?.flags?.requiresActorUpdate) {
    game.dfreds.effectInterface.removeActorDataChanges(
      activeEffect?.data?.label,
      activeEffect?.parent?.uuid
    );
  }
});

/**
 * Handle adding a form item for effect description to custom effects
 */
Hooks.on('renderActiveEffectConfig', (activeEffectConfig, html, data) => {
  if (!activeEffectConfig?.object?.data?.flags?.isCustomConvenient) return;

  const labelFormGroup = html
    .find('section[data-tab="details"] .form-group')
    .first();

  const description =
    activeEffectConfig.object.data.flags.customEffectDescription ??
    'Applies custom effects';
  labelFormGroup.after(
    `<div class="form-group"><label>Effect Description</label><div class="form-fields"><input type="text" name="flags.customEffectDescription" value="${description}"></div></div>`
  );
});

/**
 * Handle re-rendering the ConvenientEffectsApp if it is open and a custom convenient active effect sheet is closed
 */
Hooks.on('closeActiveEffectConfig', (activeEffectConfig, html) => {
  if (!activeEffectConfig?.object?.data?.flags?.isCustomConvenient) return;

  const openApps = Object.values(ui.windows);
  const convenientEffectsApp = openApps.find(
    (app) => app instanceof ConvenientEffectsApp
  );

  if (convenientEffectsApp) {
    convenientEffectsApp.render();
  }
});
