"use client"

import { useLegalLang } from "../legalLangContext"

export default function TermsPage(){

const { lang } = useLegalLang()

const content = {

en:{
title:"Terms & Conditions",

intro:
"Welcome to Nepal Network Television (NNTV). By accessing or using our website you agree to comply with and be bound by the following Terms and Conditions. If you do not agree with any part of these terms, please discontinue the use of our website.",

useTitle:"Use of Website",

useText:
"The content published on NNTV is intended for informational, journalistic and editorial purposes. Users may read, share and reference our content for personal use. However reproduction, republication or redistribution of our materials without permission is strictly prohibited.",

ipTitle:"Intellectual Property",

ipText:
"All content published on NNTV including articles, graphics, logos, video materials and design elements are the intellectual property of Nepal Network Television unless otherwise stated. Unauthorized use, reproduction or distribution may violate copyright and intellectual property laws.",

conductTitle:"User Conduct",

conductText:
"Users agree not to misuse the website or disrupt its services. Activities including hacking, spreading malware, automated scraping, spamming or attempting unauthorized access to systems are strictly prohibited.",

linksTitle:"External Links",

linksText:
"Our website may include links to external websites or services for reference or additional information. NNTV does not control the content or policies of third-party websites and is not responsible for their practices.",

liabilityTitle:"Limitation of Liability",

liabilityText:
"NNTV strives to ensure the accuracy and reliability of information published on our platform. However we make no guarantees regarding completeness or accuracy and shall not be liable for any loss or damages resulting from the use of this website.",

changesTitle:"Changes to Terms",

changesText:
"NNTV reserves the right to modify or update these Terms & Conditions at any time. Continued use of the website after changes indicates acceptance of the updated terms.",

orgTitle:"Contact & Organization",

orgText:
"Nepal Network Television (NNTV) operates as an independent digital media platform. If you have any questions regarding these Terms & Conditions please contact us at"
},

np:{
title:"प्रयोग सर्तहरू",

intro:
"नेपाल नेटवर्क टेलिभिजन (NNTV) वेबसाइट प्रयोग गर्नुभएकोमा स्वागत छ। यस वेबसाइट प्रयोग गर्दा तपाईं यी सर्त तथा नियमहरू पालन गर्न सहमत हुनुहुन्छ। यदि तपाईं यी सर्तहरूसँग सहमत हुनुहुन्न भने कृपया वेबसाइट प्रयोग नगर्नुहोस्।",

useTitle:"वेबसाइट प्रयोग",

useText:
"NNTV मा प्रकाशित सामग्री सूचनामूलक, पत्रकारिता तथा सम्पादकीय उद्देश्यका लागि प्रदान गरिएको हो। प्रयोगकर्ताले व्यक्तिगत प्रयोगका लागि सामग्री पढ्न, साझा गर्न वा सन्दर्भ दिन सक्नुहुन्छ तर अनुमति बिना पुनःप्रकाशन वा वितरण गर्न पाइँदैन।",

ipTitle:"बौद्धिक सम्पत्ति",

ipText:
"NNTV मा प्रकाशित सबै सामग्री जस्तै लेख, चित्र, लोगो, भिडियो सामग्री तथा डिजाइन तत्वहरू नेपाल नेटवर्क टेलिभिजनको बौद्धिक सम्पत्ति हुन् जबसम्म अन्यथा उल्लेख गरिएको छैन। अनुमति बिना प्रयोग वा वितरण गर्न पाइँदैन।",

conductTitle:"प्रयोगकर्ता आचरण",

conductText:
"प्रयोगकर्ताले वेबसाइटको दुरुपयोग नगर्ने सहमति जनाउनुहुन्छ। ह्याकिङ, मालवेयर फैलाउने, स्पाम गर्ने, स्वचालित डेटा सङ्कलन गर्ने वा प्रणालीमा अनधिकृत पहुँच गर्ने गतिविधि निषेध गरिएको छ।",

linksTitle:"बाह्य लिङ्कहरू",

linksText:
"हाम्रो वेबसाइटमा अन्य वेबसाइटहरूको लिङ्क समावेश हुन सक्छ। NNTV ले ती वेबसाइटहरूको सामग्री वा नीतिहरू नियन्त्रण गर्दैन र तिनीहरूको अभ्यासको लागि जिम्मेवार हुँदैन।",

liabilityTitle:"दायित्वको सीमा",

liabilityText:
"NNTV ले वेबसाइटमा प्रकाशित जानकारी सही र विश्वसनीय बनाउन प्रयास गर्दछ तर जानकारीको पूर्णता वा शुद्धताका लागि कुनै ग्यारेन्टी प्रदान गर्दैन। वेबसाइट प्रयोगबाट हुने कुनै पनि क्षतिको लागि हामी जिम्मेवार हुने छैनौं।",

changesTitle:"सर्त परिवर्तन",

changesText:
"NNTV ले कुनै पनि समयमा यी सर्तहरू परिमार्जन वा अद्यावधिक गर्ने अधिकार राख्छ। परिवर्तनपछि वेबसाइट प्रयोग जारी राख्नु भनेको नयाँ सर्तहरू स्वीकार गर्नु हो।",

orgTitle:"सम्पर्क तथा संस्था",

orgText:
"नेपाल नेटवर्क टेलिभिजन (NNTV) एक स्वतन्त्र डिजिटल मिडिया प्लेटफर्म हो। यी सर्तहरू सम्बन्धी कुनै प्रश्न भएमा कृपया हामीलाई सम्पर्क गर्नुहोस्"
}

}

const t = content[lang]

return(

<main className="max-w-4xl mx-auto px-6 py-20">

<h1 className="text-4xl font-serif mb-10">
{t.title}
</h1>

<p className="text-gray-600 mb-8">
{t.intro}
</p>

<section className="mb-10">

<h2 className="text-2xl font-serif mb-4">
{t.useTitle}
</h2>

<p className="text-gray-600">
{t.useText}
</p>

</section>

<section className="mb-10">

<h2 className="text-2xl font-serif mb-4">
{t.ipTitle}
</h2>

<p className="text-gray-600">
{t.ipText}
</p>

</section>

<section className="mb-10">

<h2 className="text-2xl font-serif mb-4">
{t.conductTitle}
</h2>

<p className="text-gray-600">
{t.conductText}
</p>

</section>

<section className="mb-10">

<h2 className="text-2xl font-serif mb-4">
{t.linksTitle}
</h2>

<p className="text-gray-600">
{t.linksText}
</p>

</section>

<section className="mb-10">

<h2 className="text-2xl font-serif mb-4">
{t.liabilityTitle}
</h2>

<p className="text-gray-600">
{t.liabilityText}
</p>

</section>

<section className="mb-10">

<h2 className="text-2xl font-serif mb-4">
{t.changesTitle}
</h2>

<p className="text-gray-600">
{t.changesText}
</p>

</section>

<section className="border-t pt-8">

<h2 className="text-xl font-serif mb-3">
{t.orgTitle}
</h2>

<p className="text-gray-600">
{t.orgText}{" "}
<a
href="mailto:info@nntvnepal.com"
className="text-[#4b0055] hover:underline"
>
info@nntvnepal.com
</a>
</p>

</section>

</main>

)

}
