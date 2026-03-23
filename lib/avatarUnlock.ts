export const getUnlockedCount = (points: number) => {
  if (points >= 200) return 12
  if (points >= 100) return 10
  if (points >= 50) return 7
  return 5 // default free
}