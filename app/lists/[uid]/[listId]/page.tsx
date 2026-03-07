"use client"

import { useEffect,useState } from "react"
import { useParams,useRouter } from "next/navigation"
import {
collection,
doc,
getDoc,
onSnapshot,
addDoc,
deleteDoc,
writeBatch,
getDocs,
updateDoc
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"

import {
DndContext,
closestCenter,
PointerSensor,
useSensor,
useSensors
} from "@dnd-kit/core"

import {
SortableContext,
arrayMove,
rectSortingStrategy,
useSortable
} from "@dnd-kit/sortable"

import {CSS} from "@dnd-kit/utilities"
import Link from "next/link"

const IMAGE="https://image.tmdb.org/t/p/w500"

export default function ListDetailPage(){

const params=useParams()
const uid=params.uid as string
const listId=params.listId as string

const router=useRouter()
const {user}=useAuth()

const [list,setList]=useState<any>(null)
const [items,setItems]=useState<any[]>([])
const [owner,setOwner]=useState<any>(null)
const [search,setSearch]=useState("")
const [results,setResults]=useState<any[]>([])
const [showDelete,setShowDelete]=useState(false)

const isOwner=user?.uid===uid

useEffect(()=>{

async function loadList(){

const ref=doc(db,"users",uid,"lists",listId)
const snap=await getDoc(ref)

if(snap.exists()){
setList({id:snap.id,...snap.data()})
}

const userSnap=await getDoc(doc(db,"users",uid))
if(userSnap.exists()) setOwner(userSnap.data())

}

loadList()

const itemsRef=collection(
db,
"users",
uid,
"lists",
listId,
"items"
)

const unsub=onSnapshot(itemsRef,(snapshot)=>{

const data=snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}))

setItems(data.sort((a:any,b:any)=>a.rank-b.rank))

})

return()=>unsub()

},[uid,listId])



async function searchMovies(query:string){

setSearch(query)

if(query.length<2){
setResults([])
return
}

const res=await fetch(`/api/search?query=${query}`)
const data=await res.json()

setResults(data.results||[])

}


async function addMovie(movie:any){

if(!isOwner) return

const exists=items.find(i=>i.movieId===movie.id)

if(exists){
alert("Movie already in list")
return
}

const ref=collection(
db,
"users",
uid,
"lists",
listId,
"items"
)

await addDoc(ref,{
movieId:movie.id,
title:movie.title,
poster_path:movie.poster_path,
rank:items.length+1
})

setResults([])
setSearch("")

}


async function deleteList(){

if(!isOwner) return

const itemsRef=collection(
db,
"users",
uid,
"lists",
listId,
"items"
)

const snap=await getDocs(itemsRef)

const batch=writeBatch(db)

snap.docs.forEach(docSnap=>{
batch.delete(docSnap.ref)
})

const listRef=doc(db,"users",uid,"lists",listId)

batch.delete(listRef)

await batch.commit()

router.push("/lists")

}


const sensors=useSensors(
useSensor(PointerSensor,{activationConstraint:{distance:10}})
)


async function handleDragEnd(event:any){

if(!isOwner) return

const {active,over}=event

if(!over||active.id===over.id) return

const oldIndex=items.findIndex(i=>i.id===active.id)
const newIndex=items.findIndex(i=>i.id===over.id)

const newItems=arrayMove(items,oldIndex,newIndex)
setItems(newItems)

const batch=writeBatch(db)

newItems.forEach((item,index)=>{
const ref=doc(db,"users",uid,"lists",listId,"items",item.id)
batch.update(ref,{rank:index+1})
})

await batch.commit()

}



if(!list) return <div className="p-10">Loading...</div>



return(

<div className="max-w-7xl mx-auto p-10 text-white">

{/* HEADER */}

<div className="flex justify-between mb-10">

<div>

<h1 className="text-4xl font-bold">
{list.title}
</h1>

<p className="text-gray-400">
{list.description}
</p>

{owner && (
<Link
href={`/user/${uid}`}
className="text-sm text-blue-400"
>
Created by {owner.username}
</Link>
)}

</div>

{isOwner && (
<button
onClick={()=>setShowDelete(true)}
className="bg-red-600 px-4 py-2 rounded-lg"
>
Delete List
</button>
)}

</div>



{/* SEARCH */}

{isOwner && (
<>
<input
value={search}
onChange={(e)=>searchMovies(e.target.value)}
placeholder="Search movies..."
className="bg-gray-900 px-4 py-3 rounded-lg w-96 border border-white/10"
/>

{results.length>0&&(

<div className="bg-black border border-white/10 mt-3 rounded-xl p-4">

{results.map(movie=>(

<div
key={movie.id}
className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg"
>

<div className="flex gap-3 items-center">

<img
src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
className="w-10 rounded"
/>

<span>{movie.title}</span>

</div>

<button
onClick={()=>addMovie(movie)}
className="bg-green-600 px-3 py-1 rounded"
>
Add
</button>

</div>

))}

</div>

)}
</>
)}



{/* MOVIES */}

<DndContext
sensors={sensors}
collisionDetection={closestCenter}
onDragEnd={handleDragEnd}
>

<SortableContext
items={items.map(i=>i.id)}
strategy={rectSortingStrategy}
>

<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mt-10">

{items.map((item,index)=>(
<MovieCard key={item.id} item={item} index={index}/>
))}

</div>

</SortableContext>

</DndContext>

</div>

)

}



function MovieCard({item,index}:any){

const {
attributes,
listeners,
setNodeRef,
transform,
transition
}=useSortable({id:item.id})

const style={
transform:CSS.Transform.toString(transform),
transition
}

return(

<div
ref={setNodeRef}
style={style}
{...attributes}
{...listeners}
className="relative group rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:scale-105 transition cursor-grab"
>

<div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-xs">
#{index+1}
</div>

<img
src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
className="w-full h-[320px] object-cover"
/>

<div className="absolute bottom-0 bg-gradient-to-t from-black p-3 w-full">
<h3 className="text-sm">
{item.title}
</h3>
</div>

</div>

)

}