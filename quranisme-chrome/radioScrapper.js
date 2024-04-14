const rp = require('request-promise');
const r = require('request');
const $ = require('cheerio');
const url = 'https://radio.salingsapa.com/oemarmita';
const pages = (id) => `https://radio.salingsapa.com/oemarmita/audio/${ id }`;
const _ = require('lodash');
const jsonfile = require('jsonfile');
const fs = require('fs');
// Settings
const ustad = 'oemarmita'
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

// Generate next Page
const linkGenerator = async () => {
  let links = []
  let url = await getHtml(`https://radio.salingsapa.com/${options.USTAD_IDENTIFIER}`)
  let count = $('div > div > div.profile-item > span', url)[0].children[0].data
  // console.log(r(url));
  for (let i = 1; i <= Math.round(parseInt(count)/10); i++) {
    links.push(`https://radio.salingsapa.com/${options.USTAD_IDENTIFIER}/audio/${ i }`);
  }
  // for (let i = 1; i <= 2; i++) {
  //   links.push(`https://radio.salingsapa.com/${options.USTAD_IDENTIFIER}/audio/${ i }`);
  // }
  return links
};


// Get Current page HTML
const getHtml = async (linkToScrap) => {
  let html = await rp(linkToScrap)
  return await html
}

const init = async () => {
  var result = []
  let index = 0;
  const regex = /flac/gm; // ERROR LINK conditional

  _.each(await linkGenerator(), async (v, k) => {
    let html = await getHtml(v)
    let detailsHtml
    let count = $('h4 > a', html).length
    let title, link, durasi, obj, url, description, simak, simaktanggal, ustad;
    for (let i = 0; i < count; i++) {
      let desc = []

      // Radio List
      ustad = $('div.profile-info > h4 > strong', await html)[0].children[0].data
      title = $('h4 > a', await html)[i].children[0].data
      link = $('h4 > a', await html)[i].attribs.href
      durasi = $('div.col-md-9 > div > div.durasi', await html)[i].children[0].data
      // simaktanggal = $('div.col-md-9 > div > span', html)[i].children[0].data

      if(!title.match(regex)) {
        // Radio Details
        detailsHtml = await getHtml(link)
        description = $('div.stream-item-content > p', detailsHtml)[0].children;
        // console.log('link', description)
        // console.log(detailsHtml)
        url = $('#apsh', await detailsHtml)[0].attribs['data-source']
        simak = $('div.stream-item-action > ul > li > a', await detailsHtml)[0].children[0].next.data
        tanggal = $('div.stream-item-header > small', await detailsHtml)[0].children[1].data
        _.each(description, (v, k) => {
          if(!_.isUndefined(v.data)) {
            desc.push(v.data)
            console.log(v.data)
          }
        })
        index += 1;
        obj = {
          id: index,
          radio_ustad: ustad,
          name: title,
          date: tanggal,
          radio_link: link,
          radio_url: url,
          duration: durasi,
          viewed: parseFloat(simak),
          kajian_description: desc.join(' ')
        };
        result.push(obj)
      }
    }
    wroteNew(result)
  })
}

init()

