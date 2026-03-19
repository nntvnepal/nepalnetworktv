"use client"

import { useState } from "react"
import { Mail, Building2, Megaphone } from "lucide-react"
import { useLegalLang } from "../legalLangContext"

export default function ContactPage() {

const { lang } = useLegalLang()

const content = {

en:{
title:"Contact Nepal Network Television",
subtitle:"For inquiries, partnerships or advertising opportunities please contact the NNTV team.",
response:"Our editorial or support team usually responds within 24–48 hours.",

general:"General Inquiry",
generalDesc:"Questions, feedback or general communication",

ads:"Advertising",
adsDesc:"Campaigns, brand partnerships and promotions",

org:"Organization",

formTitle:"Send Us a Message",

name:"Your Name",
email:"Email Address",
subject:"Subject",
message:"Your Message",

send:"Send Message",
sending:"Sending...",
success:"Message sent successfully. Our team will contact you soon."

},

np:{
title:"नेपाल नेटवर्क टेलिभिजन सम्पर्क",
subtitle:"प्रश्न, सहकार्य वा विज्ञापन सम्बन्धी जानकारीका लागि NNTV टिमसँग सम्पर्क गर्नुहोस्।",
response:"हाम्रो टोलीले सामान्यतया २४–४८ घण्टाभित्र प्रतिक्रिया दिन्छ।",

general:"सामान्य जानकारी",
generalDesc:"प्रश्न, प्रतिक्रिया वा सामान्य सम्पर्क",

ads:"विज्ञापन",
adsDesc:"प्रचार अभियान, ब्रान्ड सहकार्य तथा विज्ञापन",

org:"संस्था",

formTitle:"हामीलाई सन्देश पठाउनुहोस्",

name:"तपाईंको नाम",
email:"इमेल ठेगाना",
subject:"विषय",
message:"सन्देश",

send:"सन्देश पठाउनुहोस्",
sending:"पठाउँदै...",
success:"सन्देश सफलतापूर्वक पठाइयो। हाम्रो टोलीले तपाईंलाई सम्पर्क गर्नेछ।"

}

}

const t = content[lang]

const [form,setForm] = useState({
name:"",
email:"",
subject:"",
message:""
})

const [loading,setLoading] = useState(false)
const [sent,setSent] = useState(false)

const handleSubmit = async (e:any) => {

e.preventDefault()

setLoading(true)

const res = await fetch("/api/contact",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
})

setLoading(false)

if(res.ok){

setSent(true)

setForm({
name:"",
email:"",
subject:"",
message:""
})

}else{
alert("Failed to send message")
}

}

return(

<main className="max-w-6xl mx-auto px-6 py-20">

{/* HEADER */}

<section className="text-center mb-16">

<h1 className="text-4xl md:text-5xl font-serif mb-6">
{t.title}
</h1>

<p className="text-gray-600 max-w-3xl mx-auto">
{t.subtitle}
</p>

<p className="text-sm text-gray-500 mt-2">
{t.response}
</p>

</section>


{/* CONTACT CARDS */}

<section className="grid md:grid-cols-3 gap-8 mb-20">


{/* GENERAL */}

<div className="bg-white border rounded-xl p-8 text-center shadow-sm">

<Mail className="mx-auto text-[#4b0055] mb-4" size={32} />

<h3 className="font-semibold text-lg mb-2">
{t.general}
</h3>

<p className="text-gray-600 text-sm mb-3">
{t.generalDesc}
</p>

<a
href="mailto:info@nntvnepal.com"
className="text-[#4b0055] text-sm break-all hover:underline"
>
info@nntvnepal.com
</a>

</div>


{/* ADVERTISING */}

<div className="bg-white border rounded-xl p-8 text-center shadow-sm">

<Megaphone className="mx-auto text-[#4b0055] mb-4" size={32} />

<h3 className="font-semibold text-lg mb-2">
{t.ads}
</h3>

<p className="text-gray-600 text-sm mb-3">
{t.adsDesc}
</p>

<a
href="mailto:ads@nntvnepal.com"
className="text-[#4b0055] text-sm break-all hover:underline"
>
ads@nntvnepal.com
</a>

</div>


{/* ORGANIZATION */}

<div className="bg-white border rounded-xl p-8 text-center shadow-sm">

<Building2 className="mx-auto text-[#4b0055] mb-4" size={32} />

<h3 className="font-semibold text-lg mb-2">
{t.org}
</h3>

<p className="text-gray-600 text-sm">
Nepal Network Television (NNTV)<br/>
Media Beyond the Nation<br/>
Kathmandu, Nepal
</p>

</div>

</section>


{/* CONTACT FORM */}

<section className="bg-gray-50 rounded-xl p-10">

<h2 className="text-2xl font-serif mb-8 text-center">
{t.formTitle}
</h2>

<form
onSubmit={handleSubmit}
className="grid md:grid-cols-2 gap-6"
>

<input
type="text"
placeholder={t.name}
required
value={form.name}
onChange={(e)=>setForm({...form,name:e.target.value})}
className="border p-3 rounded-lg"
/>

<input
type="email"
placeholder={t.email}
required
value={form.email}
onChange={(e)=>setForm({...form,email:e.target.value})}
className="border p-3 rounded-lg"
/>

<input
type="text"
placeholder={t.subject}
value={form.subject}
onChange={(e)=>setForm({...form,subject:e.target.value})}
className="border p-3 rounded-lg md:col-span-2"
/>

<textarea
rows={6}
placeholder={t.message}
required
value={form.message}
onChange={(e)=>setForm({...form,message:e.target.value})}
className="border p-3 rounded-lg md:col-span-2"
/>

<button
type="submit"
disabled={loading}
className="bg-[#4b0055] text-white py-3 rounded-lg md:col-span-2 hover:bg-[#320038] transition"
>
{loading ? t.sending : t.send}
</button>

{sent && (
<p className="text-green-600 md:col-span-2 text-center">
{t.success}
</p>
)}

</form>

</section>


{/* SOCIAL */}

<section className="text-center mt-16">

<h3 className="font-semibold mb-4">
Follow NNTV
</h3>

<div className="flex justify-center gap-6 text-gray-600 text-sm">

<a href="#" className="hover:text-[#4b0055]">
Twitter
</a>

<a href="#" className="hover:text-[#4b0055]">
Facebook
</a>

<a href="#" className="hover:text-[#4b0055]">
YouTube
</a>

<a href="#" className="hover:text-[#4b0055]">
Instagram
</a>

</div>

</section>

</main>

)

}