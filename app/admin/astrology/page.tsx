"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function AstrologyDashboard() {

const zodiac = [

["मेष","aries"],
["वृष","taurus"],
["मिथुन","gemini"],
["कर्क","cancer"],
["सिंह","leo"],
["कन्या","virgo"],
["तुला","libra"],
["वृश्चिक","scorpio"],
["धनु","sagittarius"],
["मकर","capricorn"],
["कुम्भ","aquarius"],
["मीन","pisces"]

];

const [posted,setPosted]=useState<string[]>([]);
const [stats,setStats]=useState({published:0,pending:12});

const [today,setToday]=useState("");

useEffect(()=>{

const date = new Date().toLocaleDateString("ne-NP",{
day:"numeric",
month:"long",
year:"numeric"
});

setToday(date);

},[]);
/* ================= FETCH ================= */

useEffect(()=>{

async function load(){

try{

const res = await fetch("/api/horoscope",{cache:"no-store"});
const data = await res.json();

if(data?.success){

const signs = data.horoscopes.map((h:any)=>h.zodiacSign);

setPosted(signs);

setStats({
published:signs.length,
pending:12-signs.length
});

}

}catch(e){

console.log("Horoscope stats error",e);

}

}

load();

},[]);

/* ================= CLICK ================= */

function handleClick(sign:string){

if(posted.includes(sign)){

const confirmEdit = confirm(
"⚠️ आजको राशिफल पहिले नै पोस्ट गरिएको छ।\n\nEdit गर्न चाहनुहुन्छ?"
);

if(!confirmEdit) return;

}

window.location.href = `/admin/astrology/${sign}`;

}

/* ================= UI ================= */

return(

<div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1323] to-[#111827] text-white p-10">

{/* HEADER */}

<h1 className="text-3xl font-bold mb-3 flex items-center gap-2">
🔮 आजको राशिफल व्यवस्थापन
</h1>

<p className="text-gray-400 mb-10">
{today}
</p>

{/* DASHBOARD STATS */}

<div className="grid md:grid-cols-3 gap-6 mb-14">

<div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl">
<p className="text-sm text-gray-300">कुल राशिहरू</p>
<h2 className="text-3xl font-bold mt-2">12</h2>
</div>

<div className="bg-green-900/30 backdrop-blur-lg border border-green-500/20 p-6 rounded-xl">
<p className="text-sm text-gray-300">प्रकाशित राशिफल</p>
<h2 className="text-3xl font-bold mt-2 text-green-400">
{stats.published}
</h2>
</div>

<div className="bg-yellow-900/30 backdrop-blur-lg border border-yellow-500/20 p-6 rounded-xl">
<p className="text-sm text-gray-300">लेख्न बाँकी</p>
<h2 className="text-3xl font-bold mt-2 text-yellow-400">
{stats.pending}
</h2>
</div>

</div>

{/* ZODIAC GRID */}

<h2 className="text-xl font-semibold mb-8">
राशि चयन गर्नुहोस्
</h2>

<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">

{zodiac.map(([name,icon],i)=>{

const isPosted = posted.includes(icon);

return(

<div
key={i}
onClick={()=>handleClick(icon)}
className="
cursor-pointer
text-center
group
relative
"
>

{/* GLASS CARD */}

<div
className="
w-24
h-24
mx-auto
rounded-full
bg-gradient-to-br from-purple-600 to-purple-900
flex items-center justify-center
shadow-2xl
border border-white/10
backdrop-blur-xl
group-hover:scale-110
group-hover:shadow-purple-500/40
transition
"
>

<img
src={`/zodiac/${icon}.png`}
alt={name}
className="w-12 h-12 brightness-0 invert"
/>

</div>

{/* NAME */}

<p className="mt-3 font-medium text-gray-200">
{name}
</p>

{/* POSTED BADGE */}

{isPosted && (

<div className="
absolute
top-0
right-2
bg-green-500
w-6
h-6
flex
items-center
justify-center
rounded-full
shadow-lg
">

✓

</div>

)}

</div>

);

})}

</div>

</div>

);

}