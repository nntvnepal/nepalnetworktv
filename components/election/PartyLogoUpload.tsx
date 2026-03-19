"use client"

import { useRef } from "react"

export default function PartyLogoUpload({
  id,
  logo,
  name
}:{
  id:string
  logo?:string | null
  name:string
}){

const fileRef = useRef<HTMLInputElement>(null)

function openPicker(){
  fileRef.current?.click()
}

async function upload(file:File){

const formData = new FormData()

formData.append("file",file)
formData.append("partyId",id)

await fetch("/api/elections/parties/logo",{
method:"POST",
body:formData
})

location.reload()

}

function handleChange(e:React.ChangeEvent<HTMLInputElement>){

const file = e.target.files?.[0]

if(file){
upload(file)
}

}

return(

<div
onClick={openPicker}
className="w-10 h-10 rounded border border-purple-700 bg-purple-900 flex items-center justify-center overflow-hidden cursor-pointer"
>

{logo ? (

<img
src={logo}
alt={name}
className="w-full h-full object-cover"
/>

):(

<span className="text-xs text-purple-300">
Logo
</span>

)}

<input
ref={fileRef}
type="file"
accept="image/*"
className="hidden"
onChange={handleChange}
/>

</div>

)

}