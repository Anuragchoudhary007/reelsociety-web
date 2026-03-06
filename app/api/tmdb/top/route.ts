import { NextResponse } from "next/server"

export async function GET() {

  try {

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`
    )

    const data = await res.json()

    return NextResponse.json(data.results || [])

  } catch (err) {

    return NextResponse.json([])
  }

}