// This are intended to get the page data from /juz/* folder


const jsonfile = require('jsonfile');
const _ = require('lodash');
const utils = require('./utils.js')

// Read file by file prefix
const tooked = (id) => {
	let url = `./2024/input_script/code_v2/juz_${id}.json`
	let response = jsonfile.readFileSync(url);
	return response
}


const saved = (id, data) => {
	let url = `./2024/output_script/code_v2/${id}.json`
	jsonfile.writeFileSync(url, data, { spaces: 0 });
}

// const testMap = tooked(1).verses.map(d => {
//     return `${d.verse_key}|${d.id}|${d.v2_page}|${d.code_v2}`
// })

// console.log(testMap)

// iterate the juz folder first and load the file juz_*.json
const storageRaw = [];
const storage = [];
for (let i = 1; i <= 30; i++) {
    storageRaw.push(tooked(i))
    let loaded = tooked(i).verses.map(d => {
        return `${d.verse_key}|${d.id}|${d.v2_page}|${d.code_v2}`
    })
    dataExtracted = {
        [i]: loaded
    }
    saved(i, dataExtracted)
    storage.push(dataExtracted);
}

// const group = _.groupBy(storageRaw, (data) => data.v2_page);

// const x = storageRaw.entries()

// console.log(x);

function groupByV2Page(data) {
    const groupedData = {};
  
    if (data?.verses) {
        for (const verse of data.verses) {
          const { v2_page } = verse;
          if (!groupedData[v2_page]) {
            groupedData[v2_page] = [];
          }
          groupedData[v2_page].push(verse);
        }
      }
  
    return groupedData;
  }
  
  const groupedByPageNumber = {};
  for(let i = 0; i <= 30; i++) { 
      const groupedData = groupByV2Page(storageRaw[i]);
      
      for (const page in groupedData) {
        console.log(`Group ${page}:`);
        const p = page;
        const mapped = groupedData[page].map(d =>  `${d.verse_key}|${d.id}|${d.code_v2}`)
        // const res = {
        //     [p]: mapped
        // }
        // console.log(res)
        groupedByPageNumber[p] = mapped.join('-');
        // for (const verse of groupedData[page]) {
        //   console.log(JSON.stringify(verse));
        // }
      }
  }

  saved('allString', groupedByPageNumber)





    
utils.calculate(30, (id) => `./2024/input_script/code_v2/juz_${id}.json`, (id) => `./2024/output_script/code_v2/${id}.json`)
// const flat = _.mapValues(flattenedData, arr=> _.flattenDeep(arr));
// const compressedData = _.mapValues(flattenedData, arr => arr.map(innerArr => innerArr[0]).join('-'))
// Write the data to the file
// jsonfile.writeFileSync(`./2024/juz_data.json`, _.mapValues(flattenedData, arr => arr.map(innerArr => innerArr[0]).join('-')), { spaces: 2 });


// SEARCH FUNCTION EXAMPLE:
// function findVerseKey(data, chapter, verseNumber) {
//     const verses = data[`${chapter}`];
//     if (!verses) {
//       return "Chapter not found";
//     }
  
//     const verseData = verses.split('-').find(verse => {
//       const [chapterNumber, numberInSurah] = verse.split(':')[1].split('|')[1];
//       return chapterNumber === chapter.toString() && numberInSurah === verseNumber.toString();
//     });
  
//     return verseData ? verseData : "Verse not found";
//   }
  
//   // [`chapter:verse|number|page|hizbQuarter|manzil|ruku`]
//   // Example search
//   const chapter = 67;
//   const verseNumber = 6;
//   const result = findVerseKey(compressedData, chapter, verseNumber);
//   console.log(result.split('|'))