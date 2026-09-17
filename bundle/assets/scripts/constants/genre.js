const movieGenres = [
    { id: 12, name: "Adventure" },
    { id: 14, name: "Fantasy" },
    { id: 16, name: "Animation" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 36, name: "History" },
    { id: 37, name: "Western" },
    { id: 53, name: "Thriller" },
    { id: 80, name: "Crime" },
    { id: 878, name: "Science Fiction" },
    { id: 9648, name: "Mystery" },
    { id: 99, name: "Documentary" },
    { id: 10402, name: "Music" },
    { id: 10749, name: "Romance" },
    { id: 10751, name: "Family" },
    { id: 10752, name: "War" },
    { id: 10770, name: "TV Movie" }
];

const tvGenres = [
    { id: 10759, name: "Action & Adventure" },
    { id: 18, name: "Drama" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 37, name: "Western" },
    { id: 80, name: "Crime" },
    { id: 9648, name: "Mystery" },
    { id: 10751, name: "Family" },
    { id: 10762, name: "Kids" },
    { id: 10763, name: "News" },
    { id: 10764, name: "Reality" },
    { id: 10765, name: "Sci-Fi & Fantasy" },
    { id: 10766, name: "Soap" },
    { id: 10767, name: "Talk" },
    { id: 99, name: "Documentary" },
    { id: 10768, name: "War & Politics" }
];

const getGenres = (id, type) => {
    if (!id) return [''];
    if (Array.isArray(id)) {
        if (!id.length) return [''];
        if (type) {
            return id.map(e => ((type === "movie" ? movieGenres : tvGenres)).find(x => x.id === e)?.name);
        }
        return id.map(e => ([...movieGenres, ...tvGenres].find(x => x.id === e)?.name));
    }
    if (type) {
        return [(type === "movie" ? movieGenres : tvGenres).find(x => x.id === id)?.name];
    }
    return [[...movieGenres, ...tvGenres].find(x => x.id === id)?.name];
}

export { getGenres, movieGenres, tvGenres }
