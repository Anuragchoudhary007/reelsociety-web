"use client";

import { useState,useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar(){

  const {user} = useAuth();

  const [query,setQuery] = useState("");
  const [results,setResults] = useState<any[]>([]);

  useEffect(()=>{

    if(query.length<2){
      setResults([]);
      return;
    }

    const fetchSearch = async()=>{

      try{

        const res = await fetch(
          `/api/tmdb/search/multi?query=${encodeURIComponent(query)}`
        );

        const data = await res.json();

        setResults(data?.results?.slice(0,6) || []);

      }catch(e){
        setResults([]);
      }

    };

    const delay = setTimeout(fetchSearch,400);

    return ()=>clearTimeout(delay);

  },[query]);



  return(

    <nav className="flex items-center justify-between px-10 py-6 border-b border-white/10 bg-black/80 backdrop-blur">

      {/* Logo */}

      <Link href="/">
        <h1 className="text-xl font-semibold text-red-500">
          ReelSociety
        </h1>
      </Link>


      {/* SEARCH */}

      <div className="relative w-96">

        <input
          type="text"
          placeholder="Search movies or actors..."
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          className="w-full p-2 bg-black border border-white/20 rounded-md"
        />

        {results.length>0 &&(

          <div className="absolute top-12 w-full bg-black border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">

            {results.map(item=>(

              <Link
                key={item.id}
                href={
                  item.media_type==="person"
                  ? `/person/${item.id}`
                  : `/movie/${item.id}`
                }
              >

                <div className="flex items-center gap-3 p-3 hover:bg-white/5">

                  {item.poster_path ?(

                    <img
                      src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                      className="w-10 h-14 object-cover rounded"
                    />

                  ):(
                    <div className="w-10 h-14 bg-gray-800 rounded"/>
                  )}

                  <div>

                    <p className="text-sm">
                      {item.title || item.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {item.release_date?.slice(0,4)}
                    </p>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>


      {/* USER */}

      <div className="flex items-center gap-4">

        <Link href="/profile">
          <button className="border border-white/20 px-4 py-2 rounded hover:bg-white/10 text-sm">
            Profile
          </button>
        </Link>

        {user &&(

          <button
            onClick={()=>signOut(auth)}
            className="border border-white/20 px-4 py-2 rounded hover:bg-white/10 text-sm"
          >
            Logout
          </button>

        )}

      </div>

    </nav>

  );

}