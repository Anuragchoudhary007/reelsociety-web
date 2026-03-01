import MovieClient from "./MovieClient"

interface MoviePageProps {
  params: {
    id: string
  }
}

async function getMovie(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/movie/${id}`, {
      cache: "no-store",
    })

    if (!res.ok) return null

    return await res.json()
  } catch {
    return null
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movie = await getMovie(params.id)

  if (!movie) {
    return (
      <div className="p-40 text-center text-textSoft">
        Unable to load movie right now.
      </div>
    )
  }

  return <MovieClient movie={movie} />
}