import { base, request } from "../api/themoviedb.js";

const channels = [
    {
        "logo_path": "/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg",
        "provider_name": "Netflix",
        "provider_id": 8
    },
    {
        "logo_path": "/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg",
        "provider_name": "Apple TV+",
        "provider_id": 350
    },
    {
        "logo_path": "/pvske1MyAoymrs5bguRfVqYiM9a.jpg",
        "provider_name": "Prime Video",
        "provider_id": 9
    },
    {
        "logo_path": "/bxBlRPEPpMVDc4jMhSrTf2339DW.jpg",
        "provider_name": "Hulu",
        "provider_id": 15
    },
    {
        "logo_path": "/97yvRBw1GzX7fXprcF80er19ot.jpg",
        "provider_name": "Disney+",
        "provider_id": 337
    },
    {
        "logo_path": "/qR6FKvnPBx2O37FDg8PNM7efwF3.jpg",
        "provider_name": "Amazon Video",
        "provider_id": 10
    },
    {
        "logo_path": "/SPnB1qiCkYfirS2it3hZORwGVn.jpg",
        "provider_name": "Apple TV Store",
        "provider_id": 2
    },
    {
        "logo_path": "/fzN5Jok5Ig1eJ7gyNGoMhnLSCfh.jpg",
        "provider_name": "Crunchyroll",
        "provider_id": 283
    },
    {
        "logo_path": "/9BgaNQRMDvVlji1JBZi6tcfxpKx.jpg",
        "provider_name": "fuboTV",
        "provider_id": 257
    },
    {
        "logo_path": "/jbe4gVSfRlbPTdESXhEKpornsfu.jpg",
        "provider_name": "HBO Max",
        "provider_id": 1899
    },
];

const data_scroll = [
    {
        label: "Trending",
        tabs: [
            {
                label: "Today",
                promise: () => request(base("trending/all/day?language=en-US")),
            },
            {
                label: "This Week",
                promise: () => request(base("trending/all/week?language=en-US")),
            },
        ],
    },
    {
        label: "Streaming",
        hint: "TV SHOWS",
        tabs: channels.map(e => ({
            label: e.provider_name,
            promise: () => request(base(`discover/tv?with_watch_providers=${e.provider_id}&watch_region=US&sort_by=release_date.desc&page=1`))
        })),
    },
    {
        label: "Now Playing",
        promise: () => request(base("movie/now_playing?language=en-US")),
    },
    {
        label: "TV On The Air",
        promise: () => request(base("tv/on_the_air?language=en-US")),
    },
    {
        label: "Popular",
        tabs: [
            {
                label: "Movie",
                promise: () => request(base("movie/popular?language=en-US")),
            },
            {
                label: "TV",
                promise: () => request(base("tv/popular?language=en-US")),
            },
        ],
    },
    {
        label: "Top Rated",
        tabs: [
            {
                label: "Movie",
                promise: () => request(base("movie/top_rated?language=en-US")),
            },
            {
                label: "TV",
                promise: () => request(base("tv/top_rated?language=en-US")),
            },
        ],
    },
    {
        label: "Upcoming",
        promise: () => request(base("movie/upcoming?language=en-US")),
    },
    {
        label: "TV Airing Today",
        promise: () => request(base("tv/airing_today?language=en-US")),
    },
    {
        label: "Action & Adventure",
        tabs: [
            {
                label: "Movie",
                promise: () => request(base("discover/movie?with_genres=28&sort_by=popularity.desc&language=en-US")),
            },
            {
                label: "TV",
                promise: () => request(base("discover/tv?with_genres=10759&sort_by=popularity.desc&language=en-US")),
            },
        ],
    },
    {
        label: "Comedy",
        tabs: [
            {
                label: "Movie",
                promise: () => request(base("discover/movie?with_genres=35&sort_by=popularity.desc&language=en-US")),
            },
            {
                label: "TV",
                promise: () => request(base("discover/tv?with_genres=35&sort_by=popularity.desc&language=en-US")),
            },
        ],
    },
    {
        label: "Crime & Mystery",
        tabs: [
            {
                label: "Movie",
                promise: () => request(base("discover/movie?with_genres=80,9648&sort_by=popularity.desc&language=en-US")),
            },
            {
                label: "TV",
                promise: () => request(base("discover/tv?with_genres=80,9648&sort_by=popularity.desc&language=en-US")),
            },
        ],
    },
    {
        label: "Sci-Fi & Fantasy",
        tabs: [
            {
                label: "Movie",
                promise: () => request(base("discover/movie?with_genres=878,14&sort_by=popularity.desc&language=en-US")),
            },
            {
                label: "TV",
                promise: () => request(base("discover/tv?with_genres=10765&sort_by=popularity.desc&language=en-US")),
            },
        ],
    },
    {
        label: "Horror",
        promise: () => request(base("discover/movie?with_genres=27&sort_by=popularity.desc&language=en-US")),
    },
    {
        label: "Romance",
        tabs: [
            {
                label: "Movie",
                promise: () => request(base("discover/movie?with_genres=10749&sort_by=popularity.desc&language=en-US")),
            },
            {
                label: "TV",
                promise: () => request(base("discover/tv?with_genres=10749&sort_by=popularity.desc&language=en-US")),
            },
        ],
    },
    {
        label: "Animation",
        tabs: [
            {
                label: "Movie",
                promise: () => request(base("discover/movie?with_genres=16&sort_by=popularity.desc&language=en-US")),
            },
            {
                label: "TV",
                promise: () => request(base("discover/tv?with_genres=16&sort_by=popularity.desc&language=en-US")),
            },
        ],
    },
    {
        label: "Documentaries",
        tabs: [
            {
                label: "Movie",
                promise: () => request(base("discover/movie?with_genres=99&sort_by=popularity.desc&language=en-US")),
            },
            {
                label: "TV",
                promise: () => request(base("discover/tv?with_genres=99&sort_by=popularity.desc&language=en-US")),
            },
        ],
    }
];

export { data_scroll };