
const jsonfile = require('jsonfile');
const _ = require('lodash');
const axios = require('axios');

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

for(let i = 1; i <= 114; i++) {
    let url = `https://api.quran.com/api/v4/chapters/${i}/info?language=id`;
    axios.get(url)
    .then(function (response) {
        const fileName = `./2024/input_chapter_info/id/${i}.json`
        if(!checkFileExists(fileName))
            jsonfile.writeFileSync(fileName, response.data, { spaces: 0 });
    })
    .catch(function (error) {
        console.log(error);
    });
}

for(let i = 1; i <= 114; i++) {
    let url = `https://api.quran.com/api/v4/chapters/${i}/info?language=en`;
    axios.get(url)
    .then(function (response) {
        const fileName = `./2024/input_chapter_info/en/${i}.json`
        if(!checkFileExists(fileName))
            jsonfile.writeFileSync(fileName, response.data, { spaces: 0 });
    })
    .catch(function (error) {
        console.log(error);
    });
}