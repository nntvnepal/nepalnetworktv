"use client"

import { useEffect, useState } from "react"

export default function DarkModeToggle(){

const [mounted,setMounted] = useState(false)
const [dark,setDark] = useState(false)

//////////////////////////////////////////////////////
// INIT THEME
//////////////////////////////////////////////////////

useEffect(()=>{

setMounted(true)

const saved = localStorage.getItem("theme")

if(saved){

const isDark = saved === "dark"

setDark(isDark)

document.documentElement.classList.toggle("dark",isDark)

}else{

const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches

setDark(systemDark)

document.documentElement.classList.toggle("dark",systemDark)

}

},[])

//////////////////////////////////////////////////////
// TOGGLE
//////////////////////////////////////////////////////

function toggleTheme(){

const newTheme = !dark

setDark(newTheme)

document.documentElement.classList.toggle("dark",newTheme)

localStorage.setItem("theme",newTheme ? "dark" : "light")

}

//////////////////////////////////////////////////////
// PREVENT HYDRATION MISMATCH
//////////////////////////////////////////////////////

if(!mounted) return null

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<button
onClick={toggleTheme}
className="px-3 py-1 border rounded text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
>

{dark ? "☀ Light" : "🌙 Dark"}

</button>

)

}