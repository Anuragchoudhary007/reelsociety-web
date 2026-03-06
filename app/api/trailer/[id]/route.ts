import { NextResponse } from "next/server"

const API_KEY = process.env.TMDB_API_KEY

export async function GET(
  req:Request,
  context:{params:Promise<{id:string}>}
){

  const { id } = await context.params

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
  )

  const data = await res.json()

  const trailer = data.results.find(
    (v:any)=>v.type==="Trailer"
  )

  return NextResponse.json(trailer?.key || "")

}