import FoundryHelpers from '../../foundry-helpers.js';

/**
 * Handles updating actor data for certain effects
 */
export default class ActorUpdaterDS4 {
  constructor() {
    this._foundryHelpers = new FoundryHelpers();
  }

  /**
   * Adds data changes to the provided actor UUID
   *
   * @param {string} effectName - the name of the effect that is adding actor data changes
   * @param {string} uuid - the UUID of the actor to add the data changes to
   */
  async addActorDataChanges(effectName, uuid) {
    const actor = this._foundryHelpers.getActorByUuid(uuid);
  }

  /**
   * Removes data changes from the provided actor UUID
   *
   * @param {string} effectName - the name of the effect that is removing actor data changes
   * @param {string} uuid - the UUID of the actor to remove the data changes from
   */
  async removeActorDataChanges(effectName, uuid) {
    const actor = this._foundryHelpers.getActorByUuid(uuid);
  }
}
