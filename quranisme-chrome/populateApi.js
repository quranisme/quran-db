// Quranisme Chrome Purpose
/*
* Jadi sehabis ambil radio language dari Mp3
* untuk Fetch language endpoint dari Mp3Quran
* Lantas digabungkan, gitu loooh
* */

const axios = require('axios');
const _ = require('lodash');
const fs = require('fs')
const { language } = require('./requirement/radioLanguage');
const jsonfile = require('jsonfile');

const devUrl = 'http://localhost:1337/'
// const devUrl = 'https://fast-inlet-62682.herokuapp.com/'
const endpoint = () => {
  return {
    GET_USERS: 'users',
    REGISTER: 'auth/local/register',
    LOGIN: 'auth/local/login',
    CHAPTERS: 'chapters',
    UPDATE_CHAPTER: (number) => `chapters/update/${number}`,
    CHAPTER_BY_NUMBER: (number) => `chapters?chapter_number=${number}`,
    VERSES: 'verses',
    UPDATE_VERSE_BY_VERSE_KEY: (verseKey) => `verses/update/${verseKey}`,
    GRAPHQL: 'graphql',
  };
}
const token = () => {
  return {
    "Authorization": ""
  }
}

const {
  chapters: chapters
} = require('../qapi/chapters/chapters.js');


const verseData = {
  "juz_number": 0,
  "verse_number": 0,
  "text_tajweed": "string",
  "text_madani": "string",
  "page_number": 0,
  "sajadah": true,
  "verse_key": "string",
  "verse_total_number": 0,
  "chapter": "string",
  "hasanah_per_verse": 0
}

const readVersesFromJson = async (id) => {
  return jsonfile.readFileSync(`../local/chapter_${id}.json`)
}
const readHasanah = async (id) => {
  return jsonfile.readFileSync(`./statics/hasanah/chapter_${id}.json`)
}

// const api = async (path) => {
//   let res = await axios.get(devUrl+path, {
//     headers: token()
//   })
//   return res
// };
// {
//   "username": "tetst",
//     "email": "test@gmatil.com",
//     "password": "123qwe123qwe"
// }
const endpoin = {
  REGISTER_USER: (data) => {
    return {
      header
    }
  }
}

const api = async (path) => {
  let res = await axios.get(devUrl+path, {
    headers: token()
  })
  let pos = await axios.post(devUrl+path)
  return {
    get: res,
    post: (data) => {

    }
  }
};

const getApi = async (path) => {
  let res = await axios.get(devUrl+path, {
    headers: token()
  })
  return res
};

const postToApi = async (path, data) => {
  let pos;
  return new Promise((resolve, reject) => {
    axios.post(devUrl+path, data, {
      headers: token(),
      timeout: 1135000,
    }).then(res => {
      resolve(res)
    }).catch(res=> {
      reject(res)
    })
  })
  // return pos
}

const updateApi = async (path, data) => {
  let pos;
  try {
    pos = await axios.put(devUrl+path, data, {
      headers: token(),
      timeout: 1135000,
    })
  } catch (e) {
    // console.log('ERROR')
  }
  return pos
}

let log = console.log
let newObject = {
  id: '',
  language: '',
  radio_url: ''
}
let temp = []

_.each(chapters, async (v, k) => {
  let model = {
    chapter_number: v.chapter_number,
    bismillah_pre: v.bismillah_pre,
    revelation_order: v.revelation_order,
    revelation_place: v.revelation_place,
    name_arabic: v.name_arabic,
    name_complex: v.name_complex,
    name_simple: v.name_simple,
    verses_count: v.verses_count,
    verse_from: v.verse_from,
    verse_end: v.verse_end,
    pages: {
      page_from: v.pages[0],
      page_to: v.pages[1]
    },
  };


  //Main Iteration
  if(v.chapter_number >= 1 && v.chapter_number <= 1111) {
  // if(v.chapter_number >= 1) {
    let hasanah = await readHasanah(v.chapter_number)
    model.hasanah = hasanah.hasanah

    //Verse Iteration
    let vers = await readVersesFromJson(v.chapter_number)
    let tjw = await readHasanah(v.chapter_number)
    let jsonVerses = vers.verses
    // console.log(jsonVerses)

    //TODO:FOR POPULATE VERSE POPULATE
    // _.each(jsonVerses, async (vv,kk) => {
    //   let vs = tjw.verses[kk]
    //   // let get = await getApi(endpoint().CHAPTER_BY_NUMBER(v.chapter_number))
    //   // log(get.data[0])
    //   let model_verses = {
    //     "chapter_number": v.chapter_number,
    //     "chapter": {
    //       // "id": get.data[0].id,
    //       // "chapter_number": v.chapter_number
    //     },
    //     "juz_number": vv.juz_number,
    //     "verse_number": vv.verse_number,
    //     "verse_key": vv.verse_key,
    //     "verse_total_number": vv.verse_total_number,
    //     "text_tajweed": vs.text_tajweed,
    //     "text_madani": vv.text_madani,
    //     "page_number": vv.page_number,
    //     "sajdah": vv.sajdah !== null,
    //     "hasanah_per_verse": vs.hasanah_per_verse,
    //     "rub_number": vv.rub_number,
    //     "hizb_number": vv.hizb_number,
    //   }
    //   // model_verses.chapter = model
    //   if(vv.sajdah_number) {
    //     model_verses.sajdah_number = vv.sajdah_number
    //   }
    //   // Update Verses [Done]
    //   // let populateVerses = await updateApi(endpoint().UPDATE_VERSE_BY_VERSE_KEY(`${vv.verse_key}`), model_verses);
    //
    //   // Populate Verses [Done[
    //   let populateVerses = await postToApi(endpoint().VERSES, model_verses);
    //   log(populateVerses.status)
    // })

    // supposed to go Here

    // Populate CHAPTERES [Done]
    let populateChapter = await postToApi(endpoint().CHAPTERS, model)
    // let populateChapter = await updateApi(endpoint().UPDATE_CHAPTER(model.chapter_number), model)
    log(populateChapter)
    // let call = await postToApi(endpoint().REGISTER, d)
    // log(call)
    // let verse = await readVersesFromJson(k+1);
    // log(verse.chapter_number)
  }
})