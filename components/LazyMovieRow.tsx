"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import MovieRow from "./MovieRow"

export default function LazyMovieRow({
  title,
  endpoint
}: {
  title: string
  endpoint: string
}) {

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px"
  })

  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    if (!inView) return

    async function load() {

      try {

        setLoading(true)

        const res = await fetch(endpoint)

        // 🛑 If API failed (404, 500 etc)
        if (!res.ok) {
          console.error("API failed:", endpoint)
          setMovies([])
          return
        }

        // safer JSON parsing
        const text = await res.text()

        if (!text) {
          setMovies([])
          return
        }

        const data = JSON.parse(text)

        // normalize response
        const movieList =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.results)
            ? data.results
            : []

        setMovies(movieList)

      } catch (err) {

        console.error("LazyMovieRow error:", err)
        setMovies([])

      } finally {

        setLoading(false)

      }

    }

    load()

  }, [inView, endpoint])

  return (

    <section ref={ref}>

      <h2 className="text-xl font-semibold mb-5 text-white">
        {title}
      </h2>

      <MovieRow movies={movies} loading={loading} />

    </section>

  )

}