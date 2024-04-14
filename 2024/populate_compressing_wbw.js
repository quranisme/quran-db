

const jsonfile = require('jsonfile');
const _translationsInfo = jsonfile.readFileSync('./2024/_translations.json').translations;
const _ = require('lodash');
const axios = require('axios');


// https://quranwbw-data.vercel.app/data/114/word-translations/indonesian.json?v1696933768

// for(let i=1; i <= 114; i++) {
//     // console.log(i)`
//     let url = `https://quranwbw-data.vercel.app/data/${i}/word-translations/indonesian.json`;
//     axios.get(url)
//     .then(function (response) {
//         jsonfile.writeFileSync(`./2024/output_wbw/id/${i}.json`, response.data, { spaces: 2 });
//     })
//     .catch(function (error) {
//         console.log(error);
//     });
// }

// for(let i=1; i <= 114; i++) {
//     // console.log(i)`
//     let url = `https://quranwbw-data.vercel.app/data/${i}/word-translations/english.json`;
//     axios.get(url)
//     .then(function (response) {
//         jsonfile.writeFileSync(`./2024/output_wbw/en/${i}.json`, response.data, { spaces: 0 });
//     })
//     .catch(function (error) {
//         console.log(error);
//     });
// }

for(let i=1; i <= 114; i++) {
    // console.log(i)`
    let url = `https://quranwbw-data.vercel.app/data/${i}/word-translations/arabic.json`;
    axios.get(url)
    .then(function (response) {
        jsonfile.writeFileSync(`./2024/output_wbw/ar/${i}.json`, response.data, { spaces: 0 });
    })
    .catch(function (error) {
        console.log(error);
    });
}