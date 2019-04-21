const Sequelize = require('sequelize');
const _ = require('lodash');
const mysql = new Sequelize('nextgen', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false,
  // pool: {
  //   max: 5,
  //   min: 0,
  //   acquire: 30000,
  //   idle: 10000
  // },

  // SQLite only
  // storage: './sql/text.sqlite3.db',

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});
const jsonfile = require('jsonfile');
const he = require('he');

// Get Glyph_code in glyph.db by glyph_id specified in glyphayah
23
const {
  chapters: chapters_en
} = require('./qapi/chapters_en.js');
const {
  chapters: chapters_id
} = require('./qapi/chapters_id.js');


const union = async (suraId, position) => {
  try {
    return mysql.query(`
            SELECT glyph.font_file, glyph.glyph_code, g1lyph_ayah.sura_number, glyph_ayah.ayah_number, glyph_ayah.position
            FROM glyph
            RIGHT JOIN glyph_ayah ON glyph_ayah.glyph_id = glyph.glyph_id 
            WHERE glyph_ayah.sura_number = ${suraId};
          `, { type: mysql.QueryTypes.SELECT }).then(async (data) => {
      return data
    })
    .catch((e) => {
      return e;
    })
  } catch (e) {
    return e;
  }
}

const tooked = (id) => {
  let url = `./fixdb/en/chapter_${id}.json`
  let url2 = `./fixdb/id/chapter_${id}.json`
  let response = jsonfile.readFileSync(url);
  let response2 = jsonfile.readFileSync(url2);
  return [response, response2]
}

let arr = [];

const morphling = (array, number) => {
  let morphed = {}
  let wrapped = []
  let en = array[0].chapters.verses;
  let id = array[1].chapters.verses;
  _.each(en, (v, k) => {
    number += 1;
    morphed = {
      verse_number: v.verse_number,
      verse_total_number: number,
      verse_key: v.verse_key,
      text_madani: v.text_madani,
      translation_en: v.translation,
      translation_id: id[k].translation,
      page_number: v.page_number,
      juz_number: v.juz_number,
      hizb_number: v.hizb_number,
      rub_number: v.rub_number,
      sajdah: v.sajdah,
      sajdah_number: v.sajdah_number,
      words: []
    }
    v.translation_id = array[1].chapters.verses[k].translation;
    _.each(v.words, (vv, kk) => {
      let t = () => {
        if(vv.text_madani === null) {
          if(vv.char_type === 'end')
            return he.decode(vv.code)
          if(vv.char_type === 'pause')
            return he.decode(vv.code_v3)
        } else {
          return vv.text_madani
        };
      }
      morphed.words.push({
        position: vv.position,
        line_number: vv.line_number,
        page_number: vv.page_number,
        code: vv.code,
        char_type: vv.char_type,
        font: null,
        text_glyph: null,
        text_madani: t(),
        translation_en: !_.isObject(vv.translation) ? vv.translation : null,
        translation_id: !_.isObject(id[k].words[kk].translation) ? id[k].words[kk].translation : null
      })

      // vv.translation_id = array[1].chapters.verses[k].words[kk].translation
    })
    wrapped.push(morphed)
  })
  // console.log(wrapped);
  return wrapped;
}


const glyph = async (column ,constraint) => {
  let glyph = await mysql.query(`SELECT ${column} FROM glyph WHERE glyph_id=${constraint}`)
  // let out = String.fromCharCode(glyph);
  // _.each(glyph[0], (v, k) => {
  //   console.log(v.font_file, String.fromCharCode(v.glyph_code));
  // })
  // console.log(glyph[1].length)
  // wroteNew(null ,glyph);
  return await glyph;
}

// for(let i = 1; i <= 114; i++) {
//   union(i);
// }
const wroteNew = (response, id = null) => {
  console.log('====================== BEGIN WROTE')
  let data = response
  jsonfile.writeFileSync(`./local/chapter_${id}.json`, data, {spaces: 1});
}


