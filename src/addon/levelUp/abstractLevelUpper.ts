/**
 * Mimics the behaviour of the Variable Add-on: Level-up System.
 */
export abstract class AbstractLevelUpper {
  /**
   * Bound the value to within the allowed XP limits.
   *
   * @param xp The value of the variable
   * @returns The bound XP value
   */
  currentXp(xp: number): number {
    return Math.min(Math.max(xp, 0), this.maxXp());
  }

  /**
   * Get the current level for the given xp.
   *
   * @param xp The value of the variable
   * @returns The current level
   */
  abstract currentLevel(xp: number): number;

  /**
   * Get the total amount of XP required to achieve the next level from the current level.
   *
   * @param xp The value of the variable
   * @returns The total XP required to achieve the next level
   */
  abstract totalXpRequired(xp: number): number;

  /** Get the amount of XP past the current level.
   *
   * @param xp The value of the variable
   * @returns The amount of XP past the current level
   */
  abstract progress(xp: number): number;

  /** Get the percentage of progress to the next level.
   *
   * @param xp The value of the variable
   * @returns The percentage of progress to the next level
   */
  abstract progressPercentage(xp: number): number;

  /** Get the amount of XP required to reach the next level.
   *
   * @param xp The value of the variable
   * @returns The amount of XP required to reach the next level
   */
  abstract xpRemaining(xp: number): number;

  /** Returns whether the variable has reached the max level or not.
   *
   * @param xp The value of the variable
   * @returns Whether the variable has reached the max level or not
   */
  abstract isMaxed(xp: number): boolean;

  /** Get the maximum achievable level.
   *
   * @returns The maximum achievable level
   */
  abstract maxLevel(): number;

  /** Get the maximum achievable XP.
   *
   * @returns The maximum achievable XP
   */
  abstract maxXp(): number;
}
