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

function checkFileExists(filePath) {
    try {
        // Check if the file exists
        fs.accessSync(filePath, fs.constants.F_OK);
        return true; // File exists
    } catch (err) {
        return false; // File doesn't exist
    }
}


for(let i=1; i <= 114; i++) {
    // makeDir(i)      
    const chapter = i;
    const completeness = []
    for(let j=1; j <= chapterTotalVerseCount[i-1]; j++) {
        const verse = i;
       const isExist = checkFileExists(`./2024/input_corpus/en/${i}/${j}.json`)
       if(isExist) {
        completeness.push(true)
       }
    }
    if( completeness.length === chapterTotalVerseCount[i-1]) {
        console.log(`Chapter ${i} is complete`)
    } else {
        console.log(`Chapter ${i} is not complete`)
    }
}
