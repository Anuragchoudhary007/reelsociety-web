import {
  getTrending,
  getTopRated,
  getPopular,
  getHorror,
  getComedy,
  getAnime,
  getSpy
} from "./tmdbService"

export async function loadHomeData(){

  const [
    trending,
    topRated,
    popular,
    horror,
    comedy,
    anime,
    spy
  ] = await Promise.all([
    getTrending(),
    getTopRated(),
    getPopular(),
    getHorror(),
    getComedy(),
    getAnime(),
    getSpy()
  ])

  return {

    trending: trending.results,
    topRated: topRated.results,
    popular: popular.results,
    horror: horror.results,
    comedy: comedy.results,
    anime: anime.results,
    spy: spy.results

  }
}