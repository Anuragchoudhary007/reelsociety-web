import Image from "next/image"
import { doc, setDoc } from "firebase/firestore";

const addToList = async (listId: string, movie: any) => {
  if (!user) return;

  await setDoc(
    doc(db, "users", user.uid, "lists", listId, "items", movie.id),
    {
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    }
  );
};

interface MoviePageProps {
  params: Promise<{
    id: string
  }>
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
  const { id } = await params   // ✅ UNWRAP PARAMS HERE

  const movie = await getMovie(id)

  if (!movie) {
    return (
      <div className="p-40 text-center text-textSoft">
        Unable to load movie right now.
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">

      {/* BACKDROP */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover opacity-30 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-bg" />
      </div>

      <div className="px-10 py-32 flex gap-16">

        <div className="w-[300px] flex-shrink-0">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={300}
            height={450}
            className="rounded-lg shadow-2xl"
          />
        </div>

        <div className="max-w-2xl">

          <h1 className="text-5xl font-serif mb-6">
            {movie.title}
          </h1>

          <div className="flex gap-6 text-textSoft mb-6 text-sm">
            <span>{movie.release_date?.split("-")[0]}</span>
            <span>•</span>
            <span>{movie.runtime} min</span>
            <span>•</span>
            <span>⭐ {movie.vote_average?.toFixed(1)}</span>
          </div>

          <p className="text-textSoft mb-10 leading-relaxed">
            {movie.overview}
          </p>

        </div>
      </div>
    </div>
  )
}