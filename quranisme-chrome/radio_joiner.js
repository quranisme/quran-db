// Quranisme Chrome Purpose
/*
* Jadi sehabis ambil radio language dari Mp3
* untuk Fetch language endpoint dari Mp3Quran
* Lantas digabungkan, gitu loooh
* */

const axios = require('axios');
const _ = require('lodash');
const fs = require('fs')
const jsonfile = require('jsonfile');

const joined = [];
let counter = 0;
const normalizedPath = require('path').join(__dirname, "statics/json/");
require('fs').readdirSync(normalizedPath).forEach((v, k) => {
    let radios = jsonfile.readFileSync(`${normalizedPath}${v}`); //ustadnames.json [ {} ]
    let len = radios.length;
    _.each(radios, (radio, radioKey) => {
        counter += 1;
        console.log(radio.viewed)
        radio.viewed = radio.viewed != "" ? parseInt(radio.viewed.toString().replace(".", "")) : 0;
        let obj = Object.assign({
            radio_id: counter,
            radio_short: v.replace('.json', '')
        }, radio)
        console.log('obj', obj.viewed)
        delete obj.id;
        joined.push(obj);
    })
})
//
// let result = []
// _.each(joined, (v, k) => {
//     delete v.radio_id
//     result.push({
//         radio_id: k+1
//     });
// })

jsonfile.writeFileSync(`fullradios.json`, joined);

// const devUrl = 'http://localhost:1337/'
// // const devUrl = 'https://fast-inlet-62682.herokuapp.com/'
// const endpoint = () => {
//     return {
//         GET_USERS: 'users',
//         REGISTER: 'auth/local/register',
//         LOGIN: 'auth/local/login',
//         CHAPTERS: 'chapters',
//         UPDATE_CHAPTER: (number) => `chapters/update/${number}`,
//         CHAPTER_BY_NUMBER: (number) => `chapters?chapter_number=${number}`,
//         VERSES: 'verses',
//         UPDATE_VERSE_BY_VERSE_KEY: (verseKey) => `verses/update/${verseKey}`,
//         GRAPHQL: 'graphql',
//     };
// }
// const token = () => {
//     return {
//     }
// }
//
// const {
//     chapters: chapters
// } = require('../qapi/chapters/chapters.js');
//
//
// const verseData = {
//     "juz_number": 0,
//     "verse_number": 0,
//     "text_tajweed": "string",
//     "text_madani": "string",
//     "page_number": 0,
//     "sajadah": true,
//     "verse_key": "string",
//     "verse_total_number": 0,
//     "chapter": "string",
//     "hasanah_per_verse": 0
// }
//
// const readVersesFromJson = async (id) => {
//     return jsonfile.readFileSync(`../local/chapter_${id}.json`)
// }
// const readHasanah = async (id) => {
//     return jsonfile.readFileSync(`./statics/hasanah/chapter_${id}.json`)
// }
//
// // const api = async (path) => {
// //   let res = await axios.get(devUrl+path, {
// //     headers: token()
// //   })
// //   return res
// // };
// // {
// //   "username": "tetst",
// //     "email": "test@gmatil.com",
// //     "password": "123qwe123qwe"
// // }
// const endpoin = {
//     REGISTER_USER: (data) => {
//         return {
//             header
//         }
//     }
// }
//
// const api = async (path) => {
//     let res = await axios.get(devUrl+path, {
//         headers: token()
//     })
//     let pos = await axios.post(devUrl+path)
//     return {
//         get: res,
//         post: (data) => {
//
//         }
//     }
// };
//
// const getApi = async (path) => {
//     let res = await axios.get(devUrl+path, {
//         headers: token()
//     })
//     return res
// };
//
// const postToApi = async (path, data) => {
//     let pos;
//     return new Promise((resolve, reject) => {
//         axios.post(devUrl+path, data, {
//             headers: token(),
//             timeout: 1135000,
//         }).then(res => {
//             resolve(res)
//         }).catch(res=> {
//             reject(res)
//         })
//     })
//     // return pos
// }
//
// let populateChapter = await postToApi(endpoint().CHAPTERS, model)
//
//
// const updateApi = async (path, data) => {
//     let pos;
//     try {
//         pos = await axios.put(devUrl+path, data, {
//             headers: token(),
//             timeout: 1135000,
//         })
//     } catch (e) {
//         // console.log('ERROR')
//     }
//     return pos
// }
//
// let log = console.log
// let newObject = {
//     id: '',
//     language: '',
//     radio_url: ''
// }
// let temp = []


