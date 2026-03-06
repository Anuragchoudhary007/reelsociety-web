"use client"

import { useEffect,useState } from "react"
import {
collectionGroup,
query,
orderBy,
limit,
getDocs
} from "firebase/firestore"

import { db } from "@/lib/firebase"

export default function FriendsActivity(){

const [activities,setActivities] = useState<any[]>([])

useEffect(()=>{

async function load(){

const q = query(
collectionGroup(db,"activity"),
orderBy("createdAt","desc"),
limit(10)
)

const snap = await getDocs(q)

setActivities(
snap.docs.map(d=>d.data())
)

}

load()

},[])

return(

<div className="mb-12">

<h2 className="text-xl mb-4">
🔥 Friends Activity
</h2>

{activities.map((a,i)=>{

let text = ""

if(a.type==="watchlist_add"){
text = `added ${a.movieTitle} to watchlist`
}

if(a.type==="watched"){
text = `watched ${a.movieTitle}`
}

if(a.type==="rated"){
text = `rated ${a.movieTitle}`
}

return(

<div key={i} className="bg-white/5 px-4 py-3 rounded mb-3">

<span className="text-gray-300">
{a.username} {text}
</span>

</div>

)

})}

</div>

)

}