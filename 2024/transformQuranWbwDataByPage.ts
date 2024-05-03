import quran from '@kmaslesa/holy-quran-word-by-word-full-data';
import * as fs from 'fs';
import {groupBy} from 'lodash';


const url = (pageNumber: string) => {
    return `https://api.qurancdn.com/api/qdc/verses/by_page/${pageNumber}?words=true&per_page=all&fields=text_uthmani%2Cchapter_id%2Chizb_number%2Ctext_imlaei_simple&reciter=1&word_translation_language=en&word_fields=verse_key%2Cverse_id%2Cpage_number%2Clocation%2Ctext_uthmani%2Ccode_v2%2Ccode_v1%2Cqpc_uthmani_hafs&filter_page_words=true&mushaf=1`
}

const kmasleha = (pageNumber: number) => quran.getWordsByPage(pageNumber);
const v2Quran = (pageNumber: number) => require(`../statics/quran/page-raw-v2/${pageNumber}.json`);
const v1Quran = (pageNumber: number) => require(`../statics/quran/page-raw-v1/${pageNumber}.json`);

const translationIdByChapter = (chapter_number: number) => {
    return require(`../statics/id/${chapter_number}.json`);
}
const getVerseWords = (verse: any, isReadingView = false): any[] => {
    const words = [];
    verse.words.forEach((word) => {
        const wordVerse = { ...verse };
        words.push({
            ...word,
            hizbNumber: verse.hizb_number,
            // ...(isReadingView && { verse: wordVerse }),
        });
    });
    return words;
};

export const groupLinesByVerses = (verses: any[]): Record<string, any[]> => {
    let words = [];


    // Flattens the verses into an array of words
    verses.forEach((verse, idx) => {
        words = [...words, ...getVerseWords(verse, true)];
    });

    // Groups the words based on their (page and) line number
    const lines = groupBy(words, 'line_number');

    // console.log(ayt.value.ayahs)
    return lines;
};

const exampleStructure = {
    verses: [
        {
            metaData: {},
            words: {

            }
        },
    ]
}
const run = async () => {
    for (let i = 1; i <= 604; i++) {
        const { ayahs } = await kmasleha(i);
        const { verses } = v2Quran(i);
        // const { verses } = v1Quran(i);
        const tobeProcessed = Object.values(groupLinesByVerses(verses));
        let realIndex = 0;
        const translation = (verseKey, position) => {
            const [chapter, verse] = verseKey.split(':');
            const data = translationIdByChapter(chapter)[verse];
            return data.split('//')[position - 1];
        }
        /*
        * V2 Transformation
        * */
        // const newData = ayahs.map((ayah, idx) => {
        //     if(!ayah.metaData.lineType) {
        //         const words = tobeProcessed[realIndex];
        //         let word = [];
        //         if(words) {
        //             word = words.map((word, idx) => {
        //                 return {
        //                     verse_id: word?.verse_id,
        //                     position: word?.position,
        //                     location: word?.location,
        //                     verse_key: word?.verse_key,
        //                     char_type_name: word?.char_type_name,
        //                     qpc_uthmani_hafs: word?.qpc_uthmani_hafs,
        //                     translation_id: translation(word?.verse_key, word?.position),
        //                     translation_en: word?.translation.text,
        //                     transliteration: word?.transliteration.text,
        //                     code_v1: word?.code_v1,
        //                     code_v2: word?.code_v2,
        //                 }
        //             });
        //         }
        //         const result =  {
        //             metaData: ayah.metaData,
        //             // meta: {
        //             //     chapter_number: verses[realIndex]?.chapter_number,
        //             //     verse_number: verses[realIndex]?.verse_number,
        //             //     page_number: verses[realIndex]?.page_number,
        //             //     hizb_number: verses[realIndex]?.hizb_number,
        //             //     juz_number: verses[realIndex]?.juz_number,
        //             //     rub_el_hizb_number: verses[realIndex]?.rub_el_hizb_number,
        //             //     manzil_number: verses[realIndex]?.manzil_number,
        //             //     ruku_number: verses[realIndex]?.ruku_number,
        //             //     sajdah_number: verses[realIndex]?.sajdah_number,
        //             //     text_uthmani: verses[realIndex]?.text_uthmani,
        //             //     text_imlaei_simple: verses[realIndex]?.text_imlaei_simple,
        //             //     timestamp_from: verses[realIndex]?.timestamps.timestamps_from,
        //             // },
        //             words: word
        //         }
        //         realIndex++;
        //         return result;
        //     }
        //     return {
        //         metaData: ayah.metaData,
        //         words: []
        //     }
        // });
        /*
        * V1 Transformation
        * */
        const newData = ayahs.map((ayah, idx) => {
            const { words } = ayah;
            const newWords = words.map((word, idxword) => {
                const location = `${word.parentAyahVerseKey}:${word.position}`;
                const test = v1Quran(i)
                    .verses?.find(v => v.verse_key === word.parentAyahVerseKey)
                    .words.find(w => w.location === location);
                if(test) {
                    realIndex++;
                    return {
                        verse_id: test?.verse_id,
                        position: test?.position,
                        location: test?.location,
                        verse_key: test?.verse_key,
                        char_type_name: test?.char_type_name,
                        qpc_uthmani_hafs: test?.qpc_uthmani_hafs,
                        translation_id: translation(test?.verse_key, test?.position),
                        translation_en: test?.translation.text,
                        transliteration: test?.transliteration.text,
                        code_v1: test?.code_v1,
                        code_v2: test?.code_v2,
                    }
                } else {
                    return {
                        ...word,
                    }
                }
            });
            return {
                metaData: ayah.metaData,
                words: newWords
            }
        });
        fs.writeFile(`./src/statics/quran/page-min-v1/${i}.json`, JSON.stringify({ lines: newData }), (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}

/*
* Scraping the data from the qurancdn.com
* */
// const run = async () => {
//     for (let i = 1; i <= 604; i++) {
//         const fetchData = await fetch(url(i));
//         const data = await fetchData.json();
//         fs.writeFileSync(`./src/statics/quran/page-raw-v2/${i}.json`, JSON.stringify(data));
//     }
// }

run();
