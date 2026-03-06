"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"

import WatchlistButton from "./WatchlistButton"
import MovieRating from "./MovieRating"
import ReviewSection from "./ReviewSection"
import TrailerModal from "./TrailerModal"

import { createActivity } from "@/services/activityService"

const IMAGE = "https://image.tmdb.org/t/p/w500"
const BACKDROP = "https://image.tmdb.org/t/p/original"

export default function MovieDetailsClient({ movie }: any) {

  const { user } = useAuth()

  const [trailerKey,setTrailerKey] = useState<string | null>(null)
  const [isWatched,setIsWatched] = useState(false)
  const [showTrailer,setShowTrailer] = useState(false)

  if(!movie) return null

  /* ================= WATCHED CHECK ================= */

  useEffect(()=>{

    if(!user?.uid) return

    async function check(){

      const ref = doc(
        db,
        "users",
        user.uid,
        "watched",
        String(movie.id)
      )

      const snap = await getDoc(ref)

      setIsWatched(snap.exists())

    }

    check()

  },[user?.uid,movie.id])


  /* ================= TRAILER DELAY ================= */

  useEffect(()=>{

    const t = setTimeout(()=>setShowTrailer(true),1200)

    return ()=>clearTimeout(t)

  },[])


  /* ================= WATCHED TOGGLE ================= */

  async function toggleWatched(){

    if(!user?.uid) return

    const ref = doc(
      db,
      "users",
      user.uid,
      "watched",
      String(movie.id)
    )

    const snap = await getDoc(ref)

    if(snap.exists()){

      await deleteDoc(ref)
      setIsWatched(false)

    }else{

      await setDoc(ref,{
        movieId:movie.id,
        title:movie.title || "Unknown",
        poster:movie.poster_path || null,
        watchedAt:serverTimestamp()
      })

      await createActivity(user.uid,"watched",movie)

      setIsWatched(true)

    }

  }


  /* ================= DATA ================= */

  const cast = movie.credits?.cast?.slice(0,12) || []

  const director =
    movie.credits?.crew?.find((p:any)=>p.job==="Director")

  const providers =
    movie["watch/providers"]?.results?.IN?.flatrate || []

  const trailerVideo =
    movie.videos?.results?.find((v:any)=>v.site==="YouTube")

  const similar = movie.similar?.results?.slice(0,12) || []

  const genres =
    movie.genres?.map((g:any)=>g.name).join(" • ")


  /* ================= UI ================= */

  return(

    <div className="bg-black text-white min-h-screen">

      {/* HERO */}

      <section className="relative h-[80vh] flex items-end px-16 pb-24 overflow-hidden">

        {showTrailer && trailerVideo ?(

          <iframe
            className="absolute inset-0 w-full h-full scale-150 opacity-40 pointer-events-none"
            src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerVideo.key}`}
            allow="autoplay"
          />

        ):movie.backdrop_path &&(

          <img
            src={BACKDROP+movie.backdrop_path}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />

        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"/>

        <div className="relative z-10 flex gap-10 max-w-6xl">

          {/* Poster */}

          {movie.poster_path &&(

            <img
              src={IMAGE+movie.poster_path}
              className="w-60 rounded-xl shadow-xl"
            />

          )}

          {/* Info */}

          <div>

            <h1 className="text-5xl font-bold mb-4">
              {movie.title}
            </h1>

            <div className="flex gap-4 text-sm text-gray-400 mb-2">

              <span>⭐ {movie.vote_average?.toFixed(1)}</span>

              <span>{movie.release_date?.slice(0,4)}</span>

              <span>{movie.runtime} min</span>

            </div>

            {genres &&(
              <p className="text-sm text-gray-400 mb-4">
                {genres}
              </p>
            )}

            <p className="text-gray-300 max-w-xl mb-6">
              {movie.overview}
            </p>


            {/* Buttons */}

            <div className="flex gap-4 flex-wrap mb-6">

              <WatchlistButton movie={movie}/>

              <button
                onClick={toggleWatched}
                className={`px-6 py-3 rounded-md transition
                ${
                  isWatched
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-green-600 hover:bg-green-500"
                }`}
              >
                {isWatched ? "✓ Watched" : "Mark Watched"}
              </button>

              {trailerVideo &&(

                <button
                  onClick={()=>setTrailerKey(trailerVideo.key)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-md"
                >
                  ▶ Watch Trailer
                </button>

              )}

            </div>

            <MovieRating movieId={movie.id}/>

          </div>

        </div>

      </section>


      {/* Director */}

      {director &&(

        <section className="px-16 py-12 border-b border-white/10">

          <h2 className="text-2xl mb-4">Director</h2>

          <p className="text-gray-300">
            {director.name}
          </p>

        </section>

      )}


      {/* Cast */}

      {cast.length>0 &&(

        <section className="px-16 py-16">

          <h2 className="text-2xl mb-8">
            Top Cast
          </h2>

          <div className="flex gap-6 overflow-x-auto">

            {cast.map((actor:any)=>(

              <Link key={actor.id} href={`/person/${actor.id}`}>

                <div className="w-36 shrink-0 hover:scale-105 transition">

                  {actor.profile_path ?(

                    <img
                      src={IMAGE+actor.profile_path}
                      className="rounded-lg"
                    />

                  ):(
                    <div className="w-full h-52 bg-gray-800 rounded-lg"/>
                  )}

                  <p className="mt-2 text-sm font-semibold">
                    {actor.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {actor.character}
                  </p>

                </div>

              </Link>

            ))}

          </div>

        </section>

      )}


      {/* Reviews */}

      <ReviewSection
        movieId={movie.id}
        movieTitle={movie.title}
      />


      {/* Similar Movies */}

      {similar.length>0 &&(

        <section className="px-16 py-20 border-t border-white/10">

          <h2 className="text-2xl mb-10">
            You May Also Like
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">

            {similar.map((item:any)=>(

              <Link key={item.id} href={`/movie/${item.id}`}>

                <div className="hover:scale-105 transition">

                  {item.poster_path &&(

                    <img
                      src={IMAGE+item.poster_path}
                      className="rounded-lg"
                    />

                  )}

                  <p className="mt-2 text-sm line-clamp-1">
                    {item.title}
                  </p>

                </div>

              </Link>

            ))}

          </div>

        </section>

      )}

      <TrailerModal
        videoKey={trailerKey}
        onClose={()=>setTrailerKey(null)}
      />

    </div>

  )

}