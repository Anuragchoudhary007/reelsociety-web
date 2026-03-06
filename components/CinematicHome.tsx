"use client"

import { useEffect,useState } from "react"
import MovieRow from "./MovieRow"
import FriendsActivityRow from "./FriendsActivityRow"
import RecommendationRow from "./RecommendationRow"
import DownloadApp from "./DownloadApp"
export default function CinematicHome(){

  const [trending,setTrending] = useState<any[]>([])
  const [topRated,setTopRated] = useState<any[]>([])
  const [action,setAction] = useState<any[]>([])

  const [loading,setLoading] = useState(true)

  const [recentWatchedMovieId,setRecentWatchedMovieId] =
    useState<number | null>(null)

  useEffect(()=>{

    async function load(){

      try{

        const trendingData = await fetch("/api/tmdb/trending")
          .then(r=>r.json())

        const topData = await fetch("/api/tmdb/top")
          .then(r=>r.json())

        const actionData = await fetch("/api/tmdb/action")
          .then(r=>r.json())

        setTrending(trendingData || [])
        setTopRated(topData || [])
        setAction(actionData || [])

      }catch(err){
        console.error(err)
      }

      setLoading(false)

    }

    load()

  },[])

  return(

    <div className="space-y-16 px-10 py-8">

      {/* Friends watching */}

      <FriendsActivityRow/>

      {/* Recommendations */}

      {recentWatchedMovieId &&(
        <RecommendationRow movieId={recentWatchedMovieId}/>
      )}

      {/* Trending */}

      <section>

        <h2 className="text-xl font-semibold mb-5">
          🔥 Trending
        </h2>

        <MovieRow movies={trending} loading={loading}/>

      </section>


      {/* Top Rated */}

      <section>

        <h2 className="text-xl font-semibold mb-5">
          ⭐ Top Rated
        </h2>

        <MovieRow movies={topRated} loading={loading}/>

      </section>


      {/* Action */}

      <section>

        <h2 className="text-xl font-semibold mb-5">
          🎭 Action
        </h2>

        <MovieRow movies={action} loading={loading}/>

      </section>
<DownloadApp />
    </div>

  )

}