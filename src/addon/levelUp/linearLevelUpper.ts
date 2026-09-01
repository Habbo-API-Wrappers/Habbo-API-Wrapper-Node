import { AbstractLevelUpper } from './abstractLevelUpper';

/**
 * A linear level-up system: every level requires the same fixed amount of XP.
 */
export class LinearLevelUpper extends AbstractLevelUpper {
  constructor(
    private readonly stepSize: number,
    private readonly maximumLevel: number
  ) {
    super();
  }

  currentLevel(xp: number): number {
    return Math.trunc(Math.min(this.maximumLevel, 1 + this.currentXp(xp) / this.stepSize));
  }

  totalXpRequired(xp: number): number {
    if (this.isMaxed(xp)) return 0;
    return this.stepSize;
  }

  progress(xp: number): number {
    if (this.isMaxed(xp)) return 0;
    return this.currentXp(xp) % this.stepSize;
  }

  progressPercentage(xp: number): number {
    if (this.isMaxed(xp)) return 0;
    return Math.trunc((this.progress(xp) / this.stepSize) * 100);
  }

  xpRemaining(xp: number): number {
    if (this.isMaxed(xp)) return 0;
    return this.stepSize - (this.currentXp(xp) % this.stepSize);
  }

  isMaxed(xp: number): boolean {
    return this.currentLevel(xp) >= this.maximumLevel;
  }

  maxLevel(): number {
    return this.maximumLevel;
  }

  maxXp(): number {
    return this.maximumLevel * this.stepSize;
  }
}
