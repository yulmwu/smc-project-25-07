import * as tiger from './tiger'
import * as leopardAndBear from './leopardAndBear'
import * as weather from './weather'
import * as naturalDisaster from './naturalDisaster'

interface WikiEntry {
    ko: { title: string; content: string }
    en: { title: string; content: string }
}

export const wikiContent: { [key: string]: WikiEntry } = {
    tiger: {
        ko: {
            title: '동물: 호랑이',
            content: tiger.ko,
        },
        en: {
            title: 'Animals: Tiger',
            content: tiger.en,
        },
    },
    leopardAndBear: {
        ko: {
            title: '동물: 표범과 반달가슴곰',
            content: leopardAndBear.ko,
        },
        en: {
            title: 'Animals: Leopard and Asiatic Black Bear',
            content: leopardAndBear.en,
        },
    },
    weather: {
        ko: {
            title: '날씨와 기후',
            content: weather.ko,
        },
        en: {
            title: 'Weather and Climate',
            content: weather.en,
        },
    },
    naturalDisaster: {
        ko: {
            title: '자연재해',
            content: naturalDisaster.ko,
        },
        en: {
            title: 'Natural Disasters',
            content: naturalDisaster.en,
        },
    },
}
