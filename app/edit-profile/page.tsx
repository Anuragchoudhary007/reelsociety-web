"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

export default function EditProfile(){

const { user } = useAuth()
const router = useRouter()

const [username,setUsername] = useState("")
const [bio,setBio] = useState("")

async function save(){

if(!user) return

await updateDoc(
doc(db,"users",user.uid),
{
username,
bio
}
)

router.push("/profile")

}

return(

<div className="max-w-xl">

<h1 className="text-3xl mb-6">
Edit Profile
</h1>

<input
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
className="bg-gray-900 p-3 w-full mb-4"
/>

<textarea
placeholder="Bio"
value={bio}
onChange={(e)=>setBio(e.target.value)}
className="bg-gray-900 p-3 w-full"
/>

<button
onClick={save}
className="bg-white text-black px-4 py-2 mt-4"
>
Save
</button>

</div>

)

}