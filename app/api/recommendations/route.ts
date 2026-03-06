import { NextResponse } from "next/server"

const API = "https://api.themoviedb.org/3"
const KEY = process.env.TMDB_API_KEY

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const movieId = searchParams.get("movie")

  if (!movieId) {
    return NextResponse.json([])
  }

  const res = await fetch(
    `${API}/movie/${movieId}/recommendations?api_key=${KEY}`
  )

  const data = await res.json()

  return NextResponse.json(data.results || [])
}