import { NextResponse } from "next/server"

const API="https://api.themoviedb.org/3"
const KEY=process.env.TMDB_API_KEY

export async function GET(req:Request){

  const {searchParams} = new URL(req.url)
  const query = searchParams.get("query")

  if(!query) return NextResponse.json([])

  const res = await fetch(
    `${API}/search/movie?api_key=${KEY}&query=${query}`
  )

  const data = await res.json()

  return NextResponse.json(data.results.slice(0,8))

}