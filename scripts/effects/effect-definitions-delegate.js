import Constants from '../constants.js';
import FoundryHelpers from '../foundry-helpers.js';
import EffectDefinitions5e from './dnd5e/effect-definitions-5e.js';
import EffectDefinitionsDS4 from './ds4/effect-definitions-ds4.js';

/**
 * Defines effects by delegating to specific systems
 */
export default class EffectDefinitionsDelegate {
  constructor() {
    this._foundryHelpers = new FoundryHelpers();
    this._handlers = {};
    this._initializeHandlers();
  }

  _initializeHandlers() {
    this._handlers[Constants.SYSTEM_IDS.DND_5E] = new EffectDefinitions5e();
    this._handlers[Constants.SYSTEM_IDS.DS4] = new EffectDefinitionsDS4();
  }

  /**
   * Get all effects
   *
   * @returns {Effect[]} all the effects
   */
  all() {
    const handler = this._handlers[this._foundryHelpers.systemId];

    if (handler) {
      return handler.all();
    }
  }
  
  /**
   * Get all the condition effects
   *
   * @returns {Effect[]} all the condition effects
   */
  conditions() {
    const handler = this._handlers[this._foundryHelpers.systemId];

    if (handler) {
      return handler.conditions();
    }
  }
  
  /**
   * Get all the custom effects
   *
   * @returns {Effect[]} all the custom effects
   */
  customEffects() {
    const handler = this._handlers[this._foundryHelpers.systemId];

    if (handler) {
      return handler.customEffects();
    }
  }
  
  /**
   * Get all the spell effects
   *
   * @returns {Effect[]} all the spell effects
   */
  spells() {
    const handler = this._handlers[this._foundryHelpers.systemId];

    if (handler) {
      return handler.spells();
    }
  }
  
  /**
   * Get all the class feature effects
   *
   * @returns {Effect[]} all the class feature effects
   */
  classFeatures() {
    const handler = this._handlers[this._foundryHelpers.systemId];

    if (handler) {
      return handler.classFeatures();
    }
  }
  
  /**
   * Get all the equipment effects
   *
   * @returns {Effect[]} all the equipment effects
   */
  equipment() {
    const handler = this._handlers[this._foundryHelpers.systemId];

    if (handler) {
      return handler.equipment();
    }
  }
  
  /**
   * Get all the other effects
   *
   * @returns {Effect[]} all the other effects
   */
  other() {
    const handler = this._handlers[this._foundryHelpers.systemId];

    if (handler) {
      return handler.other();
    }
  }
}
