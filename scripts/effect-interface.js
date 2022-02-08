import ActorUpdaterDelegate from './effects/actor-updater-delegate.js';
import Constants from './constants.js';
import CustomEffectsHandler from './effects/custom-effects-handler.js';
import Effect from './effects/effect.js';
import EffectHandler from './effects/effect-handler.js';
import FoundryHelpers from './foundry-helpers.js';

/**
 * Interface for working with effects and executing them as a GM via sockets
 */
export default class EffectInterface {
  constructor() {
    this._actorUpdaterDelegate = new ActorUpdaterDelegate();
    this._customEffectsHandler = new CustomEffectsHandler();
    this._effectHandler = new EffectHandler();
    this._foundryHelpers = new FoundryHelpers();
  }

  /**
   * Initializes the socket and registers the socket functions
   */
  initialize() {
    this._socket = socketlib.registerModule(Constants.MODULE_ID);
    this._registerFunctions();
  }

  _registerFunctions() {
    this._socket.register(
      'toggleEffect',
      this._effectHandler.toggleEffect.bind(this._effectHandler)
    );
    this._socket.register(
      'addEffect',
      this._effectHandler.addEffect.bind(this._effectHandler)
    );
    this._socket.register(
      'removeEffect',
      this._effectHandler.removeEffect.bind(this._effectHandler)
    );
    this._socket.register(
      'addActorDataChanges',
      this._actorUpdaterDelegate.addActorDataChanges.bind(
        this._actorUpdaterDelegate
      )
    );
    this._socket.register(
      'removeActorDataChanges',
      this._actorUpdaterDelegate.removeActorDataChanges.bind(
        this._actorUpdaterDelegate
      )
    );
  }

  /**
   * Searches through the list of available effects and returns one matching the
   * effect name. Prioritizes finding custom effects first.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {Effect} the found effect
   */
  findEffectByName(effectName) {
    const effect = this._customEffectsHandler
      .getCustomEffects()
      .find((effect) => effect.name == effectName);

    if (effect) return effect;

    return game.dfreds.effects.all.find((effect) => effect.name == effectName);
  }

  /**
   * Toggles the effect on the provided actor UUIDS as the GM via sockets
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {object} params - the effect parameters
   * @param {boolean} params.overlay - if the effect is an overlay or not
   * @param {string[]} params.uuids - UUIDS of the actors to toggle the effect on
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async toggleEffect(effectName, { overlay, uuids = [] } = {}) {
    if (uuids.length == 0) {
      uuids = this._foundryHelpers.getActorUuidsFromCanvas();
    }

    if (uuids.length == 0) {
      ui.notifications.error(
        `Please select or target a token to toggle ${effectName}`
      );
      return;
    }

    let effect = this.findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} was not found`);
      return;
    }

    if (effect.nestedEffects.length > 0) {
      effect = await this._getNestedEffectSelection(effect);
      if (!effect) return; // dialog closed without selecting one
    }

    return this._socket.executeAsGM('toggleEffect', effect, {
      overlay,
      uuids,
    });
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {Promise<boolean>} true if the effect is applied, false otherwise
   */
  async hasEffectApplied(effectName, uuid) {
    return this._effectHandler.hasEffectApplied(effectName, uuid);
  }

  /**
   * Removes the effect from the provided actor UUID as the GM via sockets
   *
   * @param {object} params - the effect params
   * @param {string} params.effectName - the name of the effect to remove
   * @param {string} params.uuid - the UUID of the actor to remove the effect from
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async removeEffect({ effectName, uuid }) {
    let effect = this.findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} could not be found`);
      return;
    }

    const actor = await this._foundryHelpers.getActorByUuid(uuid);

    if (!actor) {
      ui.notifications.error(`Actor ${uuid} could not be found`);
      return;
    }

    if (effect.nestedEffects.length > 0) {
      effect = await this._getNestedEffectSelection(effect);
    }

    return this._socket.executeAsGM('removeEffect', {
      effect,
      uuid,
    });
  }

  /**
   * Adds the effect to the provided actor UUID as the GM via sockets
   *
   * @param {object} params - the params for adding an effect
   * @param {string} params.effectName - the name of the effect to add
   * @param {string} params.uuid - the UUID of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async addEffect({ effectName, uuid, origin, overlay }) {
    let effect = this.findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} could not be found`);
      return;
    }

    const actor = await this._foundryHelpers.getActorByUuid(uuid);

    if (!actor) {
      ui.notifications.error(`Actor ${uuid} could not be found`);
      return;
    }

    if (effect.nestedEffects.length > 0) {
      effect = await this._getNestedEffectSelection(effect);
    }

    return this._socket.executeAsGM('addEffect', {
      effect,
      uuid,
      origin,
      overlay,
    });
  }

  /**
   * Adds the defined effect to the provided actor UUID as the GM via sockets
   *
   * @param {object} params - the params for adding an effect
   * @param {object} params.effectData - the object containing all of the relevant effect data
   * @param {string} params.uuid - the UUID of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async addEffectWith({ effectData, uuid, origin, overlay }) {
    let effect = new Effect(effectData);

    const actor = await this._foundryHelpers.getActorByUuid(uuid);

    if (!actor) {
      ui.notifications.error(`Actor ${uuid} could not be found`);
      return;
    }

    if (effect.nestedEffects.length > 0) {
      effect = await this._getNestedEffectSelection(effect);
    }

    return this._socket.executeAsGM('addEffect', {
      effect,
      uuid,
      origin,
      overlay,
    });
  }

  /**
   * Adds data changes to the provided actor UUID as the GM via sockets
   *
   * @param {string} effectName - the name of the effect that is adding actor data changes
   * @param {string} uuid - the UUID of the actor to add the data changes to
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  addActorDataChanges(effectName, uuid) {
    return this._socket.executeAsGM('addActorDataChanges', effectName, uuid);
  }

  /**
   * Removes data changes from the provided actor UUID as the GM via sockets
   *
   * @param {string} effectName - the name of the effect that is removing actor data changes
   * @param {string} uuid - the UUID of the actor to remove the data changes from
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  removeActorDataChanges(effectName, uuid) {
    return this._socket.executeAsGM('removeActorDataChanges', effectName, uuid);
  }

  async _getNestedEffectSelection(effect) {
    const content = await renderTemplate(
      'modules/dfreds-convenient-effects/templates/nested-effects-dialog.html',
      { parentEffect: effect }
    );
    const choice = await Dialog.prompt(
      {
        title: effect.name,
        content: content,
        label: 'Select Effect',
        callback: (html) => {
          const htmlChoice = html.find('select[name="effect-choice"]').val();
          return htmlChoice;
        },
        rejectClose: false,
      },
      { width: 300 }
    );

    return effect.nestedEffects.find(
      (nestedEffect) => nestedEffect.name == choice
    );
  }
}
