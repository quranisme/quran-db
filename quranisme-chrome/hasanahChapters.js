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

const {
  chapters: chapters
} = require('../qapi/chapters/chapters.js');

const objectToWrite = [{}];

const wroteNew = (id, response) => {
  console.log('====================== BEGIN WROTE')
  let data = response
  jsonfile.writeFileSync(`./statics/hasanah/chapter_${id}.json`, data);
}

const wroteChapters = (response) => {
  console.log('====================== BEGIN WROTE')
  let data = response
  jsonfile.writeFileSync(`./statics/chapters.js`, data);
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

const normalize_text = function(text) {

  //remove special characters
  text = text.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '');

  //normalize Arabic
  text = text.replace(/(آ|إ|أ)/g, 'ا');
  text = text.replace(/(ة)/g, 'ه');
  text = text.replace(/(ئ|ؤ)/g, 'ء')
  text = text.replace(/(ى)/g, 'ي');

  //convert arabic numerals to english counterparts.
  var starter = 0x660;
  for (var i = 0; i < 10; i++) {
    text.replace(String.fromCharCode(starter + i), String.fromCharCode(48 + i));
  }

  return text;
}

const morphling = (array, number, hasan) => {
  let wrapped = []
  let wrapped2 = []
  let wrapped3 = []
  let en = array[0].chapters.verses;
  let id = array[1].chapters.verses;
  array[0].chapters.hasanah = 0
  let morphedArr = [] //This local var to produce array
  // let morphedObj = {}  //to produce obj, temp var
  let morphedWords = []
  let hasanah_base = 0;
  let hasanah_total = 0;

  _.each(en, (v, k) => {
    console.log(array[0].chapters.name_simple);
    number += 1;
    let arr = [];
    let hasanah_per_verse_base = 0;
    let hasanah_per_verse_total = 0;
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let a = [];
    _.each(v.words, (vv,kk) => {
      if(vv.char_type === 'word') {
        let noSpacing = `${vv.text_madani}`.replace(/\s/g, "")
        let words = normalize_text(noSpacing);
        let hasanah = {
          number: number,
          text: vv.text_madani,
          text2: words,
          deeds: words.length*10,
        }
        hasanah_base += words.length;
        hasanah_total += words.length*10;
        a.push(hasanah.deeds);

        // Setiap per verse
        hasanah_per_verse_base += words.length;
        hasanah_per_verse_total += words.length*10;
        // hasanah_per_verse_total += wordss.length*10;
        // array[0].chapters.hasanah += wordss.length*10;
        hasan += words.length*10;
        arr.push(hasanah)
      }
    })
    let morphedObj = {
      text_madani: v.text_madani,
      translation_en: v.translation,
      translation_id: id[k].translation,
      // hasanah_per_verse_base: hasanah_per_verse_base*10,
      // hasanah_per_verse_total: hasanah_per_verse_total,
      hasanah_per_verse: _.reduce(a, (res, val) => {
        return res + val;
      }, 0),
      // hasanah_base: hasanah_base,
      // hasanah_total: hasanah_total,
      // tesst: arr
    }
    wrapped.push(morphedObj);
  })
  return wrapped;
}

const countHasanah = (array, number, hasan) => {
  let wrapped = []
  let en = array[0].chapters.verses;
  let id = array[1].chapters.verses;
  let hasanah_base = 0;
  let hasanah_total = 0;

  _.each(en, (v, k) => {
    // console.log(array[0].chapters.name_simple);
    number += 1;
    let arr = [];
    let hasanah_per_verse_base = 0;
    let hasanah_per_verse_total = 0;
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let a = [];
    _.each(v.words, (vv,kk) => {
      if(vv.char_type === 'word') {
        let noSpacing = `${vv.text_madani}`.replace(/\s/g, "")
        let words = normalize_text(noSpacing);
        let hasanah = {
          number: number,
          text: vv.text_madani,
          text2: words,
          deeds: words.length*10,
        }
        // hasan += words.length*10,
        hasanah_base += words.length;
        hasanah_total += words.length*10;
        a.push(hasanah.deeds);

        // Setiap per verse
        hasanah_per_verse_base += words.length;
        hasanah_per_verse_total += words.length*10;
        // hasanah_per_verse_total += wordss.length*10;
        // array[0].chapters.hasanah += wordss.length*10;
        arr.push(hasanah)
      }
    })
    let morphedObj = {
      hasanah_per_verse_base: hasanah_per_verse_base*10,
      hasanah_per_verse_total: hasanah_per_verse_total,
      hasanah_per_verse: _.reduce(a, (res, val) => {
        return res + val;
      }, 0),
      hasanah_base: hasanah_base,
      hasanah_total: hasanah_total,
    }
    wrapped.push(morphedObj);
  })
  return hasanah_total;
}

//! Main Interation
let totalVerse = 0;
let ink = []
let model;
_.each(chapters, async (v, k) => {
  let hasanah = 0;
  // Object.assign(v, {hasanah: hasanah})
  model = {
    chapter_number: v.chapter_number,
    hasanah: hasanah,
  };

  if (v.chapter_number !== 5123) {
    model.hasanah = countHasanah(tooked(v.chapter_number), totalVerse, hasanah);
  }
  let a = Object.assign(v, model)
  console.log(a);
  ink.push(a);
  // totalVerse += v.verses_count
})

wroteChapters(ink);
