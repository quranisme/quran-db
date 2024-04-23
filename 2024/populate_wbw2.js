

const jsonfile = require('jsonfile');
const _translationsInfo = jsonfile.readFileSync('./2024/_translations.json').translations;
const _chapterInfo = jsonfile.readFileSync('./2024/quran/chapterList.json');
const _ = require('lodash');
const axios = require('axios');
const fs = require('fs');

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
//https://api.quranwbw.com/v1/verses?verses=67:1,67:30&verse_translation=1&between=true

const fileLeft = []
for(let i=1; i <= 114; i++) {
    const testRead = fs.existsSync(`./2024/input_wbwquran/${i}.json`);
    if(!testRead) {
        fileLeft.push(i)
    }
}

function fetchDataWithDelay() {
    let index = 0;
    const interval = 4000; // Set your desired delay in milliseconds
    
    function fetchNext() {
        if (index >= fileLeft.length) return; // Stop if all items are processed
        // console.log(fileLeft[index])
        const i = fileLeft[index];
        const { chapter_number, verses_count } = _chapterInfo[i - 1];
        const verseBetween = `${i}:1,${i}:${verses_count}`;
        const url = `https://api.quranwbw.com/v1/verses?verses=${verseBetween}&verse_translation=1,2&between=true`;

        axios.get(url)
            .then(function (response) {
                jsonfile.writeFileSync(`./2024/input_wbwquran/${chapter_number}.json`, response.data, { spaces: 0 });
                index++; // Move to the next item
                setTimeout(fetchNext, interval); // Call the next item after the delay
            })
            .catch(function (error) {
                console.log(error);
                index++; // Move to the next item even if there's an error
                setTimeout(fetchNext, interval); // Call the next item after the delay
            });
    }

    fetchNext(); // Start fetching
}

fetchDataWithDelay();

// for(let i=1; i <= 114; i++) {

//     if(fileLeft.includes(i)) {
    
//         const { chapter_number, verses_count } = _chapterInfo[i-1];
        
//         const verseBetween = `${i}:1,${i}:${verses_count}`
//         console.log(verseBetween)
//         let url = `https://api.quranwbw.com/v1/verses?verses=${verseBetween}&verse_translation=1,2&between=true`;
//         console.log(url)
    
//         axios.get(url)
//         .then(function (response) {
//             jsonfile.writeFileSync(`./2024/input_wbwquran/${chapter_number}.json`, response.data, { spaces: 0 });
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
//     }
// }
// console.log(i)`
// let url = `https://quranwbw-data.vercel.app/data/${i}/word-translations/arabic.json`;
// axios.get(url)
// .then(function (response) {
//     // jsonfile.writeFileSync(`./2024/output_wbw/ar/${i}.json`, response.data, { spaces: 0 });
// })
// .catch(function (error) {
//     // console.log(error);
// });
