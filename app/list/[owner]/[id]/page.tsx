"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { motion } from "framer-motion";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

interface MovieItem {
  id: string;
  title: string;
  poster_path: string;
  release_date?: string;
  vote_average?: number;
}

export default function ListDetail() {
  const { owner, id } = useParams() as {
    owner: string;
    id: string;
  };

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [listName, setListName] = useState("Untitled Collection");
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [likes, setLikes] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!owner || !id) return;

    const fetchList = async () => {
      try {
        const listRef = doc(db, "users", owner, "lists", id);
        const listDoc = await getDoc(listRef);

        if (!listDoc.exists()) {
          setLoading(false);
          return;
        }

        const data = listDoc.data();

        const isOwner = user && user.uid === owner;

        if (!data.public && !isOwner) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        setListName(data.name || "Untitled Collection");
        setLikes(data.likes || 0);
        setFollowers(data.followers || 0);

        const itemsRef = collection(
          db,
          "users",
          owner,
          "lists",
          id,
          "items"
        );

        const snapshot = await getDocs(itemsRef);

        const movieData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MovieItem[];

        setMovies(movieData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [owner, id, user]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(movies);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    setMovies(reordered);
  };

  const removeMovie = async (movieId: string) => {
    if (!user || user.uid !== owner) return;

    await deleteDoc(
      doc(db, "users", owner, "lists", id, "items", movieId)
    );

    setMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  if (loading || authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-zinc-400">
        Syncing cinematic archive...
      </main>
    );
  }

  if (accessDenied) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-serif mb-4">Access Restricted</h2>
        <p className="text-zinc-500">This collection is private.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-8 text-red-500 hover:underline"
        >
          Return Home
        </button>
      </main>
    );
  }

  const heroPoster =
    movies.length > 0
      ? `${IMAGE_BASE}${movies[0].poster_path}`
      : null;

  return (
    <motion.main
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="relative min-h-screen bg-black text-white px-16 py-20 overflow-hidden"
    >
      {/* Film Grain */}
      <div className="pointer-events-none fixed inset-0 opacity-10 mix-blend-overlay animate-grain z-50"
           style={{ backgroundImage: "url('/grain.png')" }} />

      {/* Hero Background Drift */}
      {heroPoster && (
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center blur-3xl opacity-20 scale-110 animate-drift"
          style={{ backgroundImage: `url(${heroPoster})` }}
        />
      )}

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-zinc-950 to-black" />

      {/* Featured Film */}
      {movies[0] && (
        <div className="mb-20 relative h-[380px] rounded-3xl overflow-hidden">
          <img
            src={`${IMAGE_BASE}${movies[0].poster_path}`}
            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40"
          />
          <div className="relative z-10 h-full flex items-center px-16">
            <div>
              <h2 className="text-5xl font-serif mb-4">
                Featured: {movies[0].title}
              </h2>
              <p className="text-zinc-400 max-w-xl">
                Spotlight selection from this curated archive.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end mb-14">
        <div>
          <h1 className="text-6xl font-serif">{listName}</h1>
          <div className="flex gap-8 mt-4 text-sm text-zinc-400">
            <span>❤ {likes}</span>
            <span>{followers} followers</span>
          </div>
        </div>

        <span className="text-zinc-400 text-lg">
          {movies.length} films
        </span>
      </div>

      {/* Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="movies" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10"
            >
              {movies.map((movie, index) => (
                <Draggable
                  key={movie.id}
                  draggableId={movie.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="group relative cursor-grab active:cursor-grabbing"
                    >
                      <div className="absolute inset-0 bg-white/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500 scale-110" />

                      <div className="relative rounded-2xl overflow-hidden">
                        <img
                          src={`${IMAGE_BASE}${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-[360px] object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute top-3 left-3 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          ★ {movie.vote_average?.toFixed(1) || "—"}
                        </div>

                        {user?.uid === owner && (
                          <button
                            onClick={() => removeMovie(movie.id)}
                            className="absolute top-3 right-3 bg-black/70 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="mt-4 text-center">
                        <p className="text-sm truncate">{movie.title}</p>
                        <p className="text-xs text-zinc-500">
                          {movie.release_date?.slice(0, 4)}
                        </p>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </motion.main>
  );
}