const rp = require('request-promise');
const r = require('request');
const $ = require('cheerio');
const pages = (id) => `https://radio.salingsapa.com/oemarmita/audio/${ id }`;
const _ = require('lodash');
const jsonfile = require('jsonfile');
const fs = require('fs');
const feedparser = require('feedparser-promised');


const ustad = 'bayyinahpodcast'


// Bayinah podcast
const url = 'http://feeds.feedburner.com/bayyinahpodcast'

// Albayan radio
// const url = 'https://s3.amazonaws.com/feed.podbean.com/albayanradio/feed.xml'

feedparser.parse(url).then(items => {
    let title, link, durasi, obj, url, description, simak, simaktanggal, ustad;
    let index = 0;
    let result = []
      _.each(items, (v, k) => {
        // console.log(v)
        index += 1;
        obj = {
          id: index,
          radio_ustad: v.author,
          name: v.title,
          date: v.date,
          radio_link: v.link,
          radio_url: v.enclosures[0].url,
          duration: '',
          viewed: '',
          kajian_description: v.description
        };
        console.log(obj)
        result.push(obj)
      })
  wroteNew(result);
}
).catch(console.error);


// Settings
const options = {
  USTAD_IDENTIFIER: ustad,
  JSON: true, // will default to ES6 export default
  ES6: true // will default to ES6 export default
}

// Save to file
let idd = 0
const wroteNew = (response) => {
  console.log('====================== BEGIN WROTE', idd += 1)
  let data;
  let ext = options.JSON ? 'json' : 'js';
  if(options.JSON) {
    data = response
    jsonfile.writeFileSync(`./statics/json/${options.USTAD_IDENTIFIER}.${ext}`, data);
  } else {
    data = `export default {
      list: ${JSON.stringify(response)}
    }`
    fs.writeFileSync(`./statics/${options.USTAD_IDENTIFIER}.${ext}`, `${data}`);
  }
}
