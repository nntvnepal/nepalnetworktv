import Link from "next/link"

interface Props{
title:string
link?:string
}

export default function SectionHeader({title,link}:Props){

return(

<div className="mb-6">

<div className="flex items-center justify-between group">

<div className="flex items-center gap-3">

<span className="w-[5px] h-7 rounded bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 shadow-[0_0_10px_rgba(234,179,8,0.7)]"></span>

<h2 className="text-xl font-semibold text-gray-900 tracking-tight group-hover:text-purple-800 transition">
{title}
</h2>

</div>

{link &&(

<Link
href={link}
className="flex items-center gap-1 text-sm font-medium text-purple-700 hover:text-purple-900 transition"
>

सबै हेर्नुहोस्

<span className="transition transform group-hover:translate-x-1">
→
</span>

</Link>

)}

</div>

{/* Animated divider */}

<div className="relative mt-3 h-[3px] w-full overflow-hidden rounded bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900">

<div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent"></div>

</div>

</div>

)

}
