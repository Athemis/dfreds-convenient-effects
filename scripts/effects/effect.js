/**
 * Data class for defining an effect
 */
export default class Effect {
  constructor({
    customId = null,
    name,
    description,
    icon,
    seconds,
    turns,
    isDynamic = false,
    isViewable = true,
    flags = {},
    changes = [],
    atlChanges = [],
    tokenMagicChanges = [],
    nestedEffects = [],
  }) {
    this.customId = customId;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.seconds = seconds;
    this.turns = turns;
    this.isDynamic = isDynamic;
    this.isViewable = isViewable;
    this.flags = flags;
    this.changes = changes;
    this.atlChanges = atlChanges;
    this.tokenMagicChanges = tokenMagicChanges;
    this.nestedEffects = nestedEffects;
  }

  /**
   * Converts the effect data to an active effect data object
   *
   * @param {string} origin - the origin to add to the effect
   * @returns The active effect data object for this effect
   */
  convertToActiveEffectData(origin) {
    return {
      id: this._id,
      name: this.name,
      label: this.name,
      icon: this.icon,
      duration: this._getDurationData(),
      flags: foundry.utils.mergeObject(this.flags, {
        core: {
          statusId: this._id,
        },
        isConvenient: true,
      }),
      origin: origin,
      changes: this.changes,
    };
  }

  get _id() {
    return `Convenient Effect: ${this.name}`;
  }

  _getDurationData() {
    if (game.combat) {
      return {
        startRound: game.combat.round,
        rounds: this.seconds ? this.seconds / 6 : undefined,
        turns: this.turns,
      };
    } else {
      return {
        startTime: game.time.worldTime,
        seconds: this.seconds ? this.seconds : undefined,
      };
    }
  }
}
