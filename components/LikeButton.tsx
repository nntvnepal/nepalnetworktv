"use client"

import { useState } from "react"

export default function LikeButton(){

const [likes,setLikes] = useState(0)

return(

<button
onClick={()=>setLikes(likes+1)}
className="bg-purple-600 text-white px-4 py-2 rounded"
>

👍 Like {likes}

</button>

)

}