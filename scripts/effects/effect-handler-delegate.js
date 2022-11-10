import Constants from '../constants.js';
import FoundryHelpers from '../foundry-helpers.js';
import EffectHandler5e from './dnd5e/effect-handler-5e.js';
import EffectHandlerDS4 from './ds4/effect-handler-ds4.js';

/**
 * Handles effects by delegating to specific systems
 */
export default class EffectHandlerDelegate {
  constructor() {
    this._foundryHelpers = new FoundryHelpers();
    this._handlers = {};
    this._initializeHandlers();
  }

  _initializeHandlers() {
    this._handlers[Constants.SYSTEM_IDS.DND_5E] = new EffectHandler5e();
    this._handlers[Constants.SYSTEM_IDS.DS4] = new EffectHandlerDS4();
  }

  /**
   * Toggles an effect on or off by name on an actor by UUID
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {object} params - the effect parameters
   * @param {boolean} params.overlay - if the effect is an overlay or not
   * @param {string[]} params.uuids - UUIDS of the actors to toggle the effect on
   */
  toggleEffect(effectName, { overlay, uuids }) {
    const handler = this._handlers[this._foundryHelpers.systemId];

    if (handler) {
      return handler.toggleEffect(effectName, { overlay, uuids });
    }
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  hasEffectApplied(effectName, uuid) {
    const handler = this._handlers[this._foundryHelpers.systemId];

    if (handler) {
      return handler.hasEffectApplied(effectName, uuid);
    }
  }
  
  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {object} params - the effect parameters
   * @param {string} params.effectName - the name of the effect to remove
   * @param {string} params.uuid - the uuid of the actor to remove the effect from
   */
  removeEffect({ effectName, uuid }) {
    const handler = this._handlers[this._foundryHelpers.systemId];

    if (handler) {
      return handler.removeEffect({ effectName, uuid });
    }
  }
  
  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {object} params - the effect parameters
   * @param {string} params.effectName - the name of the effect to add
   * @param {object} params.effectData - the effect data to add if effectName is not provided
   * @param {string} params.uuid - the uuid of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   */
  addEffect({ effectName, effectData, uuid, origin, overlay }) {
    const handler = this._handlers[this._foundryHelpers.systemId];

    if (handler) {
      return handler.addEffect({ effectName, effectData, uuid, origin, overlay });
    }
  }
}
