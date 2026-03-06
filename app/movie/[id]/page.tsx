import { headers } from "next/headers";
import MovieDetailsClient from "@/components/MovieDetailsClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const headersList = await headers();
  const host = headersList.get("host");
const res = await fetch(
`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos,similar,watch/providers`
);

if (!res.ok) {
  return (
    <div className="min-h-screen bg-black text-white p-20">
      Failed to load movie.
    </div>
  );
}

const movie = await res.json();
  return <MovieDetailsClient movie={movie} />;
}