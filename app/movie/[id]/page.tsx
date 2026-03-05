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
    `http://${host}/api/movie/${id}`,
    { cache: "no-store" }
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