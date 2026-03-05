import { NextResponse } from "next/server";

const TMDB = process.env.TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

export async function GET() {
  try {

    if (!TMDB) {
      return NextResponse.json(
        { error: "TMDB key missing" },
        { status: 500 }
      );
    }

    const endpoints = [
      `${BASE}/trending/movie/day?api_key=${TMDB}`,
      `${BASE}/movie/upcoming?api_key=${TMDB}`,
      `${BASE}/trending/person/day?api_key=${TMDB}`,
      `${BASE}/movie/now_playing?api_key=${TMDB}`
    ];

    const results = await Promise.all(
      endpoints.map(async (url) => {
        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
          throw new Error("TMDB fetch failed");
        }

        return res.json();
      })
    );

    const [trending, upcoming, people, nowPlaying] = results;

    const feed = [
      ...(trending.results || []).slice(0, 5).map((item: any) => ({
        type: "trending",
        title: item.title,
        id: item.id,
        image: item.backdrop_path,
        description: item.overview
      })),

      ...(upcoming.results || []).slice(0, 5).map((item: any) => ({
        type: "upcoming",
        title: item.title,
        id: item.id,
        image: item.backdrop_path,
        description: item.overview
      })),

      ...(people.results || []).slice(0, 5).map((person: any) => ({
        type: "person",
        title: person.name,
        id: person.id,
        image: person.profile_path,
        description: `Trending for ${person.known_for_department}`
      })),

      ...(nowPlaying.results || []).slice(0, 5).map((item: any) => ({
        type: "now_playing",
        title: item.title,
        id: item.id,
        image: item.backdrop_path,
        description: item.overview
      }))
    ];

    return NextResponse.json({ feed });

  } catch (error: any) {
    console.error("FEED ERROR:", error.message);
    return NextResponse.json(
      { error: "Feed failed", details: error.message },
      { status: 500 }
    );
  }
}