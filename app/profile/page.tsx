"use client"

import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc,getDoc,collection,getDocs } from "firebase/firestore"
import Link from "next/link"

export default function ProfilePage(){

const { user } = useAuth()

const [profile,setProfile] = useState<any>(null)
const [watchlistCount,setWatchlistCount] = useState(0)
const [listCount,setListCount] = useState(0)

useEffect(()=>{

if(!user) return

async function load(){

const userDoc = await getDoc(
doc(db,"users",user.uid)
)

if(userDoc.exists()){
setProfile(userDoc.data())
}

const watchSnap = await getDocs(
collection(db,"users",user.uid,"watchlist")
)

setWatchlistCount(watchSnap.size)

const listSnap = await getDocs(
collection(db,"users",user.uid,"lists")
)

setListCount(listSnap.size)

}

load()

},[user])

if(!user) return null

return(

<div className="max-w-3xl">

<h1 className="text-3xl font-bold mb-8">
Profile
</h1>

<div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex gap-8">

<img
src={user.photoURL || "/avatar.png"}
className="w-24 h-24 rounded-full"
/>

<div>

<p className="text-xl font-semibold">
{profile?.username || user.displayName || "User"}
</p>

<p className="text-gray-400">
{user.email}
</p>

{profile?.bio && (
<p className="text-gray-400 mt-2">
{profile.bio}
</p>
)}

<div className="flex gap-10 mt-6">

<div>
<p className="text-2xl font-bold">{watchlistCount}</p>
<p className="text-gray-400">Watchlist</p>
</div>

<div>
<p className="text-2xl font-bold">{listCount}</p>
<p className="text-gray-400">Lists</p>
</div>

</div>

<div className="mt-6">

<Link
href="/edit-profile"
className="px-4 py-2 bg-white text-black rounded-lg"
>
Edit Profile
</Link>

</div>

</div>

</div>

</div>

)

}