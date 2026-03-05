import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=combined_credits`
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch person" },
      { status: 500 }
    );
  }
}