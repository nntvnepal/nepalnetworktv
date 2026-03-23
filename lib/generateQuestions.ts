import { questionBank } from "./questions"

export function generateLevelQuestions(
  subject: string,
  classLevel: string,
  count = 5
) {
  const pool = questionBank[subject]

  const filtered = pool.filter(
    (q) => q.classLevel === classLevel
  )

  const shuffled = filtered.sort(() => 0.5 - Math.random())

  return shuffled.slice(0, count)
}