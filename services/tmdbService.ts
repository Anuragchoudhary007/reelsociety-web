// const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY

// const BASE_URL = "https://api.themoviedb.org/3"

// async function fetchTMDB(endpoint:string){

//   const res = await fetch(
//     `${BASE_URL}${endpoint}&api_key=${API_KEY}`
//   )

//   return res.json()
// }

// export async function getTrending(){

//   return fetchTMDB("/trending/movie/week?")
// }

// export async function getTopRated(){

//   return fetchTMDB("/movie/top_rated?")
// }

// export async function getPopular(){

//   return fetchTMDB("/movie/popular?")
// }

// export async function getHorror(){

//   return fetchTMDB("/discover/movie?with_genres=27")
// }

// export async function getComedy(){

//   return fetchTMDB("/discover/movie?with_genres=35")
// }

// export async function getAnime(){

//   return fetchTMDB("/discover/tv?with_genres=16")
// }

// export async function getSpy(){

//   return fetchTMDB("/discover/movie?with_keywords=spy")
// }


const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"
async function fetchTMDB(endpoint:string){

  try{

    const res = await fetch(
      `${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}`,
      { cache:"no-store" }
    )

    if(!res.ok){
      console.error("TMDB error:",res.status)
      return { results: [] }
    }

    return await res.json()

  }catch(err){

    console.error("TMDB fetch error:",err)

    return { results: [] }

  }

}
export async function getTrending(){
  return fetchTMDB("/trending/movie/week")
}

export async function getTopRated(){
  return fetchTMDB("/movie/top_rated")
}

export async function getPopular(){
  return fetchTMDB("/movie/popular")
}

export async function getHorror(){
  return fetchTMDB("/discover/movie?with_genres=27")
}

export async function getComedy(){
  return fetchTMDB("/discover/movie?with_genres=35")
}

export async function getAnime(){
  return fetchTMDB("/discover/tv?with_genres=16")
}

export async function getSpy(){
  return fetchTMDB("/discover/movie?with_keywords=spy")
}