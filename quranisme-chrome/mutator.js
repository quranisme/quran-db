// Mutate to only Arabic and 2 Translation
const fs = require('fs');
const got = require('got');
const axios = require('axios');
const _ = require('lodash');
const he = require('he');
const jsonfile = require('jsonfile');
const {
    chapters: chapters_en
} = require('../qapi/chapters_en.js');
const {
    chapters: chapters_id
} = require('../qapi/chapters_id.js');

const objectToWrite = [{}];

const wroteNew = (id, response) => {
    console.log('====================== BEGIN WROTE')
    let data = response
    jsonfile.writeFileSync(`./statics/chapter_${id}.json`, data);
}

const tooked = (id) => {
    let url = `../fixdb/en/chapter_${id}.json`
    let url2 = `../fixdb/id/chapter_${id}.json`
    let url3 = `./statics/quran-tajweed/chapter_${id}.json`
    let response = jsonfile.readFileSync(url);
    let response2 = jsonfile.readFileSync(url2);
    let response3 = jsonfile.readFileSync(url3);
    return [response, response2, response3]
}

const morphling = (array, number) => {
    let wrapped = []
    let en = array[0].chapters.verses;
    let id = array[1].chapters.verses;
    let tajweed = array[2].chapters.verses;
    let morphedArr = [] //This local var to produce array
    // let morphedObj = {}  //to produce obj, temp var
    let morphedWords = []
    _.each(en, (v, k) => {
        number += 1;
        let morphedObj = {
            verse_number: v.verse_number,
            verse_total_number: number,
            text_madani: v.text_madani,
            text_tajweed: tajweed[k].text_tajweed,
            translation_en: v.translation,
            translation_id: id[k].translation,
            sajdah: v.sajdah,
            sajdah_number: v.sajdah_number,
        }
        wrapped.push(morphedObj);
    })
    return wrapped;
}


//! Main Interation
let totalVerse = 0;
_.each(chapters_en, async (v, k) => {
    let ink = []
    let model = {
        chapter_number: v.chapter_number,
        bismillah_pre: v.bismillah_pre,
        revelation_order: v.revelation_order,
        revelation_place: v.revelation_place,
        name_arabic: v.name_arabic,
        name_complex: v.name_complex,
        name_simple: v.name_simple,
        verses_count: v.verses_count,
        pages: v.pages,
        meaning: {
            'text': v.translated_name.name,
            'en': v.translated_name.name,
            'id': chapters_id[k].translated_name.name,
        },
        verses: []
    };

    // EXCEPT surat 77 since last fail
    if (v.chapter_number !== 5123) {
        model.verses = morphling(tooked(v.chapter_number), totalVerse);
        wroteNew(v.chapter_number, model);
    }
    totalVerse += v.verses_count
})
