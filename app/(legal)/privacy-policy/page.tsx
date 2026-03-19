"use client"

import { useLegalLang } from "../legalLangContext"

export default function PrivacyPolicyPage(){

const { lang } = useLegalLang()

const content = {

en:{
title:"Privacy Policy",

intro:
"Nepal Network Television (NNTV) respects the privacy of its visitors and is committed to protecting personal information. This Privacy Policy explains what information we collect, how we use it and how we safeguard your data when you use our platform.",

collectTitle:"Information We Collect",

collectText:
"We may collect limited personal information such as your name, email address or other information you voluntarily provide through forms such as contact inquiries, newsletter subscriptions or feedback submissions.",

useTitle:"How We Use Your Information",

u1:"To respond to inquiries or messages",
u2:"To improve website functionality and content",
u3:"To analyze website traffic and audience engagement",
u4:"To send updates or newsletters if users subscribe",

cookiesTitle:"Cookies and Web Technologies",

cookiesText:
"NNTV may use cookies and similar technologies to enhance user experience, remember preferences and analyze website usage. These tools help us improve site performance and deliver more relevant content.",

adsTitle:"Advertising Partners",

adsText:
"Our website may display advertisements from third-party networks. These partners may use technologies such as cookies or tracking scripts to measure advertising performance and deliver relevant advertisements.",

thirdTitle:"Third-Party Privacy Policies",

thirdText:
"NNTV’s Privacy Policy does not apply to other websites or services linked from our platform. We encourage users to review the privacy policies of third-party websites for more information.",

childrenTitle:"Children's Information",

childrenText:
"NNTV does not knowingly collect personal identifiable information from children under the age of 13. If you believe a child has provided such information on our platform, please contact us so we can remove it promptly.",

consentTitle:"Consent",

consentText:
"By using the NNTV website, you agree to this Privacy Policy and consent to the collection and use of information in accordance with this policy.",

orgTitle:"Contact & Organization",

orgText:
"Nepal Network Television (NNTV) is an independent digital media platform. For any privacy-related questions or concerns please contact us at"
},

np:{
title:"गोपनीयता नीति",

intro:
"नेपाल नेटवर्क टेलिभिजन (NNTV) आफ्ना प्रयोगकर्ताहरूको गोपनीयतालाई सम्मान गर्दछ र व्यक्तिगत जानकारीको सुरक्षा गर्न प्रतिबद्ध छ। यस गोपनीयता नीतिले हामीले कस्तो जानकारी सङ्कलन गर्छौं, त्यसलाई कसरी प्रयोग गर्छौं र कसरी सुरक्षित राख्छौं भन्ने स्पष्ट गर्दछ।",

collectTitle:"हामीले सङ्कलन गर्ने जानकारी",

collectText:
"हामीले सीमित व्यक्तिगत जानकारी जस्तै तपाईंको नाम, इमेल ठेगाना वा सम्पर्क फारम, न्यूजलेटर सदस्यता वा प्रतिक्रिया मार्फत तपाईंले स्वेच्छाले प्रदान गर्नुभएको जानकारी सङ्कलन गर्न सक्छौं।",

useTitle:"हामी जानकारी कसरी प्रयोग गर्छौं",

u1:"प्रश्न वा सन्देशको जवाफ दिन",
u2:"वेबसाइट सामग्री र प्रयोगकर्ता अनुभव सुधार गर्न",
u3:"वेबसाइट ट्राफिक र प्रयोग ढाँचा विश्लेषण गर्न",
u4:"सदस्यता लिएका प्रयोगकर्तालाई अपडेट वा न्यूजलेटर पठाउन",

cookiesTitle:"कुकीहरू र वेब प्रविधि",

cookiesText:
"NNTV ले प्रयोगकर्ता अनुभव सुधार गर्न, प्राथमिकताहरू सम्झन र वेबसाइट प्रयोग विश्लेषण गर्न कुकीहरू तथा समान प्रविधिहरू प्रयोग गर्न सक्छ।",

adsTitle:"विज्ञापन साझेदार",

adsText:
"हाम्रो वेबसाइटमा तेस्रो पक्षका विज्ञापन नेटवर्कहरूको विज्ञापन देखिन सक्छ। यी साझेदारहरूले विज्ञापनको प्रभावकारिता मापन गर्न कुकी वा ट्र्याकिङ प्रविधि प्रयोग गर्न सक्छन्।",

thirdTitle:"तेस्रो पक्ष गोपनीयता नीति",

thirdText:
"NNTV को गोपनीयता नीति अन्य वेबसाइट वा सेवाहरूमा लागू हुँदैन। त्यसैले प्रयोगकर्तालाई ती वेबसाइटहरूको गोपनीयता नीति अध्ययन गर्न सल्लाह दिइन्छ।",

childrenTitle:"बालबालिकाको जानकारी",

childrenText:
"NNTV ले १३ वर्ष मुनिका बालबालिकाबाट जानाजानी व्यक्तिगत जानकारी सङ्कलन गर्दैन। यदि त्यस्तो जानकारी प्रदान गरिएको छ भने कृपया हामीलाई जानकारी दिनुहोस्।",

consentTitle:"स्वीकृति",

consentText:
"NNTV वेबसाइट प्रयोग गरेर तपाईं यस गोपनीयता नीतिसँग सहमत हुनुहुन्छ र यसमा उल्लिखित सर्तहरू स्वीकार गर्नुहुन्छ।",

orgTitle:"सम्पर्क तथा संस्था",

orgText:
"नेपाल नेटवर्क टेलिभिजन (NNTV) एक स्वतन्त्र डिजिटल मिडिया प्लेटफर्म हो। गोपनीयतासम्बन्धी कुनै प्रश्न भएमा कृपया हामीलाई सम्पर्क गर्नुहोस्"
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
{t.collectTitle}
</h2>

<p className="text-gray-600">
{t.collectText}
</p>

</section>

<section className="mb-10">

<h2 className="text-2xl font-serif mb-4">
{t.useTitle}
</h2>

<ul className="text-gray-600 space-y-2">
<li>• {t.u1}</li>
<li>• {t.u2}</li>
<li>• {t.u3}</li>
<li>• {t.u4}</li>
</ul>

</section>

<section className="mb-10">

<h2 className="text-2xl font-serif mb-4">
{t.cookiesTitle}
</h2>

<p className="text-gray-600">
{t.cookiesText}
</p>

</section>

<section className="mb-10">

<h2 className="text-2xl font-serif mb-4">
{t.adsTitle}
</h2>

<p className="text-gray-600">
{t.adsText}
</p>

</section>

<section className="mb-10">

<h2 className="text-2xl font-serif mb-4">
{t.thirdTitle}
</h2>

<p className="text-gray-600">
{t.thirdText}
</p>

</section>

<section className="mb-10">

<h2 className="text-2xl font-serif mb-4">
{t.childrenTitle}
</h2>

<p className="text-gray-600">
{t.childrenText}
</p>

</section>

<section className="mb-10">

<h2 className="text-2xl font-serif mb-4">
{t.consentTitle}
</h2>

<p className="text-gray-600">
{t.consentText}
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
