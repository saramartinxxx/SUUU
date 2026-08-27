const movieGenres = {
    "12": "Adventure",
    "14": "Fantasy",
    "16": "Animation",
    "18": "Drama",
    "27": "Horror",
    "28": "Action",
    "35": "Comedy",
    "36": "History",
    "37": "Western",
    "53": "Thriller",
    "80": "Crime",
    "878": "Science Fiction",
    "9648": "Mystery",
    "99": "Documentary",
    "10402": "Music",
    "10749": "Romance",
    "10751": "Family",
    "10752": "War",
    "10770": "TV Movie"
}

const tvGenres = {
    "16": "Animation",
    "18": "Drama",
    "35": "Comedy",
    "37": "Western",
    "80": "Crime",
    "99": "Documentary",
    "9648": "Mystery",
    "10751": "Family",
    "10759": "Action & Adventure",
    "10762": "Kids",
    "10763": "News",
    "10764": "Reality",
    "10765": "Sci-Fi & Fantasy",
    "10766": "Soap",
    "10767": "Talk",
    "10768": "War & Politics"
}

const getGenres = (id, type) => {
    if (!id) return '';
    if (Array.isArray(id)) {
        if (!id.length) return '';
        if (type) {
            return id.map(e => ((type === "movie" ? movieGenres : tvGenres))[e]);
        }
        return id.map(e => ({ ...movieGenres, ...tvGenres }[e]));
    }
    if (type) {
        return type === "movie" ? movieGenres[id] : tvGenres[id];
    }
    return { ...movieGenres, ...tvGenres }[id];
}

export { getGenres, movieGenres, tvGenres }
