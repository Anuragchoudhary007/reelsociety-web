import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}`
    )

    const data = await res.json()

    if (!res.ok || data.status_code) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json(
      { error: "Network error" },
      { status: 500 }
    )
  }
}