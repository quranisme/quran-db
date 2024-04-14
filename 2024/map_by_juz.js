// This are intended to get the page data from /juz/* folder


const jsonfile = require('jsonfile');
const _ = require('lodash');

// Read file by file prefix
const tooked = (id) => {
	let url = `./juz/juz_${id}.json`
	let response = jsonfile.readFileSync(url);
	return response
}


// iterate the juz folder first and load the file juz_*.json
const storage = [];
for (let i = 1; i <= 30; i++) {
    let loaded = tooked(i);
    let loadedDataRoot = loaded.data;
    let loadedDataVerses = loadedDataRoot.ayahs;
    let loadedDataJuzNumber = loadedDataRoot.number;

    const dataExtracted = {
        [loadedDataJuzNumber]: loadedDataVerses.map((ayah) => [`${ayah.surah.number}:${ayah.numberInSurah}|${ayah.number}|${ayah.page}|${ayah.hizbQuarter}|${ayah.manzil}|${ayah.ruku}`])
    }

    storage.push(dataExtracted);
}

// const storage2 = [];
// const flattenedData = {};
// _.each(storage, (data) => {
//     Object.entries(data).forEach(([key, value]) => {
//         storage2[key] = value.map(obj => obj.key[0]);
//       });    
// });

const flattenedData = {};
_.mergeWith(flattenedData, ...storage, (objValue, srcValue) => {
    if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
});
const test = storage.map((data) => {
    return Object.entries(data).map(([key, value]) => {
        return {
            [key]: value.map(obj => obj[0])
        }
    });
});

const flat = _.mapValues(flattenedData, arr=> _.flattenDeep(arr));
const compressedData = _.mapValues(flattenedData, arr => arr.map(innerArr => innerArr[0]).join('-'))
// Write the data to the file
// jsonfile.writeFileSync(`./2024/juz_data.json`, _.mapValues(flattenedData, arr => arr.map(innerArr => innerArr[0]).join('-')), { spaces: 2 });


// SEARCH FUNCTION EXAMPLE:
function findVerseKey(data, chapter, verseNumber) {
    const verses = data[`${chapter}`];
    if (!verses) {
      return "Chapter not found";
    }
  
    const verseData = verses.split('-').find(verse => {
      const [chapterNumber, numberInSurah] = verse.split(':')[1].split('|')[1];
      return chapterNumber === chapter.toString() && numberInSurah === verseNumber.toString();
    });
  
    return verseData ? verseData : "Verse not found";
  }
  
  // [`chapter:verse|number|page|hizbQuarter|manzil|ruku`]
  // Example search
  const chapter = 67;
  const verseNumber = 6;
  const result = findVerseKey(compressedData, chapter, verseNumber);
  console.log(result.split('|'))