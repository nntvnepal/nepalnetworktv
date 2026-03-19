"use client"

import { Globe, ShieldCheck, Lightbulb, Newspaper } from "lucide-react"
import { useLegalLang } from "../legalLangContext"

export default function AboutPage(){

const { lang } = useLegalLang()

const content = {

en:{
title:"About Nepal Network Television",

intro:
"Nepal Network Television (NNTV) is a modern digital media platform delivering credible journalism, engaging storytelling and diverse content across news, entertainment and culture.",

tagline:"Media Beyond the Nation",

visionTitle:"Our Vision",
visionText:
"To become a trusted digital media network that informs, educates and inspires audiences through reliable journalism and creative storytelling.",

integrityTitle:"Editorial Integrity",
integrityText:
"Our newsroom follows strong editorial principles ensuring accuracy, fairness and responsible journalism in every story we publish.",

missionTitle:"Our Mission",
missionText:
"To provide fact-based reporting, meaningful analysis and engaging content that helps audiences understand society, culture and global developments.",

coverageTitle:"What We Cover",

c1:"Politics & Governance",
c2:"Economy & Business",
c3:"Technology & Innovation",
c4:"Entertainment & Culture",

journalismTitle:"Responsible Journalism",

journalismText1:
"NNTV believes journalism plays a vital role in strengthening democratic dialogue and public awareness. Our platform focuses on context-driven reporting, verified information and balanced perspectives.",

journalismText2:
"Alongside news and analysis, NNTV also delivers engaging content covering entertainment, lifestyle, arts, digital culture and human-interest stories that reflect the evolving voice of modern Nepal.",

orgTitle:"Our Platform",

orgText:
"Nepal Network Television (NNTV) operates as an independent digital media initiative committed to credible journalism, creative media production and responsible storytelling for a global Nepali audience."
},

np:{
title:"नेपाल नेटवर्क टेलिभिजनको बारेमा",

intro:
"नेपाल नेटवर्क टेलिभिजन (NNTV) आधुनिक डिजिटल मिडिया प्लेटफर्म हो जसले समाचार, मनोरञ्जन, संस्कृति र समाजसँग सम्बन्धित विविध सामग्री प्रस्तुत गर्दछ।",

tagline:"राष्ट्रभन्दा परको सञ्चार",

visionTitle:"हाम्रो दृष्टि",
visionText:
"विश्वसनीय पत्रकारिता र सिर्जनात्मक कथनमार्फत दर्शक तथा पाठकलाई जानकारी, शिक्षा र प्रेरणा प्रदान गर्ने भरोसायोग्य डिजिटल मिडिया नेटवर्क बन्नु।",

integrityTitle:"सम्पादकीय निष्ठा",
integrityText:
"हाम्रो समाचार कक्षले प्रत्येक समाचारमा सत्यता, निष्पक्षता र जिम्मेवार पत्रकारितालाई प्राथमिकता दिँदै कडा सम्पादकीय मापदण्ड पालना गर्दछ।",

missionTitle:"हाम्रो लक्ष्य",
missionText:
"तथ्यमा आधारित समाचार, गहिरो विश्लेषण र आकर्षक सामग्री प्रस्तुत गर्दै समाज, संस्कृति र विश्वका घटनाक्रमलाई बुझ्न सहयोग गर्नु।",

coverageTitle:"हामीले कभर गर्ने विषयहरू",

c1:"राजनीति तथा शासन",
c2:"अर्थतन्त्र तथा व्यापार",
c3:"प्रविधि तथा नवप्रवर्तन",
c4:"मनोरञ्जन तथा संस्कृति",

journalismTitle:"जिम्मेवार पत्रकारिता",

journalismText1:
"NNTV ले पत्रकारितालाई लोकतान्त्रिक संवादलाई सुदृढ बनाउने महत्वपूर्ण माध्यमका रूपमा हेर्छ। हाम्रो प्लेटफर्मले प्रमाणित सूचना, सन्तुलित दृष्टिकोण र सन्दर्भसहित समाचार प्रस्तुत गर्दछ।",

journalismText2:
"समाचार र विश्लेषणका साथै NNTV ले मनोरञ्जन, जीवनशैली, कला, डिजिटल संस्कृति तथा मानव कथासँग सम्बन्धित सामग्री पनि प्रस्तुत गर्दछ जसले आधुनिक नेपालको विविध आवाजलाई प्रतिबिम्बित गर्दछ।",

orgTitle:"हाम्रो प्लेटफर्म",

orgText:
"नेपाल नेटवर्क टेलिभिजन (NNTV) विश्वभरका नेपाली दर्शक तथा पाठकका लागि विश्वसनीय पत्रकारिता, सिर्जनात्मक मिडिया सामग्री र जिम्मेवार कथन प्रस्तुत गर्ने स्वतन्त्र डिजिटल मिडिया प्लेटफर्म हो।"
}

}

const t = content[lang]

return(

<main className="max-w-5xl mx-auto px-6 py-20">

{/* HERO */}

<section className="mb-16 text-center">

<h1 className="text-4xl md:text-5xl font-serif mb-6">
{t.title}
</h1>

<p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
{t.intro}
</p>

<p className="text-gray-500 mt-4">
<strong>NNTV</strong> — {t.tagline}
</p>

</section>

{/* VISION + MISSION */}

<section className="grid md:grid-cols-3 gap-8 mb-20">

<div className="bg-gray-50 p-8 rounded-xl text-center">

<Globe className="mx-auto mb-4 text-[#4b0055]" size={34}/>

<h3 className="font-semibold text-lg mb-2">
{t.visionTitle}
</h3>

<p className="text-gray-600 text-sm">
{t.visionText}
</p>

</div>

<div className="bg-gray-50 p-8 rounded-xl text-center">

<ShieldCheck className="mx-auto mb-4 text-[#4b0055]" size={34}/>

<h3 className="font-semibold text-lg mb-2">
{t.integrityTitle}
</h3>

<p className="text-gray-600 text-sm">
{t.integrityText}
</p>

</div>

<div className="bg-gray-50 p-8 rounded-xl text-center">

<Lightbulb className="mx-auto mb-4 text-[#4b0055]" size={34}/>

<h3 className="font-semibold text-lg mb-2">
{t.missionTitle}
</h3>

<p className="text-gray-600 text-sm">
{t.missionText}
</p>

</div>

</section>

{/* COVERAGE */}

<section className="mb-20">

<h2 className="text-2xl font-serif mb-8 text-center">
{t.coverageTitle}
</h2>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

<CoverageCard title={t.c1}/>
<CoverageCard title={t.c2}/>
<CoverageCard title={t.c3}/>
<CoverageCard title={t.c4}/>

</div>

</section>

{/* JOURNALISM */}

<section className="mb-20">

<h2 className="text-2xl font-serif mb-6">
{t.journalismTitle}
</h2>

<p className="text-gray-600 leading-relaxed mb-6">
{t.journalismText1}
</p>

<p className="text-gray-600 leading-relaxed">
{t.journalismText2}
</p>

</section>

{/* ORGANIZATION */}

<section className="border-t pt-10">

<h2 className="text-xl font-serif mb-4">
{t.orgTitle}
</h2>

<p className="text-gray-600">
{t.orgText}
</p>

</section>

</main>

)

}

function CoverageCard({ title }:{ title:string }){

return(

<div className="bg-white border p-6 rounded-lg text-center hover:shadow-md transition">

<Newspaper className="mx-auto mb-3 text-[#4b0055]" size={28}/>

<p className="font-medium">
{title}
</p>

</div>

)

}