let totalVerse = 0;
_.each(chapters_en, async (v, k) => {
  let ink = []
  let model = await {
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
  if (v.chapter_number > 50) {
    model.verses = morphling(tooked(v.chapter_number), totalVerse);
    // _.each(model.verses, (v, k) => {
    //   _.each(v.words, (vv, kk) => {
    //   })
    // })
    union(v.chapter_number, 2).then(a => {
      let tonk = []
      let arrtonk = [];
      // _.each(a, (v, k) => {
      //   let c = {
      //     key: k,
      //     data: ''
      //   }
      //   // tonk[v.ayah_number].push({
      //   //   data: v
      //   // })
      //   console.log(_.groupBy(a, 'position'))
      // })
      // console.log(_.groupBy(a, 'ayah_number'))
      _.each(model.verses, (v, k) => {
        _.each(v.words, (vv, kk) => {
          // model.verses[k].words[kk].font = a[i].font_file;
          model.verses[k].words[kk].font = _.groupBy(a, 'ayah_number')[`${k+1}`][kk].font_file;
          model.verses[k].words[kk].text_glyph = _.groupBy(a, 'ayah_number')[`${k+1}`][kk].glyph_code;
        })
      })
      wroteNew(model, v.chapter_number);
    })
    // union(v.chapter_number, 2).then(a => {
    //   console.log(a.length);
    //   let i=1;
    //   _.each(model.verses, (v, k) => {
    //     _.each(v.words, (vv, kk) => {
    //       i++
    //       model.verses[k].words[kk].font = a[i].font_file;
    //       model.verses[k].words[kk].text_glyph = a[i].glyph_code;
    //       console.log(i);
    //     })
    //   })
    //   wroteNew(model, v.chapter_number);
    // })

  }
  totalVerse += v.verses_count
})


// try {
//   mysql.query(`
//             SELECT glyph.glyph_code, glyph_ayah.sura_number, glyph_ayah.ayah_number, glyph_ayah.position
//             FROM glyph
//             RIGHT JOIN glyph_ayah ON glyph_ayah.glyph_id = glyph.glyph_id
//             WHERE glyph_ayah.sura_number = ${suraId} and glyph_ayah.position = ${position};
//           `, { type: mysql.QueryTypes.SELECT }).spread((data) => {
//     return data
//   })
//   .catch((e) => {
//     return e;
//   })
// } catch (e) {
//   return e;
// }

// const getGlyphCodeFromGlyphAyah = async (glyphAyah) => {
//   let arr = []
//   let a;
//   console.log(glyphAyah.length);
//   _.each(glyphAyah[0], async (vv, kk) => {
//     a = await glyph(`glyph_code`, vv)
//     // console.log(await glyph(`glyph_code`, vv));
//     // arr.push(glyph(`glyph_code`, vv));
//     _.each(a, async (v, k) => {
//       console.log(v)
//       arr.push(v[0]);
//     })
//   })
//   console.log(`arr`, await arr)
//   return arr;
// }
//
// const glyphAyah = async (column, sura) => {
//   let glyphayah = await mysql.query(`SELECT ${column} FROM glyph_ayah WHERE sura_number=${sura}`)
//   return await glyphayah;
// }
//
// const parameterized = async () => {
//   let a = [];
//   for (let i = 1; i <= 114; i++) {
//     let ayah = await glyphAyah(`glyph_id`, i);
//     a.push({
//       id: i,
//       glyph_code: await getGlyphCodeFromGlyphAyah(ayah[0])
//     })
//   }
//   wroteNew(a);
// }

// parameterized();



//
// const User = sequelize.define('user', {
//   username: Sequelize.STRING,
//   birthday: Sequelize.DATE
// });
//
// sequelize.sync()
// .then(() => User.create({
//   username: 'janedoe',
//   birthday: new Date(1980, 6, 20)
// }))
// .then(jane => {
//   console.log(jane.toJSON());
// });
