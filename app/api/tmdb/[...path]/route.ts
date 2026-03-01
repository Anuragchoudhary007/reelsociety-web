import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const joinedPath = path?.join("/") || "";

    const url = new URL(request.url);
    const query = url.search;

    const finalUrl = `https://api.themoviedb.org/3/${joinedPath}${query}${
      query ? "&" : "?"
    }api_key=${process.env.TMDB_API_KEY}`;

    const response = await fetch(finalUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "TMDB request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Proxy crash:", error);
    return NextResponse.json(
      { error: "TMDB Proxy Error" },
      { status: 200 } // 👈 IMPORTANT: do not break UI
    );
  }
}