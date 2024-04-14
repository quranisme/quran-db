// Scrap Image and put into folder


const fs = require('fs');

const path = require('path');
const dataPath = path.join(__dirname, 'quranpro/quranpro-reciters.json')
const reciters = require(dataPath);
const axios = require('axios');

function scrapeImageUrls(jsonData) {
    const imageUrls = [];
  
    jsonData.forEach(reciter => {
      imageUrls.push(reciter.image.original_url);
      imageUrls.push(reciter.image.optimized_url);
      imageUrls.push(reciter.image.medium_url);
      imageUrls.push(reciter.image.small_url);
    });
  
    return imageUrls;
  }

const dirname = (file) => {
    return path.join(__dirname, file);
}

const createFolderSafely = (folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
}

// Function to scrape reciter slugs
function scrapeReciterSlugs(jsonData) {
    return jsonData.map(reciter => reciter.slug);
  }
  
  // Function to fetch reciter data
async function fetchReciterData(slug) {
    // .reciter - reciterBio
    // .audioSurahs - reciter Available
    const response = await axios.get(`https://quran-pro.com/_next/data/1tp1x4bVgSh6Ytd1f8o0t/en/reciter/${slug}.json?slug=${slug}`);
    return response.data.pageProps;
}
  

  // Function to download images
  async function downloadImages(imageUrls, reciters) {
    for (const url of imageUrls) {
      try {
        const response = await axios.get(url, { responseType: 'stream' });
        const fileName = path.basename(url).split('?')[0];

        const folderName = reciters.find(reciter => url.includes(reciter.slug)).slug;
        const folderPath = `./quranpro/images/${folderName}`;
  
        // Create the folder if it doesn't exist
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }
  
        const filePath = path.join(folderPath, fileName);
        response.data.pipe(fs.createWriteStream(filePath));
        console.log(`Downloaded: ${fileName}`);
      } catch (error) {
        console.error(`Error downloading image: ${url}`, error);
      }
    }
  }

  // save RECITER.json
  // Function to save reciter data to file
function saveReciterData(reciterData, fileName) {
    const filePath = path.join('./quranpro/audio/', `${fileName}.json`);
  
    // Create the folder if it doesn't exist
    if (!fs.existsSync(path.join('./quranpro/audio'))) {
      fs.mkdirSync(path.join('./quranpro/audio'), { recursive: true });
    }
  
    fs.writeFileSync(filePath, JSON.stringify(reciterData, null, 2));
    console.log(`Saved: ${fileName}.json`);
  }

//   Main for reciter data
  async function main() {
    // const reciters = reciters.pageProps.reciters;
    const reciterSlugs = scrapeReciterSlugs(reciters);
  
    for (const slug of reciterSlugs) {
        const getReciterData = (await fetchReciterData(slug));
        saveReciterData(getReciterData.audioSurahs, slug)

        // Get Reciter data (DONE) 
        //   const getReciterData = (await fetchReciterData(slug));
        //   saveReciterData(getReciterData.reciter, reciterData.slug);
    }
  }
  
  main()

//   Main for images
//   async function main() {
//     const reciters = jsonData.pageProps.reciters;
//     const reciterSlugs = scrapeReciterSlugs(jsonData);
  
//     for (const slug of reciterSlugs) {
//       const reciterData = await fetchReciterData(slug);
//       const imageUrls = [
//         reciterData.image.original_url,
//         reciterData.image.optimized_url,
//         reciterData.image.medium_url,
//         reciterData.image.small_url
//       ];
//       await downloadImages(imageUrls, reciterData.slug);
//     }
//   }
  
  
  
  
//   const imageUrls = scrapeImageUrls(reciters);
// downloadImages(imageUrls, reciters);
