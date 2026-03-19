"use client"

import { useState } from "react"

export default function Editor({ value="", onChange }:any){

const [text,setText] = useState(value)

function handleChange(e:any){
setText(e.target.value)
onChange && onChange(e.target.value)
}

return(

<textarea
value={text}
onChange={handleChange}
className="w-full min-h-[250px] border rounded p-3"
placeholder="Write article content..."
/>

)

}
