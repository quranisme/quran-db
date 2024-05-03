const jsonfile = require('jsonfile');
const _ = require('lodash');

const words = jsonfile.readFileSync('./2024/quran/tobemapped.json');
const words2 = jsonfile.readFileSync('./2024/output_wbw/ar/2.json');


// For WBW Words the 0 index in arabic output_wbw/ar/x.json is indopak.
// For WBW Words the 1 index in arabic output_wbw/ar/x.json is uthmani.
(async () => {
    const fetchie = await fetch('http://localhost:5000/translate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        q: 'الله',
        source: 'ar',
        target: 'en'
    }),    
})

    _.each(words2, (data) => {
        console.log(data)
        const splitted = data.w.split('|')

        for (let i = 0; i < splitted.length; i++) {
            for (let j = 0; j < splitted[i].length; j++) {
                console.log(splitted[i].split('—'))
            }
        }
        // _.each(splitted, (data2) => {
        //     console.log(data2)
        // });

        // const splittedWords = splitted.split('./')
        // console.log(splittedWords)
    });
})();

// (async () => {
//     const getAllQuranWords = async () => {
//         return await words;
//     }
    
//     const getWordsByPage = async (page) => {
//         return await words[page-1];
//     }
    
//     const test = await getWordsByPage(1); //page = (1-604)

//     const allPauseTexts = [];
//     _.each(test, (data) => {
//        _.each(data, (data2) => {
//            _.each(data2.words, (data3) => {
//             if(data3.char_type_name !== 'word')
//             allPauseTexts.push(data3);
//            });
//        });
//     });
//     console.log(allPauseTexts.map(s => s.text));

//     const qapiverses = (id) => {
//         return jsonfile.readFileSync(`./qapi/verses/en/chapter_en_${id}.json`)
//     }
//     for (let i = 1; i <= 114; i++) {
//         console.log(qapiverses(i));
//     }
// })()