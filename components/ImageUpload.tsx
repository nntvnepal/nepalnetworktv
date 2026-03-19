"use client"

import { useState } from "react"

export default function ImageUpload({ onUpload }: any) {

  const [preview,setPreview] = useState("")
  const [uploading,setUploading] = useState(false)

  async function handleFile(e:any){

    const file = e.target.files[0]
    if(!file) return

    setPreview(URL.createObjectURL(file))
    setUploading(true)

    const formData = new FormData()
    formData.append("file",file)
    formData.append("upload_preset","nntv_upload")

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dimbn2uxb/image/upload",
      {
        method:"POST",
        body:formData
      }
    )

    const data = await res.json()

    onUpload(data.secure_url)

    setUploading(false)

  }

  return(

    <div className="space-y-2">

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
      />

      {preview && (

        <img
          src={preview}
          className="w-24 h-24 rounded object-cover border"
        />

      )}

      {uploading && (

        <p className="text-sm text-yellow-400">
          Uploading image...
        </p>

      )}

    </div>

  )

}