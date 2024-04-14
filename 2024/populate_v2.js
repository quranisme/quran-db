
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

const list = {
    indopak: 'indopak',
    uTajweed: 'uthmani_tajweed', 
    uThmani: 'uthmani',
    uSimple: 'uthmani_simple',
    imlaei: 'imlaei',
    glyph2: 'code_v2', // done
    glyph: 'code_v1' // done
};

const whichToScrape = list.imlaei
for(let i = 1; i <= 30; i++) {
    let url = `https://api.quran.com/api/v4/quran/verses/${whichToScrape}?juz_number=${i}`;
    axios.get(url)
    .then(function (response) {
        const fileName = `./2024/input_script/${whichToScrape}/juz_${i}.json`
        if(!checkFileExists(fileName))
            jsonfile.writeFileSync(fileName, response.data, { spaces: 0 });
    })
    .catch(function (error) {
        console.log(error);
    });
}