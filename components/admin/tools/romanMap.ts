// 🔥 BASIC ROMAN → NEPALI ENGINE

const map: [string, string][] = [
  ["nepali", "नेपाली"],
  ["ram", "राम"],
  ["krishna", "कृष्ण"],
  ["kathmandu", "काठमाडौं"],

  ["aa", "आ"],
  ["a", "अ"],
  ["i", "इ"],
  ["ee", "ई"],
  ["u", "उ"],
  ["oo", "ऊ"],
  ["e", "ए"],
  ["ai", "ऐ"],
  ["o", "ओ"],
  ["au", "औ"],

  ["ka", "क"],
  ["kha", "ख"],
  ["ga", "ग"],
  ["gha", "घ"],

  ["na", "न"],
  ["ma", "म"],
  ["pa", "प"],
  ["ba", "ब"],

  ["ra", "र"],
  ["la", "ल"],
  ["sa", "स"],
  ["ha", "ह"],
]

function sortMap(map: [string, string][]) {
  return [...map].sort((a, b) => b[0].length - a[0].length)
}

const sorted = sortMap(map)

export function convertRomanToNepali(text: string) {
  let result = text.toLowerCase()

  for (const [from, to] of sorted) {
    result = result.split(from).join(to)
  }

  return result
}