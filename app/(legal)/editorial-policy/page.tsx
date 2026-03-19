"use client"

import { ShieldCheck, CheckCircle, Scale, FileCheck } from "lucide-react"
import { useLegalLang } from "../legalLangContext"

export default function EditorialPolicyPage(){

const { lang } = useLegalLang()

const content = {

en:{
title:"Editorial Policy",

intro:"Nepal Network Television (NNTV) follows strict editorial standards to ensure accuracy, independence and responsible journalism.",

accuracyTitle:"Accuracy & Fact-Checking",
accuracyText:"All stories published on NNTV undergo editorial verification before publication.",

independenceTitle:"Editorial Independence",
independenceText:"NNTV operates independently from political or commercial influence.",

balanceTitle:"Fairness & Balance",
balanceText:"We aim to present news with balance and context.",

correctionTitle:"Corrections Policy",
correctionText:"If factual errors occur, NNTV corrects them transparently and promptly.",

principlesTitle:"Our Journalism Principles",

p1:"Accuracy and verification of information",
p2:"Independence from political and corporate influence",
p3:"Transparency in reporting",
p4:"Respect for ethical journalism",
p5:"Accountability and corrections",

responsibilityTitle:"Editorial Responsibility",

responsibilityText:"NNTV maintains responsible journalism and transparency in reporting."
},

np:{
title:"सम्पादकीय नीति",

intro:"नेपाल नेटवर्क टेलिभिजन (NNTV) ले सत्य, निष्पक्षता र जिम्मेवार पत्रकारितालाई प्राथमिकता दिन्छ।",

accuracyTitle:"सत्यता र तथ्य जाँच",
accuracyText:"NNTV मा प्रकाशित सबै समाचारहरू सम्पादकीय जाँचपछि मात्र प्रकाशित गरिन्छन्।",

independenceTitle:"सम्पादकीय स्वतन्त्रता",
independenceText:"NNTV कुनै पनि राजनीतिक वा व्यावसायिक दबाबबाट स्वतन्त्र रूपमा सञ्चालन हुन्छ।",

balanceTitle:"निष्पक्षता र सन्तुलन",
balanceText:"हामी समाचारलाई सन्तुलित रूपमा प्रस्तुत गर्न प्रयास गर्छौं।",

correctionTitle:"सुधार नीति",
correctionText:"यदि त्रुटि भेटिएमा NNTV ले तुरुन्त सुधार गर्दछ।",

principlesTitle:"हाम्रो पत्रकारिता सिद्धान्त",

p1:"सूचनाको सत्यता",
p2:"राजनीतिक प्रभावबाट स्वतन्त्रता",
p3:"पारदर्शिता",
p4:"नैतिक पत्रकारिता",
p5:"त्रुटि सुधार",

responsibilityTitle:"सम्पादकीय जिम्मेवारी",

responsibilityText:"नेपाल नेटवर्क टेलिभिजन जिम्मेवार पत्रकारिताप्रति प्रतिबद्ध छ।"
}

}

const t = content[lang]

return(

<main className="max-w-5xl mx-auto px-6 py-20">

<section className="text-center mb-16">

<h1 className="text-4xl md:text-5xl font-serif mb-6">
{t.title}
</h1>

<p className="text-gray-600 max-w-3xl mx-auto">
{t.intro}
</p>

</section>

<section className="grid md:grid-cols-2 gap-10 mb-20">

<PolicyCard icon={<CheckCircle size={32}/> } title={t.accuracyTitle} text={t.accuracyText}/>
<PolicyCard icon={<ShieldCheck size={32}/> } title={t.independenceTitle} text={t.independenceText}/>
<PolicyCard icon={<Scale size={32}/> } title={t.balanceTitle} text={t.balanceText}/>
<PolicyCard icon={<FileCheck size={32}/> } title={t.correctionTitle} text={t.correctionText}/>

</section>

<section className="mb-20">

<h2 className="text-2xl font-serif mb-6">
{t.principlesTitle}
</h2>

<ul className="space-y-3 text-gray-600">

<li>• {t.p1}</li>
<li>• {t.p2}</li>
<li>• {t.p3}</li>
<li>• {t.p4}</li>
<li>• {t.p5}</li>

</ul>

</section>

<section className="border-t pt-10">

<h2 className="text-xl font-serif mb-4">
{t.responsibilityTitle}
</h2>

<p className="text-gray-600">
{t.responsibilityText}
</p>

</section>

</main>

)

}

function PolicyCard({icon,title,text}:{icon:React.ReactNode,title:string,text:string}){

return(

<div className="bg-gray-50 p-8 rounded-xl">

<div className="text-[#4b0055] mb-4">
{icon}
</div>

<h3 className="font-semibold text-lg mb-2">
{title}
</h3>

<p className="text-gray-600 text-sm">
{text}
</p>

</div>

)

}
