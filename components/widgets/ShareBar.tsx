"use client"

import { useState } from "react"
import {
FaFacebookF,
FaWhatsapp,
FaXTwitter,
FaLink
} from "react-icons/fa6"

export default function ShareBar(){

const [copied,setCopied] = useState(false)

const url =
typeof window !== "undefined"
? window.location.href
: ""

//////////////////////////////////////////////////
// SHARE HANDLER
//////////////////////////////////////////////////

function share(platform:string){

let shareUrl=""

if(platform==="facebook"){
shareUrl=`https://www.facebook.com/sharer/sharer.php?u=${url}`
}

if(platform==="twitter"){
shareUrl=`https://twitter.com/intent/tweet?url=${url}`
}

if(platform==="whatsapp"){
shareUrl=`https://api.whatsapp.com/send?text=${url}`
}

window.open(shareUrl,"_blank","noopener,noreferrer")

}

//////////////////////////////////////////////////
// COPY LINK
//////////////////////////////////////////////////

async function copyLink(){

try{

await navigator.clipboard.writeText(url)

setCopied(true)

setTimeout(()=>{
setCopied(false)
},2000)

}catch(e){
console.error("copy failed")
}

}

//////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////

return(

<div className="hidden lg:block fixed right-6 top-[40%] z-[60] animate-shareSlide">

<div
className="
backdrop-blur-md
bg-white/40
border border-white/40
shadow-xl
rounded-2xl
px-2 py-3
flex flex-col gap-3
"
>

{/* FACEBOOK */}

<button
onClick={()=>share("facebook")}
className="
w-10 h-10
flex items-center justify-center
rounded-full
bg-[#1877F2]
text-white
hover:scale-110
transition
"
>
<FaFacebookF size={15}/>
</button>

{/* TWITTER */}

<button
onClick={()=>share("twitter")}
className="
w-10 h-10
flex items-center justify-center
rounded-full
bg-black
text-white
hover:scale-110
transition
"
>
<FaXTwitter size={15}/>
</button>

{/* WHATSAPP */}

<button
onClick={()=>share("whatsapp")}
className="
w-10 h-10
flex items-center justify-center
rounded-full
bg-[#25D366]
text-white
hover:scale-110
transition
"
>
<FaWhatsapp size={15}/>
</button>

{/* COPY LINK */}

<button
onClick={copyLink}
className="
w-10 h-10
flex items-center justify-center
rounded-full
bg-gray-800
text-white
hover:scale-110
transition
"
>
<FaLink size={14}/>
</button>

{copied &&(

<div className="text-[10px] text-center text-gray-700">
Copied
</div>

)}

</div>

</div>

)

}