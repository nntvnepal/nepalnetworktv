"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function HeaderMenu({ categories = [] }: any){

const [open,setOpen] = useState(false)
const pathname = usePathname()

const mainMenu = categories.slice(0,7)
const moreMenu = categories.slice(7)

function closeMenu(){
setOpen(false)
}

/* AUTO CLOSE + ESC CLOSE */

useEffect(()=>{

if(!open) return

const timer=setTimeout(()=>setOpen(false),15000)

function esc(e:any){
if(e.key==="Escape") setOpen(false)
}

document.addEventListener("keydown",esc)
document.body.style.overflow="hidden"

return ()=>{
clearTimeout(timer)
document.removeEventListener("keydown",esc)
document.body.style.overflow="auto"
}

},[open])

return(

<div className="flex items-center">

{/* DESKTOP MENU */}

<nav className="hidden md:flex items-center gap-7 text-sm relative">

<Link
href="/"
className={`nav-link ${pathname === "/" ? "menu-active" : ""}`}
>
गृहपृष्ठ
</Link>

{mainMenu.map((cat:any)=>{

const url=`/category/${cat.slug}`
const active = pathname === url

return(

<Link
key={cat.id}
href={url}
className={`nav-link ${active ? "menu-active" : ""}`}
>
{cat.name}
</Link>

)

})}

{moreMenu.length > 0 && (

<div className="menu-dropdown">

<span className="nav-link">
अन्य ▾
</span>

<div className="menu-dropdown-content">

{moreMenu.map((cat:any)=>{

const url=`/category/${cat.slug}`

return(

<Link
key={cat.id}
href={url}
>
{cat.name}
</Link>

)

})}

</div>

</div>

)}

<Link
href="/astrology"
className={`nav-link ${pathname === "/astrology" ? "menu-active" : ""}`}
>
राशिफल
</Link>

</nav>

{/* HAMBURGER */}

<button
onClick={()=>setOpen(true)}
className="md:hidden text-2xl ml-4"
aria-label="Open Menu"
>
☰
</button>

{/* MOBILE MENU */}

{open && (

<div className="fixed inset-0 z-50">

{/* BACKDROP */}

<div
className="absolute inset-0 bg-black/60 backdrop-blur-sm"
onClick={closeMenu}
/>

{/* SIDEBAR */}

<div className="relative bg-white w-[80%] max-w-[300px] h-full p-6 overflow-y-auto shadow-2xl animate-slideMenu">

<button
onClick={closeMenu}
className="text-xl mb-6"
aria-label="Close Menu"
>
✕
</button>

<div className="flex flex-col gap-2 text-sm">

<Link
href="/"
onClick={closeMenu}
className={`menu-link ${pathname === "/" ? "menu-active" : ""}`}
>
गृहपृष्ठ
</Link>

{categories.map((cat:any)=>{

const url=`/category/${cat.slug}`
const active = pathname === url

return(

<Link
key={cat.id}
href={url}
onClick={closeMenu}
className={`menu-link ${active ? "menu-active" : ""}`}
>
{cat.name}
</Link>

)

})}

<Link
href="/astrology"
onClick={closeMenu}
className={`menu-link ${pathname === "/astrology" ? "menu-active" : ""}`}
>
राशिफल
</Link>

</div>

</div>

</div>

)}

</div>

)

}