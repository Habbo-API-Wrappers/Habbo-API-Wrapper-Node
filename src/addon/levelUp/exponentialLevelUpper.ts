import { AbstractLevelUpper } from './abstractLevelUpper';

/**
 * An exponential level-up system: the XP required per level grows exponentially by `strength`
 * percent, starting from `initialXp` for level 2.
 */
export class ExponentialLevelUpper extends AbstractLevelUpper {
  private readonly initialXp: number;
  private readonly strengthAsDecimal: number;
  private readonly maximumLevel: number;
  private readonly maxXpValue: number;

  /**
   * @param initialXp The required XP to reach level 2 from level 1
   * @param strength The exponential increase factor (%)
   * @param maximumLevel The maximum level
   */
  constructor(initialXp: number, strength: number, maximumLevel: number) {
    super();
    this.initialXp = initialXp;
    this.strengthAsDecimal = strength / 100;
    this.maximumLevel = maximumLevel;
    this.maxXpValue = this.xpForLevel(this.maximumLevel);
  }

  currentLevel(xp: number): number {
    const currentXp = this.currentXp(xp);
    if (currentXp <= 0) return 1;

    const logBase = 1 + this.strengthAsDecimal;
    const level = Math.trunc(Math.log((currentXp * this.strengthAsDecimal) / this.initialXp + 1) / Math.log(logBase));

    if (level > this.maximumLevel) return this.maximumLevel;
    if (level < 1) return 1;
    if (currentXp < this.xpForLevel(level)) return Math.max(level - 1, 1);
    if (currentXp >= this.xpForLevel(level + 1)) return Math.min(this.maximumLevel, level + 1);
    return level;
  }

  totalXpRequired(xp: number): number {
    if (this.isMaxed(xp)) return 0;
    const currentLevel = this.currentLevel(xp);
    return this.xpForLevel(currentLevel + 1) - this.xpForLevel(currentLevel);
  }

  progress(xp: number): number {
    const currentXp = this.currentXp(xp);
    if (this.isMaxed(currentXp)) return 0;
    const currentLevel = this.currentLevel(xp);
    return currentXp - this.xpForLevel(currentLevel);
  }

  progressPercentage(xp: number): number {
    const currentXp = this.currentXp(xp);
    if (this.isMaxed(currentXp)) return 0;
    const currentLevel = this.currentLevel(xp);
    const levelXp = this.xpForLevel(currentLevel);
    const nextLevelXp = this.xpForLevel(currentLevel + 1);
    if (levelXp === nextLevelXp) return 100;
    return Math.trunc(((currentXp - levelXp) / (nextLevelXp - levelXp)) * 100);
  }

  xpRemaining(xp: number): number {
    const currentXp = this.currentXp(xp);
    if (this.isMaxed(currentXp)) return 0;
    return this.xpForLevel(this.currentLevel(currentXp) + 1) - currentXp;
  }

  isMaxed(xp: number): boolean {
    return this.currentLevel(xp) >= this.maximumLevel;
  }

  maxLevel(): number {
    return this.maximumLevel;
  }

  maxXp(): number {
    return this.maxXpValue;
  }

  private xpForLevel(level: number): number {
    if (level < 1) return 0;
    if (level > this.maximumLevel) return this.maxXpValue;
    return Math.trunc(
      this.initialXp * ((Math.pow(1 + this.strengthAsDecimal, level - 1) - 1 + 1e-9) / this.strengthAsDecimal)
    );
  }
}
