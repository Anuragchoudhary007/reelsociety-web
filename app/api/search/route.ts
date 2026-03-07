import { NextResponse } from "next/server"

const TMDB_KEY = process.env.TMDB_API_KEY

export async function GET(req:Request){

const { searchParams } = new URL(req.url)
const query = searchParams.get("query")

if(!query){

return NextResponse.json({
results:[]
})

}

try{

const res = await fetch(
`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`
)

const data = await res.json()

return NextResponse.json(data)

}catch(error){

return NextResponse.json({
results:[]
})

}

}