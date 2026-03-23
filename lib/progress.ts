export const saveProgress = (data: any) => {
  localStorage.setItem("practice_progress", JSON.stringify(data))
}

export const getProgress = () => {
  const data = localStorage.getItem("practice_progress")
  return data ? JSON.parse(data) : null
}

export const clearProgress = () => {
  localStorage.removeItem("practice_progress")
}