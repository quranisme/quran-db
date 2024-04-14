
// this retrieve all translation for en/id to be processed later, data are derived from translations metadata info. 

const URL = "https://api.quran.com/api/v4"

const jsonfile = require('jsonfile');
const _translationsInfo = jsonfile.readFileSync('./2024/_translations.json').translations;
const _ = require('lodash');
const axios = require('axios');

// get translations metadata
const enData = _translationsInfo
    .filter(function (item) { return item.language_name === 'english' })
const idData = _translationsInfo
    .filter(function (item) { return item.language_name === 'indonesian' })

    // get translation identifier
const enDataID = enData.map(s => s.id)
const idDataID = idData.map(s => s.id)

// get slug identifier
const enDataSLUG = enData.map(s => s.slug)
const idDataSLUG = idData.map(s => s.slug)


// enData iteration to scrape https://api.quran.com/api/v4/quran/translations/[id]


const took = async (id, lang) => {
	console.log('#ID#', id);
	try {
		let url = `https://api.quran.com/api/v4/quran/translations/${id}`;
        const response = await axios(url, {
            json: true
        });

        if(response.data) {
            jsonfile.writeFileSync(`./2024/input_translations/${lang}/${id}.json`, response.data, { spaces: 2 });

        }
        return response.data;
	} catch (error) {
		console.log('ERROR', error)
	}
};

// edit: id as its name, because slug is null.
// Loop english translation and save data with slug as its name
for (let i = 0; i < enDataID.length; i++) {
    took(enDataID[i], 'en');
}

// edit: id as its name, because slug is null.
// // Loop indonesian translation and save data with slug as its name
for (let i = 0; i < idDataID.length; i++) {
    took(idDataID[i], 'id');
}


