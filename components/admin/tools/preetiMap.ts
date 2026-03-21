// 🔥 FULL ENGINE START (EXPANDED BASE)

//////////////////////////////////////////////////////
// BASE MAP (EXTENDED)
//////////////////////////////////////////////////////

const map: [string, string][] = [

  // Vowels
  ["cf‘", "ऑ"],
  ["cf}", "औ"],
  ["cf", "आ"],
  ["c", "अ"],

  ["O{", "ई"],
  ["O", "इ"],

  ["pm", "ऊ"],
  ["p", "उ"],

  ["P]", "ऐ"],
  ["P", "ए"],

  // Consonants
  ["s", "स"],
  ["k", "क"],
  ["v", "ख"],
  ["u", "ह"],
  ["y", "य"],
  ["r", "र"],
  ["n", "न"],
  ["d", "म"],
  ["t", "त"],
  ["b", "ब"],
  ["w", "व"],
  ["g", "ग"],
  ["h", "ज"],
  ["j", "झ"],
  ["q", "ट"],
  ["z", "ड"],
  ["x", "ढ"],
  ["Q", "ठ"],
  ["Z", "ढ"],
  ["X", "ऋ"],

  // Common combos
  ["km", "फ"],
  ["em", "छ"],
  ["tm", "थ"],

  // Matras
  ["f", "ा"],
  ["l", "ि"],
  ["L", "ी"],
  ["'", "ु"],
  ['"', "ू"],
  ["[", "े"],
  ["{", "ै"],
  ["]", "ो"],
  ["}", "ौ"],

  // Halant
  ["\\", "्"],

  // Numbers
  ["!", "१"],
  ["@", "२"],
  ["#", "३"],
  ["$", "४"],
  ["%", "५"],
  ["^", "६"],
  ["&", "७"],
  ["*", "८"],
  ["(", "९"],
  [")", "०"],

  [" ", " "],
]

//////////////////////////////////////////////////////
// SORT
//////////////////////////////////////////////////////

function sortMap(map: [string, string][]) {
  return [...map].sort((a, b) => b[0].length - a[0].length)
}

const sorted = sortMap(map)

const reverse = sortMap(sorted.map(([p, u]) => [u, p]))

//////////////////////////////////////////////////////
// CORE REPLACE
//////////////////////////////////////////////////////

function replaceAll(text: string, map: [string, string][]) {
  let result = text

  for (const [from, to] of map) {
    result = result.split(from).join(to)
  }

  return result
}

//////////////////////////////////////////////////////
// 🔥 ADVANCED FIXES
//////////////////////////////////////////////////////

// 1. ि reposition
function fixMatra(text: string) {
  return text.replace(/ि([क-ह])/g, "$1ि")
}

// 2. Halant cleanup
function fixHalant(text: string) {
  return text.replace(/्\s/g, "")
}

// 3. Special combos (VERY IMPORTANT)
function fixSpecial(text: string) {
  return text
    .replace(/क्ि/g, "कि")
    .replace(/त्ि/g, "ति")
    .replace(/न्ि/g, "नि")
    .replace(/प्ि/g, "पि")
}

// 4. Known words (can expand later)
function fixWords(text: string) {
  return text
    .replace(/नेपािल/g, "नेपाली")
}

//////////////////////////////////////////////////////
// FINAL FUNCTIONS
//////////////////////////////////////////////////////

export function convertPreetiToUnicode(text: string) {
  let result = replaceAll(text, sorted)

  result = fixMatra(result)
  result = fixHalant(result)
  result = fixSpecial(result)
  result = fixWords(result)

  return result
}

export function convertUnicodeToPreeti(text: string) {
  return replaceAll(text, reverse)
}