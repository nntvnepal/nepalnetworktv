"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import ImageUpload from "@/components/ImageUpload"

export default function CandidateEntry(){

//////////////////////////////////////////////////////
// SEARCH PARAMS
//////////////////////////////////////////////////////

const searchParams = useSearchParams()
const id = searchParams.get("id")

//////////////////////////////////////////////////////
// STATES
//////////////////////////////////////////////////////

const [loading,setLoading] = useState(false)

const [election,setElection] = useState<any>(null)
const [position,setPosition] = useState("")

const [parties,setParties] = useState<any[]>([])
const [seats,setSeats] = useState<any[]>([])

const [provinces,setProvinces] = useState<any[]>([])
const [allDistricts,setAllDistricts] = useState<any[]>([])
const [allMunicipalities,setAllMunicipalities] = useState<any[]>([])

const [districts,setDistricts] = useState<any[]>([])
const [municipalities,setMunicipalities] = useState<any[]>([])

const emptyForm = {
name:"",
photo:"",
bio:"",
partyId:"",
gender:"",
dob:"",
province:"",
district:"",
municipality:"",
seatId:""
}

const [form,setForm] = useState(emptyForm)

//////////////////////////////////////////////////////
// INITIAL LOAD
//////////////////////////////////////////////////////

useEffect(()=>{
loadData()

if(id){
loadCandidate()
}

},[])

//////////////////////////////////////////////////////
// LOAD DATA
//////////////////////////////////////////////////////

async function loadData(){

try{

//////////////////////////////////////////////////////
// ACTIVE ELECTION
//////////////////////////////////////////////////////

const electionRes = await fetch("/api/elections/active")
const electionData = await electionRes.json()

setElection(electionData)

if(electionData?.type === "LOCAL"){
setPosition("MAYOR")
}

if(electionData?.type === "PROVINCIAL"){
setPosition("MLA")
}

if(electionData?.type === "FEDERAL"){
setPosition("MP")
}

//////////////////////////////////////////////////////
// REGIONS
//////////////////////////////////////////////////////

const regionRes = await fetch("/api/elections/regions")
const regionData = await regionRes.json()

setProvinces(regionData.provinces || [])
setAllDistricts(regionData.districts || [])
setAllMunicipalities(regionData.municipalities || [])

//////////////////////////////////////////////////////
// PARTIES
//////////////////////////////////////////////////////

const partyRes = await fetch("/api/elections/parties")
const partyData = await partyRes.json()

setParties(partyData || [])

}catch(err){

console.error("Load error",err)

}

}

//////////////////////////////////////////////////////
// LOAD CANDIDATE (EDIT MODE)
//////////////////////////////////////////////////////

async function loadCandidate(){

const res = await fetch(`/api/elections/candidates/${id}`)
const data = await res.json()

setForm({
name:data.name || "",
photo:data.photo || "",
bio:data.bio || "",
partyId:data.partyId || "",
gender:data.gender || "",
dob:data.dob ? data.dob.split("T")[0] : "",
province:"",
district:"",
municipality:"",
seatId:data.seatId || ""
})

}

//////////////////////////////////////////////////////
// PROVINCE → DISTRICT
//////////////////////////////////////////////////////

function loadDistricts(provinceId:string){

setForm(prev=>({
...prev,
province:provinceId,
district:"",
municipality:"",
seatId:""
}))

setMunicipalities([])
setSeats([])

const filtered = allDistricts.filter(
(d:any)=> String(d.parentId) === provinceId
)

setDistricts(filtered)

}

//////////////////////////////////////////////////////
// DISTRICT CHANGE
//////////////////////////////////////////////////////

function districtChanged(districtId:string){

if(position === "MP" || position === "MLA"){

setForm(prev=>({
...prev,
district:districtId,
seatId:""
}))

loadSeats(districtId)

}else{

loadMunicipalities(districtId)

}

}

//////////////////////////////////////////////////////
// DISTRICT → MUNICIPALITY
//////////////////////////////////////////////////////

function loadMunicipalities(districtId:string){

setForm(prev=>({
...prev,
district:districtId,
municipality:"",
seatId:""
}))

setSeats([])

const filtered = allMunicipalities.filter(
(m:any)=> String(m.parentId) === districtId
)

setMunicipalities(filtered)

}

//////////////////////////////////////////////////////
// LOAD SEATS
//////////////////////////////////////////////////////

async function loadSeats(regionId:string){

setForm(prev=>({
...prev,
seatId:""
}))

try{

const res = await fetch(`/api/elections/seats?regionId=${regionId}&position=${position}`)
const data = await res.json()

setSeats(Array.isArray(data) ? data : [])

}catch(err){

console.log("Seat load error",err)

}

}

//////////////////////////////////////////////////////
// SUBMIT
//////////////////////////////////////////////////////

async function handleSubmit(e:any){

e.preventDefault()

if(!form.name || !form.partyId || !form.seatId){

alert("Candidate name, party and seat required")
return

}

setLoading(true)

try{

const url = id
? `/api/elections/candidates/${id}`
: "/api/elections/candidates"

const method = id ? "PUT" : "POST"

await fetch(url,{
method,
headers:{ "Content-Type":"application/json" },
body:JSON.stringify(form)
})

alert(id ? "Candidate Updated" : "Candidate Added")

if(!id){
setForm(emptyForm)
}

}catch(err){

console.log(err)
alert("Error saving candidate")

}

setLoading(false)

}

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<div className="p-8 text-white">

<h1 className="text-xl font-semibold mb-6">

{id ? "Edit Candidate" : "Candidate Entry"} — {election?.type}

</h1>

<form
onSubmit={handleSubmit}
className="grid grid-cols-2 gap-4 max-w-4xl"
>

<input
placeholder="Candidate Name"
className="p-3 rounded text-black"
value={form.name}
onChange={(e)=>setForm({...form,name:e.target.value})}
/>

<select
className="p-3 rounded text-black"
value={form.partyId}
onChange={(e)=>setForm({...form,partyId:e.target.value})}
>

<option value="">Select Party</option>

{parties.map((p:any)=>(
<option key={p.id} value={p.id}>
{p.name}
</option>
))}

</select>

<div>

<ImageUpload
onUpload={(url:string)=>setForm({...form,photo:url})}
/>

{form.photo &&(
<img
src={form.photo}
className="w-24 h-24 mt-2 rounded object-cover"
/>
)}

</div>

<select
className="p-3 rounded text-black"
value={form.gender}
onChange={(e)=>setForm({...form,gender:e.target.value})}
>

<option value="">Gender</option>
<option>Male</option>
<option>Female</option>
<option>Other</option>

</select>

<input
type="date"
className="p-3 rounded text-black"
value={form.dob}
onChange={(e)=>setForm({...form,dob:e.target.value})}
/>

<select
className="p-3 rounded text-black"
value={form.province}
onChange={(e)=>loadDistricts(e.target.value)}
>

<option value="">Province</option>

{provinces.map((p:any)=>(
<option key={p.id} value={p.id}>
{p.name}
</option>
))}

</select>

<select
className="p-3 rounded text-black"
value={form.district}
onChange={(e)=>districtChanged(e.target.value)}
>

<option value="">District</option>

{districts.map((d:any)=>(
<option key={d.id} value={d.id}>
{d.name}
</option>
))}

</select>

{!(position === "MP" || position === "MLA") &&(

<select
className="p-3 rounded text-black"
value={form.municipality}
onChange={(e)=>loadSeats(e.target.value)}
>

<option value="">Municipality</option>

{municipalities.map((m:any)=>(
<option key={m.id} value={m.id}>
{m.name}
</option>
))}

</select>

)}

<select
className="p-3 rounded text-black"
value={form.seatId}
onChange={(e)=>setForm({...form,seatId:e.target.value})}
>

<option value="">Select Seat</option>

{seats.map((seat:any)=>(
<option key={seat.id} value={seat.id}>
{seat.name}
</option>
))}

</select>

<textarea
placeholder="About Candidate / Profile"
className="p-3 rounded text-black col-span-2"
rows={4}
value={form.bio}
onChange={(e)=>setForm({...form,bio:e.target.value})}
/>

<button
disabled={loading}
className="bg-yellow-500 text-black px-6 py-2 rounded col-span-2"
>

{loading
? "Saving..."
: id
? "Update Candidate"
: "Save Candidate"
}

</button>

</form>

</div>

)

}