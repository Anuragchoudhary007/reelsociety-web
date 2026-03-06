import { NextResponse } from "next/server"

export async function GET() {

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=14`
  )

  const data = await res.json()

  return NextResponse.json(data.results || [])
}