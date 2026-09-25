export function shouldResetThemeSelection(themeId, hasSession, unlockedThemes, hiddenThemeIds) {
  return hiddenThemeIds.has(themeId) && (!hasSession || !unlockedThemes.includes(themeId))
}
