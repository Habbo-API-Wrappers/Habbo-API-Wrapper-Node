import { AbstractLevelUpper } from './abstractLevelUpper';

interface LevelXpEntry {
  level: number;
  xp: number;
}

interface ProgressInfo {
  currentLevel: number;
  currentLevelXp: number;
  currentXp: number;
  nextLevelXp: number;
  isMaxed: boolean;
}

/**
 * An interpolating level-up system: levels are defined by an explicit `level -> xp` map, and XP
 * requirements between two defined levels are interpolated linearly.
 */
export class InterpolateLevelUpper extends AbstractLevelUpper {
  private readonly xpToLevel: LevelXpEntry[];

  /**
   * @param levelToXpMap A map of level to the total XP required to reach it
   */
  constructor(levelToXpMap: Record<number, number>) {
    super();
    this.xpToLevel = Object.entries(levelToXpMap)
      .map(([level, xp]) => ({ level: Number(level), xp }))
      .sort((left, right) => (left.xp < right.xp ? -1 : left.xp > right.xp ? 1 : 0));
  }

  currentLevel(xp: number): number {
    return this.findProgressInfo(xp).currentLevel;
  }

  totalXpRequired(xp: number): number {
    const info = this.findProgressInfo(xp);
    return info.nextLevelXp - info.currentLevelXp;
  }

  progress(xp: number): number {
    const info = this.findProgressInfo(xp);
    return info.currentXp - info.currentLevelXp;
  }

  progressPercentage(xp: number): number {
    const info = this.findProgressInfo(xp);
    const totalRequired = info.nextLevelXp - info.currentLevelXp;
    if (totalRequired === 0) return 0;
    return Math.trunc(((info.currentXp - info.currentLevelXp) / totalRequired) * 100);
  }

  xpRemaining(xp: number): number {
    const info = this.findProgressInfo(xp);
    return info.nextLevelXp - info.currentXp;
  }

  isMaxed(xp: number): boolean {
    return this.findProgressInfo(xp).isMaxed;
  }

  maxLevel(): number {
    return this.findProgressInfo(this.maxXp()).currentLevel;
  }

  maxXp(): number {
    if (this.xpToLevel.length === 0) return 0;
    return this.xpToLevel[this.xpToLevel.length - 1]!.xp;
  }

  private findProgressInfo(xp: number): ProgressInfo {
    if (this.xpToLevel.length === 0) {
      return {
        currentLevel: 1,
        currentLevelXp: 0,
        currentXp: 0,
        nextLevelXp: 0,
        isMaxed: true,
      };
    }

    const currentXp = this.currentXp(xp);
    const last = this.xpToLevel[this.xpToLevel.length - 1]!;
    if (currentXp >= last.xp) {
      return {
        currentLevel: last.level,
        currentLevelXp: last.xp,
        currentXp: last.xp,
        nextLevelXp: last.xp,
        isMaxed: true,
      };
    }

    let floor: LevelXpEntry = { level: 1, xp: 0 };
    let ceil: LevelXpEntry = this.xpToLevel[0]!;
    for (let i = 0; i < this.xpToLevel.length; i++) {
      const entry = this.xpToLevel[i]!;
      if (entry.xp <= currentXp) {
        floor = entry;
        continue;
      }
      ceil = entry;
      break;
    }

    const levelDifference = ceil.level - floor.level;
    const xpDifference = ceil.xp - floor.xp;
    const xpPerLevel = xpDifference / levelDifference;
    const interpolationProgress = currentXp - floor.xp;
    let levelSteps = Math.min(Math.max(Math.trunc(interpolationProgress / xpPerLevel), 0), levelDifference - 1);

    let currentLevel = floor.level + levelSteps;
    let currentLevelXp = floor.xp + Math.trunc(xpPerLevel * levelSteps);
    let nextLevelXp: number;

    if (levelSteps === levelDifference - 1) {
      nextLevelXp = ceil.xp;
    } else {
      nextLevelXp = floor.xp + Math.trunc(xpPerLevel * (levelSteps + 1));
      if (currentXp >= nextLevelXp) {
        levelSteps += 1;
        currentLevel = floor.level + levelSteps;
        currentLevelXp = floor.xp + Math.trunc(xpPerLevel * levelSteps);
        nextLevelXp =
          levelSteps === levelDifference ? ceil.xp : floor.xp + Math.trunc(xpPerLevel * (levelSteps + 1));
      }
    }

    return {
      currentLevel,
      currentLevelXp,
      currentXp,
      nextLevelXp,
      isMaxed: false,
    };
  }
}
