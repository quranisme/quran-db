// url schema: https://quranwbw-data.vercel.app/data/1/word-corpus/7.json



const jsonfile = require('jsonfile');
const _ = require('lodash');
const axios = require('axios');
const chapterInfo = require('../qapi/chapters/chapters')


const chapterTotalVerseCount = chapterInfo.chapters.map(chapter => chapter.verses_count)

// mkdir function 
const fs = require('fs');

const makeDir = (id) => {
    const dir = `./2024/input_corpus/en/${id}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
}

for(let i=1; i <= 114; i++) {
    makeDir(i)      
    for(let j=1; j <= chapterTotalVerseCount[i-1]; j++) {
        let url = `https://quranwbw-data.vercel.app/data/${i}/word-corpus/${j}.json?v=2`;
        axios.get(url)
        .then(function (response) {
            // mkdir if not exist      
            jsonfile.writeFileSync(`./2024/input_corpus/en/${i}/${j}.json`, response.data, { spaces: 0 });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}
    