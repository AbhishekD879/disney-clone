const APIkey = process.env.TMDB_API_KEY || '0f7f5ba5d4253e1de3b2e6960b3193af'

const request = {
  fetchTrending: `/trending/all/day?api_key=${APIkey}`,
  fetchpopularmovies: `/movie/popular?api_key=${APIkey}&page=1`,
  fetchtopratedmovies: `/movie/top_rated?api_key=${APIkey}&page=1`,
  fetchratedshows: `/tv/top_rated?api_key=${APIkey}&page=1`,
  fetchpopularshows: `/tv/popular?api_key=${APIkey}&page=1`,
  fetchtvshowtrailer: `/tv/{tv_id}/similar?api_key=${APIkey}&page=1`,
  fetchupcoming: `/movie/upcoming?api_key=${APIkey}&language=en-US&page=1`,
  fetchpopularhindi: `/movie/popular?api_key=${APIkey}&page=1&with_original_language=hi`,
  fetchpopulartvhindi: `/tv/popular?api_key=${APIkey}&page=1&with_original_language=hi`,
  fetchratedhindishows: `/tv/top_rated?api_key=${APIkey}&page=1&with_original_language=hi`
}

export default request