//
// const scrapeTo = (linkToScrape) => {
//   var Urls = [];
//   var obj = {}
//   return rp(linkToScrape)
//   .then(function(html){
//     //success!
//     let self = this;
//     let uniqUrls;
//     const regex = /(https:\/\/radio\.salingsapa\.com\/audio\/listen\/.+[a-z])/gm;
//     const count = $('h4 > a', html).length
//     for (let i = 0; i < count; i++) {
//       let title = $('h4 > a', html)[i].children[0].data
//       let link = $('h4 > a', html)[i].attribs.href
//       obj = {
//         id: i,
//         ustad: 'Oemar Mita',
//         title,
//         link,
//       };
//       // (function (){
//       //   r(link, (err, res , body) => {
//       //     let description = $('div.stream-item-content > p', body)[0].children
//       //     let url = $('#apsh', body)[0].attribs['data-source']
//       //     let disimak = $('div.stream-item-action > ul > li > a', body)[0].children[0].next.data
//       //     // Each BR in description
//       //     let desc = [];
//       //     _.each(description, (v, k) => {
//       //       if(!_.isUndefined(v.data)) {
//       //         desc.push(v.data)
//       //       }
//       //     })
//       //     obj.url = url;
//       //     obj.disimak = parseFloat(disimak);
//       //     obj.description = desc.join(' ')
//       //   })
//       // })(obj)
//       let a = rp(link)
//       .then(function (htm) {
//         let description = $('div.stream-item-content > p', htm)[0].children
//         let url = $('#apsh', htm)[0].attribs['data-source']
//         let disimak = $('div.stream-item-action > ul > li > a', htm)[0].children[0].next.data
//         let desc = [];
//         // Each BR in description
//         _.each(description, (v, k) => {
//           if (!_.isUndefined(v.data)) {
//             desc.push(v.data)
//           }
//         })
//         let obj2;
//         obj.url = url;
//         obj.disimak = parseFloat(disimak);
//         obj.description = desc.join(' ')
//         Urls = 'test'
//       })
//       .catch((err) => {
//         console.log('2', err)
//       })
//     }
//     return _.uniq(Urls);
//   })
//   // .then(async (uniqUrls) => {
//   //   console.log(uniqUrls)
//   //   // console.log(uniqUrls[1].link)
//   //
//   //   let arr = []
//   //   for (let i = 0; i < uniqUrls.length; i++) {
//   //     // console.log(uniqUrls[i].link)
//   //     let a = await rp(uniqUrls[i].link)
//   //     .then(function (htm) {
//   //       let a = uniqUrls;
//   //       let description = $('div.stream-item-content > p', htm)[0].children
//   //       let url = $('#apsh', htm)[0].attribs['data-source']
//   //       let disimak = $('div.stream-item-action > ul > li > a', htm)[0].children[0].next.data
//   //       let desc = [];
//   //       // Each BR in description
//   //       _.each(description, (v, k) => {
//   //         if(!_.isUndefined(v.data)) {
//   //           desc.push(v.data)
//   //         }
//   //       })
//   //       uniqUrls[i].url = url;
//   //       uniqUrls[i].disimak = parseFloat(disimak);
//   //       uniqUrls[i].description = desc.join(' ')
//   //       return uniqUrls;
//   //     })
//   //     .catch((err) => {
//   //       console.log('2', err)
//   //     })
//   //     arr.push(await a);
//   //   }
//   //   return [...arr];
//   // })
//   .catch(function(err){
//     console.log(err)
//   });
// }
//
// const scrp = (linkToScrape) => {
//   let a = rp(linkToScrape)
//   .then((html) => {
//     let Urls = [];
//     let uniqUrls;
//     const regex = /(https:\/\/radio\.salingsapa\.com\/audio\/listen\/.+[a-z])/gm;
//     const count = $('h4 > a', html).length
//     let obj
//     for (let i = 0; i < count; i++) {
//       let title = $('h4 > a', html)[i].children[0].data
//       let link = $('h4 > a', html)[i].attribs.href
//       obj = {
//         id: i,
//         ustad: 'Oemar Mita',
//         title,
//         link,
//       };
//       Urls.push(obj);
//     }
//     uniqUrls = _.uniq(Urls);
//     return uniqUrls
//   })
//   .catch(function(err){
//     console.log(err)
//   });
//   return a
// }
// const scrpDetail = (uniqUrls) => {
//   for (let i = 0; i < uniqUrls.length; i++) {
//     // console.log(uniqUrls[i].link)
//     return rp(uniqUrls[i].link)
//       .then(function (htm) {
//         let a = uniqUrls;
//         let description = $('div.stream-item-content > p', htm)[0].children
//         let url = $('#apsh', htm)[0].attribs['data-source']
//         let disimak = $('div.stream-item-action > ul > li > a', htm)[0].children[0].next.data
//         let desc = [];
//         // Each BR in description
//         _.each(description, (v, k) => {
//           if(!_.isUndefined(v.data)) {
//             desc.push(v.data)
//           }
//         })
//         a[i].url = url;
//         a[i].disimak = parseFloat(disimak);
//         a[i].description = desc.join(' ')
//         return a
//       })
//       .catch((err) => {
//         console.log('2', err)
//       })
//   }
// }
//
// let data = []
// _.each(linkGenerator(), async (v,k) => {
//   let wow = await scrapeTo(v);
//   data.push(await wow)
//   if (k === linkGenerator().length-1) {
//     wroteNew(data)
//   }
// })
// // for(let i = 1; i <= 2; i++) {
// //   let wow = scrapeTo(pages(i));
// //   wow.then((res) => {
// //     data.push(...res)
// //   })
// //   // let s = scrp(pages(i));
// //   // s.then((res) => {
// //   //   scrpDetail(res).then((ress) => {
// //   //     morph(ress)
// //   //     // return ress;
// //   //     console.log(Result)
// //   //   })
// //   // })
// // }
