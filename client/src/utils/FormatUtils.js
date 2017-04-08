import { CLIENT_ID } from "../constants/config";

//TODO: make a good description for this
export function formatSongTitle(str) {
    if(!str) {
        return "";
    }

    const arr = str.replace("–", "-").split(" - ");

    return arr[arr.length - 1].split(" (")[0];
}

export function formatSongTitleShort(str) {
    let prettyPrinted = formatSongTitle(str);
    if (prettyPrinted.length > 30) {
        return prettyPrinted.slice(0, 30) + "...";
    }
    return prettyPrinted;
}

export function formatSeconds(num) {
    const minutes = padZero(Math.floor(num / 60), 2);
    const seconds = padZero(num % 60, 2);
    return `${minutes}:${seconds}`;
}

export function formatStreamUrl(str) {
    return `${str}?client_id=${CLIENT_ID}`;
}

export function padZero(num, size) {
    let s = String(num);
    while (s.length < size) {
        s = `0${s}`;
    }
    return s;
}
