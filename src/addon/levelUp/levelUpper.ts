import { AbstractLevelUpper } from './abstractLevelUpper';
import { LinearLevelUpper } from './linearLevelUpper';
import { InterpolateLevelUpper } from './interpolateLevelUpper';
import { ExponentialLevelUpper } from './exponentialLevelUpper';

/**
 * Factory helpers to create a Level-up System calculator, mirroring the WIRED Variable Add-on.
 */
export class LevelUpper {
  /**
   * Create a new linear Level Up system.
   *
   * @param stepSize The amount of XP required for each level
   * @param maxLevel The maximum level
   */
  static linear(stepSize: number, maxLevel: number): AbstractLevelUpper {
    return new LinearLevelUpper(stepSize, maxLevel);
  }

  /**
   * Create a new interpolating Level Up system.
   *
   * @param levelToXpMap The configuration of the add-on
   */
  static interpolate(levelToXpMap: Record<number, number>): AbstractLevelUpper {
    return new InterpolateLevelUpper(levelToXpMap);
  }

  /**
   * Create a new exponential Level Up system.
   *
   * @param initialXp The required XP to reach level 2 from level 1
   * @param strength The exponential increase factor (%)
   * @param maxLevel The maximum level
   */
  static exponential(initialXp: number, strength: number, maxLevel: number): AbstractLevelUpper {
    return new ExponentialLevelUpper(initialXp, strength, maxLevel);
  }
}
