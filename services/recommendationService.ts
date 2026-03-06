import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

const API = "https://api.themoviedb.org/3"

export async function getRecommendations(uid:string){

  const watchSnap = await getDocs(
    collection(db,"users",uid,"watchlist")
  )

  let genres:number[] = []

  watchSnap.forEach(doc=>{
    const g = doc.data().genreIds || []
    genres.push(...g)
  })

  if(genres.length === 0) return []

  const topGenre = genres.sort(
    (a,b)=>
      genres.filter(v=>v===a).length -
      genres.filter(v=>v===b).length
  ).pop()

  const res = await fetch(
    `${API}/discover/movie?with_genres=${topGenre}&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
  )

  const data = await res.json()

  return data.results
}