import { NextResponse } from "next/server"

const API_KEY = process.env.TMDB_API_KEY
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
){

  try{

    const { id } = await context.params

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
    )

    if(!res.ok){
      return NextResponse.json(
        { error: "Movie fetch failed" },
        { status: 500 }
      )
    }

    const data = await res.json()

    return NextResponse.json(data)

  }catch(err){

    console.error(err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )

  }

}