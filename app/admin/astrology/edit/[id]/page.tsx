"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

/* ================= HOROSCOPE TEMPLATE ================= */

const horoscopeTemplate = `⭐ शुभ रंग:
🍀 शुभ अंक:
🧭 शुभ दिशा:
⏰ शुभ समय:

⭐ आजको समय संकेत
यहाँ लेख्नुहोस्...

💼 करियर
यहाँ लेख्नुहोस्...

💰 आर्थिक अवस्था
यहाँ लेख्नुहोस्...

❤️ प्रेम सम्बन्ध
यहाँ लेख्नुहोस्...

🩺 स्वास्थ्य
यहाँ लेख्नुहोस्...
`;

export default function EditPost(){

const params = useParams();
const id = params?.id as string;

const router = useRouter();

const [loading,setLoading] = useState(false);

const [form,setForm] = useState({

title:"",
content:"",
images:[] as string[],
videoUrl:"",
seoTitle:"",
seoDescription:"",
seoKeywords:"",
publishedAt:""

});

/* ================= FETCH ARTICLE ================= */

useEffect(()=>{

if(!id) return;

async function load(){

try{

const res = await fetch(`/api/articles/${id}`);
const data = await res.json();

if(data.success){

setForm({

title:data.article.title || "",
content:data.article.content || horoscopeTemplate,
images:data.article.images || [],
videoUrl:data.article.videoUrl || "",
seoTitle:data.article.seoTitle || "",
seoDescription:data.article.seoDescription || "",
seoKeywords:data.article.seoKeywords || "",
publishedAt:data.article.publishedAt || ""

});

}

}catch(err){

console.error("Article fetch error",err);

}

}

load();

},[id]);

/* ================= IMAGE UPLOAD ================= */

const uploadImage = async(file:File)=>{

try{

setLoading(true);

const data = new FormData();

data.append("file",file);
data.append("upload_preset","YOUR_UPLOAD_PRESET");

const res = await fetch(
"https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
{
method:"POST",
body:data
}
);

const result = await res.json();

if(result.secure_url){

setForm(prev=>({

...prev,
images:[...prev.images,result.secure_url]

}));

}

}catch(err){

alert("Image upload failed ❌");

}

setLoading(false);

};

/* ================= REMOVE IMAGE ================= */

const removeImage = (index:number)=>{

const updated=[...form.images];
updated.splice(index,1);

setForm({
...form,
images:updated
});

};

/* ================= AUTO SEO ================= */

const autoSEO = ()=>{

const plain=form.content.replace(/<[^>]*>?/gm,"");

setForm(prev=>({

...prev,
seoTitle:prev.title,
seoDescription:plain.slice(0,160),
seoKeywords:prev.title.split(" ").join(", ")

}));

};

/* ================= UPDATE ================= */

const handleSubmit = async(e:any)=>{

e.preventDefault();

try{

const res = await fetch(`/api/articles/${id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

...form,
status:"approved"

})

});

const data=await res.json();

if(data.success){

alert("राशिफल प्रकाशित भयो ✅");

router.push("/admin/astrology");

}else{

alert("Update Failed ❌");

}

}catch(err){

alert("Server Error ❌");

}

};

/* ================= UI ================= */

return(

<div className="p-8 bg-[#0f172a] min-h-screen text-white">

<form
onSubmit={handleSubmit}
className="max-w-4xl mx-auto space-y-6"
>

<h1 className="text-2xl font-bold">
🔮 राशिफल सम्पादन
</h1>

<p className="text-sm text-gray-400">
Template format परिवर्तन नगर्नुहोस्।
</p>

{/* TITLE */}

<input
value={form.title}
onChange={(e)=>
setForm({...form,title:e.target.value})
}
className="w-full p-3 rounded bg-white text-black"
placeholder="राशिफल शीर्षक"
/>

{/* CONTENT */}

<textarea
value={form.content}
onChange={(e)=>
setForm({...form,content:e.target.value})
}
rows={16}
className="w-full p-3 rounded bg-white text-black font-mono"
placeholder="राशिफल लेख्नुहोस्"
/>

{/* SCHEDULE */}

<div>

<label className="block mb-1 text-sm">
Schedule Publish Time
</label>

<input
type="datetime-local"
value={form.publishedAt}
onChange={(e)=>
setForm({...form,publishedAt:e.target.value})
}
className="w-full p-3 rounded bg-white text-black"
/>

<p className="text-xs text-gray-400 mt-1">
Example: 03:00 AM for morning horoscope
</p>

</div>

{/* IMAGE UPLOAD */}

<div>

<h3 className="font-semibold mb-2">
Upload Images
</h3>

<input
type="file"
onChange={(e)=>{
if(e.target.files){
uploadImage(e.target.files[0]);
}
}}
/>

{loading && (
<p className="text-sm mt-2">
Uploading...
</p>
)}

<div className="flex gap-4 mt-3 flex-wrap">

{form.images.map((img,i)=>(

<div key={i} className="relative">

<img
src={img}
className="w-40 h-28 object-cover rounded border"
/>

<button
type="button"
onClick={()=>removeImage(i)}
className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
>
✕
</button>

</div>

))}

</div>

</div>

{/* VIDEO */}

<input
value={form.videoUrl}
onChange={(e)=>
setForm({...form,videoUrl:e.target.value})
}
className="w-full p-3 rounded bg-white text-black"
placeholder="Video URL"
/>

{/* SEO */}

<div className="border-t border-gray-700 pt-6 space-y-3">

<h3 className="text-lg font-semibold">
SEO Settings
</h3>

<button
type="button"
onClick={autoSEO}
className="bg-purple-600 px-4 py-1 rounded"
>
Auto Generate SEO
</button>

<input
value={form.seoTitle}
onChange={(e)=>
setForm({...form,seoTitle:e.target.value})
}
className="w-full p-3 rounded bg-white text-black"
placeholder="SEO Title"
/>

<textarea
value={form.seoDescription}
onChange={(e)=>
setForm({...form,seoDescription:e.target.value})
}
rows={3}
className="w-full p-3 rounded bg-white text-black"
placeholder="SEO Description"
/>

<input
value={form.seoKeywords}
onChange={(e)=>
setForm({...form,seoKeywords:e.target.value})
}
className="w-full p-3 rounded bg-white text-black"
placeholder="SEO Keywords"
/>

</div>

{/* SUBMIT */}

<button
type="submit"
className="bg-purple-600 px-6 py-3 rounded text-lg hover:bg-purple-700"
>
Post राशिफल
</button>

</form>

</div>

);

}
