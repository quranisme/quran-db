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

const wroteNew = async (id, response) => {
    console.log('====================== BEGIN WROTE')
    let prepend = 'export default '
    let path = `./statics/radio/radio_${id}.json`;
    let data = response
    // await fs.writeFile(path, response, 'utf8' , function(err, result) {
    //     if(err) console.log('error', err);
    //   });;
    jsonfile.writeFileSync(`./statics/radio/radio_${id}.json`, data, { spaces: 2 });
}

const a = async (url) => {
    let res = await axios.get(url)
    return res.data
};
let log = console.log
let newObject = {
    id: '',
    language: '',
    radio_url: ''
}
let temp = []
_.each(language, async (v, k) => {
    let t = await a(v.radio_url)
    temp.push(t)
    wroteNew(v.id, t);
    console.log(temp)
})
