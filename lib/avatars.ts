// 🎭 TOTAL AVATARS COUNT (change this only)
const TOTAL_AVATARS = 30

// 🎯 AUTO GENERATE ALL AVATARS
export const avatars: string[] = Array.from(
  { length: TOTAL_AVATARS },
  (_, i) => `/avatars/avatar${i + 1}.png`
)


// 🎲 RANDOM AVATAR (visitor ke liye)
export function getRandomAvatar(): string {
  return avatars[Math.floor(Math.random() * avatars.length)]
}


// 👦 BOYS (optional future use)
export const boyAvatars = avatars.slice(0, 15)


// 👧 GIRLS (optional future use)
export const girlAvatars = avatars.slice(15, 30)


// 💾 SAVE AVATAR (localStorage)
export function saveAvatar(avatar: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("kids_avatar", avatar)
  }
}


// 📦 GET SAVED AVATAR
export function getSavedAvatar(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("kids_avatar")
  }
  return null
}