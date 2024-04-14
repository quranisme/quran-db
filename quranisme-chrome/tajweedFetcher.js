// Quran Cloud Api Verse by verse Fetcher for tajweed coded


const fs = require('fs');
const got = require('got');
const axios = require('axios');
const _ = require('lodash');
const jsonfile = require('jsonfile');
const {
  chapters: chapters
} = require('../qapi/chapters_en.js');
const {
  chapters: chapters_id
} = require('../qapi/chapters_id.js');

const objectToWrite = [{}];

const took = async (id) => {
  // console.log('#ID#', id);
  try {
    let url = `http://api.alquran.cloud/v1/surah/${id}/editions/quran-tajweed`;
    const response = await got(url, {
      json: true
    });
    // console.log(response)
    return response.body.data;
  } catch (error) {
    console.log('ERROR', error)
  }
  // const response = await got(`http://staging.quran.com:3000/api/v3/chapters/${i}/info`, { json: true });
};

// const tookAsync = async (id) => {
//   console.log('#ID#', id);
//   try {
//     // let url = `http://staging.quran.com:3000/api/v3/chapters/${id}/verses?recitation=1&translations=21&language=en&text_type=words&offset=${offset}&limit=${limit}`;
//     let url = `http://api.alquran.cloud/v1/surah/${id}/editions/quran-tajweed`;
//     try {
//       const response = await axios.get(url);
//       return response.data.ayahs
//     } catch (err) {
//       console.log('took ERROR', err)
//     }
//   } catch (error) {
//     console.log('ERROR', error)
//   }
// };

const wrote = (id, response) => {
  console.log('====================== BEGIN WROTE')
  let data = {
    chapters: response
  }
  jsonfile.writeFile(`./statics/quran-tajweed/chapter_${id}.json`, data, {
    spaces: 2
  }, function (err, result) {
    if (err) console.log('error', err);
  });
}
const morph = (array) => {
  let wrapped = [];
  let morphed = {};
  _.each(array, (v, k) => {
    morphed = {
      verse_number: k+1,
      text_tajweed: v.text,
    }
    wrapped.push(morphed);
  })
  return wrapped;
}

_.each(chapters, async (v, k) => {
  // let certainChapter = [5,6,7,10,11,12,14,17,18,21,23,24,29,30,33,34,41,42,44,51,53,54,68,69,74]
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

  if (v.chapter_number === 5) {
    let ink = []
    try {
      let resid = await took(v.chapter_number)
      model.verses = await (morph(resid[0].ayahs))
      console.log(model.verses)
      wrote(v.chapter_number, model)
    } catch(err) {
      console.log(err);
    }
  }
});