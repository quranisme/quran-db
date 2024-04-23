const fs = require('fs');
const axios = require('axios');
const jsonfile = require('jsonfile');

// const jsonfile = require('jsonfile');
const _translationsInfo = jsonfile.readFileSync('./2024/_translations.json').translations;
const _chapterInfo = jsonfile.readFileSync('./2024/quran/chapterList.json');
const _ = require('lodash');
// const axios = require('axios');



async function downloadAudioWithDelay(workerId, start, end) {
    const interval = 800; // Initial interval between downloads in milliseconds
    const longInterval = 3000; // Interval after every 50 downloads in milliseconds
    let downloadCount = 0; // Track the number of downloads
    const errorList = [];

     // Load existing error list if available
     const errorPath = `./2024/audioErrorList.json`;
     if (fs.existsSync(errorPath)) {
         try {
             errorList = jsonfile.readFileSync(errorPath);
         } catch (error) {
             console.log(`${workerId}Error loading existing error list: ${error}`);
         }
     }

    for (let i = start; i <= end; i++) {
        const { chapter_number, verses_count } = _chapterInfo[i - 1];
        const _wbwmeta = jsonfile.readFileSync(`./2024/input_wbwquran/${chapter_number}.json`).data;

        for (let j = 0; j < verses_count; j++) {
            const verseKey = `${chapter_number}:${j + 1}`;
            const wordCount = _wbwmeta.verses[verseKey].meta.words;
            const verseNumber = j + 1;

            for (let k = 0; k < wordCount; k++) {
                const wordPosition = k + 1;
                const fileName = `${chapter_number.toString().padStart(3, 0)}_${verseNumber.toString().padStart(3, 0)}_${wordPosition.toString().padStart(3, 0)}`;
                const filePath = `./2024/input_wbwquran_audio/${fileName}.mp3`;

                const displayVerse = _wbwmeta.verses[verseKey].words.translation.split('|');

                // Check if file already exists
                if (fs.existsSync(filePath)) {
                    console.table(`${workerId}Skipping ${fileName}.mp3 as it already exists. -- ${displayVerse[k]}`);
                    continue;
                }

                const url = `https://words.audios.quranwbw.com/${chapter_number}/${fileName}.mp3`;

                try {
                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    fs.writeFileSync(filePath, response.data, 'binary');
                    console.table(`${workerId}Downloaded audio for ${fileName}.mp3 -- ${displayVerse[k]}`);
                    downloadCount++;

                    // Introduce long interval after every 50 downloads
                    if (downloadCount % 50 === 0) {
                        console.table(`${workerId}Downloaded ${downloadCount} files. Taking a long break...`);
                        await new Promise(resolve => setTimeout(resolve, longInterval));
                    } else {
                        // Introduce short interval between downloads
                        await new Promise(resolve => setTimeout(resolve, interval));
                    }
                } catch (error) {
                    console.table(`${workerId}[ERROR] Downloading ${fileName}.mp3 -- ${displayVerse[k]}`);
                    if (!errorList.includes(url)) {
                        errorList.push(url);
                        try {
                            jsonfile.writeFileSync(errorPath, errorList, { spaces: 2 });
                            console.table(`${workerId}Error list updated and saved to ${errorPath}`);
                        } catch (writeError) {
                            console.table(`${workerId}Error saving error list: ${writeError}`);
                        }
                    }
                }
            }
        }
    }
}

const id = process.argv[2];
const startRange = parseInt(process.argv[3]);
const endRange = parseInt(process.argv[4]);


downloadAudioWithDelay(id, startRange, endRange);
