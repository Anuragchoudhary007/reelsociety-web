import { NextResponse } from "next/server"

export async function GET() {

  try {

    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=28`
    )

    const data = await res.json()

    return NextResponse.json(data.results || [])

  } catch {

    return NextResponse.json([])
  }

}