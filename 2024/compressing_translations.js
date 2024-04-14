



// input: /input_translations/[locale]/[x].json
// output: /output_translations/[locale]/[x].json



const jsonfile = require('jsonfile');
const _translationsInfo = jsonfile.readFileSync('./2024/_translations.json').translations;
const _ = require('lodash');

const enData = _translationsInfo
    .filter(function (item) { return item.language_name === 'english' })
const idData = _translationsInfo
    .filter(function (item) { return item.language_name === 'indonesian' })

    // get translation identifier
const enDataID = enData.map(s => s.id)
const idDataID = idData.map(s => s.id)


const enGetTranslationFileById = (id) => jsonfile.readFileSync(`./2024/input_translations/en/${id}.json`);
const idGetTranslationFileById = (id) => jsonfile.readFileSync(`./2024/input_translations/id/${id}.json`);


const enDataFiles = enDataID.map(enGetTranslationFileById);
const idDataFiles = idDataID.map(idGetTranslationFileById);

Array.prototype.insert = function ( index, ...items ) {
    this.splice( index, 0, ...items );
};

_.each(enDataID, (v, k) => {
    const enOutput = enDataFiles.map(d => d)[k].translations.map(t => t.text)
    const enResult = {
        translations: enOutput,
        meta: enDataFiles.map(d => d)[k].meta,
    }
    // enResult.translations.insert(0, "")
    jsonfile.writeFileSync(`./2024/output_translations/en/${v}.json`, enResult, { spaces: 0 });
})


_.each(idDataID, (v, k) => {
    const idOutput = idDataFiles.map(d => d)[k].translations.map(t => t.text)
    const idResult = {
        translations: idOutput,
        meta: idDataFiles.map(d => d)[k].meta,
    }
    // enResult.translations.insert(0, "")
    jsonfile.writeFileSync(`./2024/output_translations/id/${v}.json`, idResult, { spaces: 0 });
})