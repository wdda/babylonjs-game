export const Level = {
  saveCompletedLevel (levelId: number | string) {
    if (!this.checkCompletedLevelId(levelId)) {
      const levelsIds = this.getCompletedLevelsIds()
      levelsIds.push(String(levelId))

      localStorage.setItem('completedLevelsIds', levelsIds.join(','))
    }

    this.setLastCompletedLevelId(String(levelId))
  },
  getCompletedLevelsIds () {
    const completedLevels = localStorage.getItem('completedLevelsIds')
    return completedLevels ? completedLevels.split(',') : []
  },
  getLastCompletedLevelId () {
    return Number(localStorage.getItem('lastCompletedLevelsId'))
  },
  setLastCompletedLevelId(levelId: string) {
    return localStorage.setItem('lastCompletedLevelsId', levelId)
  },
  checkCompletedLevelId(levelId: number | string) {
    const ids = this.getCompletedLevelsIds()
    return ids.find(id => id == levelId)
  }
}