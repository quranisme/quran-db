// Mutate to only Arabic and 2 Translation
const juz = require('./types')

const fs = require('fs');
const got = require('got');
const axios = require('axios');
const _ = require('lodash');
const he = require('he');
const jsonfile = require('jsonfile');

const chapters = require('./statics/chapters');

const objectToWrite = [{}];

const wroteNew = (id, response) => {
  console.log('====================== BEGIN WROTE')
  let data = response
  jsonfile.writeFileSync(`./statics/juz/chapter_${id}.json`, data);
}

const wroteChapters = (response) => {
  console.log('====================== BEGIN WROTE')
  let data = response
  jsonfile.writeFileSync(`./statics/chapters.js`, data);
}

function juzMemory(chapterId) {
  // @saveroo Dirty Approach
  // Regarding handling Mapped process, from memorization[{chapter[]}] to juz[memorization[chapter{verses[]}]
  // Problem:
  // -memorization[chapter{}] and juz data are separated,
  // Expectation:
  // -Wanted to display and order by the juz, but not all the memorized verse,
  // -if condition of memorized verses is unmet the criteria of juz, it wont be displayed.
  // as example we have memorization at Chapter 1:1-7, chapter 2:1-2, chapter 55:10
  // [Juz 1] << DISPLAYED
  //   [Memorization]
  //     [Chapter 1] 1:1-7
  //     [Chapter 2] 1:1-141
  // [Juz 2] << NOT DISPLAYED
  //   [Memorization]
  //     [Chapter]
  // [Juz 27] << DISPLAYED
  //   [Memorization]
  //     [Chapter 55] 10 (Our Memorized verses equal inRange between the constraint to be considered as juz 27)
  // @2019

  // You dont need Lodash
  const inRange = (num, a, b = 0) => Math.min(a, b) <= num && num < Math.max(a, b);

  // To reduce typing overhead, i put it thereeee, immutable const
  const jz = juz.juzByVerseTotalNumber;
  const jm = juz.juzMapping;
  const mem = chapters;
  const memmap = mem;

  // TODO: should have better approach
  // This is the main array to contains the transformed 30juz.
  let arr = [];
  // console.log(memmap)

  // So i dont forget how to iterate thru it...
  // 1. first iterate the juz Array from 1 to 30
  for (let i = 0; i < jz.length; i++) {
    // Initialize empty array to hold morphed Juz array from 1 to 30
    // This array after iteration will reset. to contain new item in 2nd iteration.
    let arrChap = [];

    // The object to be pushed thru
    let objUpper = {
      juz: jz[i].juz,
      juz_start_at_verse: juz.ajza[i],
      juz_end_at_verse: juz.ajza[i + 1],
      verse_diff: juz.ajza[i + 1] - juz.ajza[i],
    };

    // 2. Iterate thru the chapter, in 30 iteration there is 114 iteration, to push, if chapter is included in the current juz
    for (let j = 0; j < memmap.length; j++) {
      if (jm[i].verse_mapping[`${memmap[j].chapter_number}`]) {
        let jmap = jm[i].verse_mapping[`${memmap[j].chapter_number}`];
        let splt = jmap.split('-');
        if (inRange(tooked(memmap[j].chapter_number)[2].chapters.verses.length, splt[0], splt[1] + 1)) {
          let obj = {
            name_simple: mem[j].name_simple,
            verse: mem[j].verses
          }
          // if(objUpper.verse_diff)
          objUpper.verse_left = objUpper.verse_diff - mem[j].verses_count
          objUpper.verse_memorized = mem[j].verses_count
          arrChap.push(mem[j]);
        }
        // if (inRange(tooked(1)[2].chapters.verses.length, splt[0], splt[1] + 1)) arrChap.push(mem[j].name_simple);
      }

      // ## Uncomment if chapter want to be included in juz, regardless condition of memorized verse is unmet
      // If the current mapped chapter in memorization included in 30 JUZ iteration,
      // then push to array which reseted in every new iteration
      // if (jz[i].chapter_in_juz.includes(`${memmap[j].chapter_number}`)) {
      //
      //   // push memorization which contain a chapter, since chapter has one-to-one relationship.
      //   // arrChap.push(mem[j]);
      // }
    }

    // After done the 2nd iteration, then added props to Object which contain juz number and chapter array,
    // Then push to main array
    objUpper.chapter = arrChap;
    arr.push(objUpper);
  }

  // Returned filter to remove empty array
  return arr.filter(i => i.chapter.length !== 0);
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
  let tajweed = array[2].chapters.verses;
  array[0].chapters.hasanah = 0
  let morphedArr = [] //This local var to produce array
  // let morphedObj = {}  //to produce obj, temp var
  let morphedWords = []
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
      text_tajweed: tajweed[k].text_tajweed,
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

console.log(juzMemory());
//! Main Interation
let totalVerse = 0;
let ink = []
let model;
// _.each(chapters, async (v, k) => {
//   let hasanah = 0;
//   model = {
//     chapter_number: v.chapter_number,
//     name_simple: v.name_simple,
//     name_meaning: v.meaning,
//     verses_count: v.verses_count,
//     hasanah: hasanah,
//     verses: []
//   };
//
//   // EXCEPT surat 77 since last fail
//   if (v.chapter_number < 144) {
//     // model.verses = morphling(tooked(v.chapter_number), totalVerse, hasanah);
//     // model.hasanah = countHasanah(tooked(v.chapter_number), totalVerse, hasanah);
//   }
//   // ink.push(model);
//   console.log(model);
//   totalVerse += v.verses_count
//   // wroteNew(k+1 ,model)
// })

// If you want to GENERATE Chapters.JS ( a one file ) use wroteChapters(ink) << an array without verses
// Use wroteNew() in the end of the loop to generate chapters_ID.json,

// wroteChapters(ink);
