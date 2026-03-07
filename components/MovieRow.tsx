"use client"

import MovieCard from "./MovieCard"

export default function MovieRow({movies,loading}:any){

const list = Array.isArray(movies) ? movies : []

if(loading){

return(

<div className="flex gap-4 overflow-x-auto pb-6">

{[...Array(10)].map((_,i)=>(
<div
key={i}
className="min-w-[160px] h-[240px] bg-gray-800 rounded-lg animate-pulse"
/>
))}

</div>

)

}

if(!list.length) return null

return(

<div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">

{list.map((movie:any)=>(
<MovieCard key={movie.id} movie={movie}/>
))}

</div>

)

}