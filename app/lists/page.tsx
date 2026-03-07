"use client"

import { useEffect,useState } from "react"
import {
collection,
query,
orderBy,
onSnapshot,
getDocs,
limit
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

const IMAGE="https://image.tmdb.org/t/p/w300"



function generateCover(preview:any[]){

if(!preview || preview.length===0) return null

return preview
.slice(0,4)
.map((movie:any)=>movie.poster_path)

}



export default function ListsPage(){

const {user}=useAuth()

const [lists,setLists]=useState<any[]>([])
const [loading,setLoading]=useState(true)



useEffect(()=>{

if(!user?.uid) return

const q=query(
collection(db,"users",user.uid,"lists"),
orderBy("createdAt","desc")
)

const unsub=onSnapshot(q,async(snapshot)=>{

const data=await Promise.all(

snapshot.docs.map(async(docSnap)=>{

const listId=docSnap.id

const itemsQuery=query(
collection(
db,
"users",
user.uid,
"lists",
listId,
"items"
),
orderBy("rank"),
limit(4)
)

const itemsSnap=await getDocs(itemsQuery)

const preview=itemsSnap.docs.map(d=>d.data())

return{
id:listId,
...docSnap.data(),
preview,
cover:generateCover(preview),
count:itemsSnap.size
}

})

)

setLists(data)
setLoading(false)

})

return()=>unsub()

},[user?.uid])



return(

<div className="max-w-7xl mx-auto px-6 py-10 text-white">



{/* HEADER */}

<div className="flex justify-between items-center mb-12">

<div>

<h1 className="text-4xl font-bold mb-2">
Your Lists
</h1>

<p className="text-zinc-400">
Rank and organize your favorite movies.
</p>

</div>

<Link
href="/create-list"
className="px-6 py-2 bg-white text-black rounded-xl hover:scale-105 transition"
>
+ Create List
</Link>

</div>



{/* LOADING */}

{loading && (
<div className="text-zinc-500">
Loading lists...
</div>
)}



{/* EMPTY STATE */}

{!loading && lists.length===0 && (

<div className="text-zinc-500">
You haven't created any lists yet.
</div>

)}



{/* LIST GRID */}

{lists.length>0 && (

<div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8">

{lists.map(list=>(

<Link
key={list.id}
href={`/lists/${user?.uid}/${list.id}`}
className="group block rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:scale-[1.02] transition duration-300"
>



{/* COVER */}

<div className="grid grid-cols-2 grid-rows-2 h-[220px]">

{list.cover && list.cover.length>0 ? (

list.cover.map((poster:string,i:number)=>(
<img
key={i}
src={`${IMAGE}${poster}`}
className="w-full h-full object-cover group-hover:scale-110 transition"
/>
))

) : (

<div className="col-span-2 row-span-2 flex items-center justify-center bg-zinc-800 text-zinc-500 text-sm">
No Movies
</div>

)}

</div>



{/* INFO */}

<div className="p-4">

<h3 className="text-lg font-semibold mb-1">
{list.title}
</h3>

<p className="text-zinc-400 text-sm">
{list.count} movies
</p>

</div>

</Link>

))}

</div>

)}

</div>

)

}