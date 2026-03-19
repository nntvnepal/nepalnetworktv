import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import AdRenderer from "@/components/ads/AdRenderer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
title: "आजको राशिफल | सबै १२ राशिको भविष्यफल",
description:
"आजको दैनिक राशिफल पढ्नुहोस्। प्रेम, करियर, स्वास्थ्य, आर्थिक अवस्था र भाग्य सम्बन्धी भविष्यफल सबै १२ राशिका लागि।",
};

/* ================= ZODIAC LIST ================= */

const zodiac = [

["Aries","मेष","aries"],
["Taurus","वृष","taurus"],
["Gemini","मिथुन","gemini"],
["Cancer","कर्क","cancer"],
["Leo","सिंह","leo"],
["Virgo","कन्या","virgo"],
["Libra","तुला","libra"],
["Scorpio","वृश्चिक","scorpio"],
["Sagittarius","धनु","sagittarius"],
["Capricorn","मकर","capricorn"],
["Aquarius","कुम्भ","aquarius"],
["Pisces","मीन","pisces"]

];

/* ================= PAGE ================= */

export default async function AstrologyPage(){

/* ---------- TODAY DATE ---------- */

const today = new Date();
today.setHours(0,0,0,0);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate()+1);

/* ---------- FETCH HOROSCOPE ---------- */

const horoscopes = await prisma.article.findMany({

where:{
isAstrology:true,
status:"approved",
horoscopeDate:{
gte:today,
lt:tomorrow
}
},

select:{
slug:true,
zodiacSign:true
}

});

/* ---------- MAP ZODIAC ---------- */

const map:any={};

horoscopes.forEach(h=>{

if(h.zodiacSign){
map[h.zodiacSign.toLowerCase()] = h.slug;
}

});


return(

<div className="max-w-6xl mx-auto px-6 pt-12 pb-24">

{/* ================= TOP AD ================= */}

<div className="flex justify-center mb-10">
<AdRenderer placement="category_top"/>
</div>


{/* ================= HEADER ================= */}

<div className="text-center mb-14">

<h1 className="text-4xl md:text-5xl font-serif text-[#0b2a6f]">
आजको राशिफल
</h1>

<p className="mt-4 text-gray-600 max-w-2xl mx-auto">
आजको दिनका लागि सबै १२ राशिको दैनिक भविष्यफल पढ्नुहोस्।
प्रेम, करियर, स्वास्थ्य र आर्थिक अवस्थाबारे ज्योतिषीय मार्गदर्शन।
</p>

<p className="mt-3 text-sm text-gray-500">

{today.toLocaleDateString("ne-NP",{
year:"numeric",
month:"long",
day:"numeric"
})}

</p>

<div className="mt-6 w-16 h-[2px] bg-[#0b2a6f] mx-auto opacity-30"></div>

</div>


{/* ================= ZODIAC GRID ================= */}

<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-16">

{zodiac.map(([eng,nep,icon]:any,i)=>{

const slug = map[eng.toLowerCase()];

const card=(

<div className="text-center group">

<div
className="
w-24 h-24
mx-auto
rounded-full
bg-gradient-to-br from-[#6b1d7c] to-[#3a0a44]
flex items-center justify-center
shadow-xl
group-hover:scale-105
transition
"
>

<img
src={`/zodiac/${icon}.png`}
alt={nep}
className="w-12 h-12 object-contain brightness-0 invert"
/>

</div>

<p className="mt-3 text-lg font-medium text-gray-800">
{nep}
</p>

</div>

);

if(slug){

return(

<Link
key={i}
href={`/astrology/${slug}`}
>
{card}
</Link>

);

}

return(

<div key={i} className="opacity-40">
{card}
</div>

);

})}

</div>


{/* ================= MIDDLE AD ================= */}

<div className="flex justify-center mb-16">
<AdRenderer placement="category_after_6_posts"/>
</div>


{/* ================= BOTTOM AD ================= */}

<div className="flex justify-center">
<AdRenderer placement="category_bottom"/>
</div>


</div>

);

}