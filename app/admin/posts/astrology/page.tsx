"use client";

import Link from "next/link";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function AstrologyDashboard(){

const zodiac=[

{slug:"aries",name:"♈ Aries"},
{slug:"taurus",name:"♉ Taurus"},
{slug:"gemini",name:"♊ Gemini"},
{slug:"cancer",name:"♋ Cancer"},
{slug:"leo",name:"♌ Leo"},
{slug:"virgo",name:"♍ Virgo"},
{slug:"libra",name:"♎ Libra"},
{slug:"scorpio",name:"♏ Scorpio"},
{slug:"sagittarius",name:"♐ Sagittarius"},
{slug:"capricorn",name:"♑ Capricorn"},
{slug:"aquarius",name:"♒ Aquarius"},
{slug:"pisces",name:"♓ Pisces"}

];

return(

<div className="min-h-screen bg-[#0f172a] text-white p-10">

<h1 className="text-3xl font-bold mb-10">

🔮 Daily Horoscope Dashboard

</h1>


<div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">

{zodiac.map(z=>(

<div
key={z.slug}
className="bg-[#1e293b] p-6 rounded-xl shadow hover:scale-105 transition">

<h2 className="text-xl font-semibold mb-4">

{z.name}

</h2>

<Link

href={`/admin/posts/astrology/${z.slug}`}

className="bg-purple-600 px-4 py-2 rounded inline-block hover:bg-purple-700">

Edit Horoscope

</Link>

</div>

))}

</div>

</div>

);

}