import Effect from '../effect.js';
import Constants from '../../constants.js';
import Settings from '../../settings.js';
import CustomEffectsHandler from '../custom-effects-handler.js';

/**
 * Defines all of the effect definitions
 */
export default class EffectDefinitions {
  constructor() {
    this._customEffectsHandler = new CustomEffectsHandler();
    this._settings = new Settings();
  }

  /**
   * Get all effects
   *
   * @returns {Effect[]} all the effects
   */
  get all() {
    return [
      ...this.conditions,
      ...this.customEffects,
      ...this.spells,
      ...this.classFeatures,
      ...this.equipment,
      ...this.other,
    ];
  }

  /**
   * Get all the condition effects
   *
   * @returns {Effect[]} all the condition effects
   */
  get conditions() {
    return [];
  }

  /**
   * Get all the custom effects
   *
   * @returns {Effect[]} all the custom effects
   */
  get customEffects() {
    return this._customEffectsHandler.getCustomEffects();
  }

  /**
   * Get all the spell effects
   *
   * @returns {Effect[]} all the spell effects
   */
  get spells() {
    return [];
  }

  /**
   * Get all the class feature effects
   *
   * @returns {Effect[]} all the class feature effects
   */
  get classFeatures() {
    return [];
  }

  /**
   * Get all the equipment effects
   *
   * @returns {Effect[]} all the equipment effects
   */
  get equipment() {
    return [];
  }

  /**
   * Get all the other effects
   *
   * @returns {Effect[]} all the other effects
   */
  get other() {
    return [];
  }
}
