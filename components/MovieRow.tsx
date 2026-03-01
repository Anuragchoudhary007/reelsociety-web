// import Link from "next/link"

// interface Movie {
//   id: number
//   title: string
//   poster_path: string
//   release_date: string
// }

// interface MovieRowProps {
//   title: string
//   endpoint: string
// }

// export default async function MovieRow({
//   title,
//   endpoint,
// }: MovieRowProps) {

//   const res = await fetch(
//     `https://api.themoviedb.org/3${endpoint}?api_key=${process.env.TMDB_API_KEY}`,
//     { next: { revalidate: 3600 } }
//   )

//   const data = await res.json()
//   const movies: Movie[] = data.results.slice(0, 10)

//   return (
//     <div className="px-8 mb-20">
//       <h2 className="text-2xl font-semibold mb-8 tracking-wide">
//         {title}
//       </h2>

//       <div className="flex gap-8 overflow-x-auto pb-4">
//         {movies.map((movie) => (
//           <Link
//             href={`/movie/${movie.id}`}
//             key={movie.id}
//             className="group min-w-[200px]"
//           >
//             <div className="relative h-[300px] overflow-hidden rounded-md border border-white/5 transition duration-500 group-hover:scale-105 group-hover:shadow-2xl">

//               <img
//                 src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//                 alt={movie.title}
//                 className="object-cover w-full h-full"
//               />

//               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-500" />
//             </div>

//             <div className="mt-4">
//               <h3 className="text-sm font-medium">
//                 {movie.title}
//               </h3>
//               <p className="text-xs text-textSoft">
//                 {movie.release_date?.split("-")[0]}
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   )
// }

interface MovieRowProps {
  title: string
}

export default function MovieRow({ title }: MovieRowProps) {
  return (
    <div className="px-8 mb-20">
      <h2 className="text-2xl mb-8">{title}</h2>
      <div>Demo Content</div>
    </div>
  )
}