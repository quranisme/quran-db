const jsonfile = require('jsonfile');
const _translationsInfo = jsonfile.readFileSync('./2024/_translations.json').translations;
const _ = require('lodash');
const axios = require('axios');


const enIDs = [19, 20, 22, 57, 84, 85, 95, 131, 200];
const idIDs = [33, 134, 141];


// filter _translatinsInfo by enIDs
const enData = _translationsInfo
    .filter(function (item) { return enIDs.includes(item.id) })
const idData = _translationsInfo
    .filter(function (item) {
        return idIDs.includes(item.id)
    })

    console.log(idData.concat(enData))