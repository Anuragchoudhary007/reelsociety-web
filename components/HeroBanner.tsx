"use client"

import { useEffect,useState } from "react"

const IMAGE = "https://image.tmdb.org/t/p/original"

export default function HeroBanner(){

const [movie,setMovie] = useState<any>(null)

useEffect(()=>{

async function load(){

const res = await fetch("/api/tmdb/trending")
const data = await res.json()

const random = data[Math.floor(Math.random()*data.length)]

setMovie(random)

}

load()

},[])

if(!movie) return null

return(

<section className="relative h-[70vh] flex items-end px-16 pb-20">

<img
src={IMAGE+movie.backdrop_path}
className="absolute inset-0 w-full h-full object-cover opacity-40"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"/>

<div className="relative z-10 max-w-2xl">

<h1 className="text-5xl font-bold mb-4">
{movie.title}
</h1>

<p className="text-gray-300 mb-6 line-clamp-3">
{movie.overview}
</p>

<div className="flex gap-4">

<a
href={`/movie/${movie.id}`}
className="px-6 py-3 bg-white text-black rounded-lg"
>
▶ Play
</a>

</div>

</div>

</section>

)

}