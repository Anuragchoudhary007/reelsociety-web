"use client"

import Link from "next/link"

const IMAGE = "https://image.tmdb.org/t/p/w500"

export default function ListCard({list}:any){

const poster = list.preview?.[0]?.poster

return(

<Link
href={`/lists/${list.id}`}
className="block bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition"
>

<div className="h-64">

<img
src={poster ? IMAGE+poster : "/placeholder.png"}
className="w-full h-full object-cover"
/>

</div>

<div className="p-4">

<h3 className="text-lg font-semibold">
{list.name}
</h3>

<p className="text-gray-400 text-sm">
{list.count || 0} movies
</p>

</div>

</Link>

)

}