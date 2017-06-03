export const CHANGE_TYPES = {
    NEXT: "next",
    PLAY: "play",
    PREV: "prev",
    SHUFFLE: "shuffle"
};

export const GENRES = [
    "chill",
    "house",
    "progressive",
    "tropical"
];

export const GENRES_MAP = GENRES.reduce((obj, genre) => {..., [genre]: 1}, {});

export const IMAGE_SIZES = {
    MEDIUM: "large",
    LARGE: "t300x300",
    XLARGE: "t500x500",
    ORIGINAL: "original"
};
