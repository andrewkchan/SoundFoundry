import { CLIENT_ID } from "../constants/config";
import { GENRES_MAP, IMAGE_SIZES } from "../constants/SongConstants";

/*
 * function constructCategoryUrl
 * Construct a URL to display songs for a given category.
 */
export function constructCategoryUrl(cat) {
    const catArr = cat.split(' - ');
    let category = catArr[0];
    let result = '//api.soundcloud.com/tracks?linked_partitioning=1&client_id=' +
    `${CLIENT_ID}&limit=50&offset=0`;

    if (category in GENRES_MAP) {
    if (category !== 'house'
    && category !== 'trance'
    && category !== 'dubstep') {
      category = `${category} house`;
    }

    result += `&tags=${category}`;
    } else {
    result += `&q=${category}`;
    }

    if (catArr.length > 1) {
    const formattedTime = moment().subtract(catArr[1], 'days').format('YYYY-MM-DD%2012:00:00');
    result += `&created_at[from]=${formattedTime}`;
    }

    return result;
}

export function getImageUrl(s, size = null) {
    if (!s) {
        return "";
    }

    s = s.replace("http:", "");

    switch (size) {
        case IMAGE_SIZES.LARGE:
            return s.replace("large", IMAGE_SIZES.LARGE);
        case IMAGE_SIZES.XLARGE:
            return s.replace("large", IMAGE_SIZES.XLARGE);
        case IMAGE_SIZES.ORIGINAL:
            return s.replace("large", IMAGE_SIZES.ORIGINAL);
        default:
            return s;
    }
}

export function getWaveformUrl(s) {
    if (!s) {
        return "";
    }

    s = s.replace("http:", "");
    s = s.replace("w1", "wis");
    s = s.replace("png", "json");

    return s;
}

/*
Prunes the waveform returned by soundcloud, only keeping every 18th data point.
*/
export function pruneWaveformSamples(waveform) {
    waveform.samples = waveform.samples.filter((val, i) => {
        return i % 18 === 0;
    });
    return waveform;
}
