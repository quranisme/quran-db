const fs = require('fs');
const cheerio = require('cheerio');
const sass = require('sass');
const { parse, stringify } = require('scss-parser');
const createQueryWrapper = require('query-ast');
const _ = require('lodash');
const axios = require('axios');
const jsonfile = require('jsonfile');

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    _.each(filenames, (filename, index) => {
        fs.readFile(dirname + filename, 'utf-8', function(err, content) {
          if (err) {
            onError(err);
            return;
          }
          onFileContent(filename, content, index);
        });
    })
  });
}
let json = jsonfile.readFileSync('./simpleicon.json');

// callback then add attr fil to svg
readFiles('result/', (filename, content, index) => {
  let $ = cheerio.load(content);
  let k = _.findKey(json, (e) => { return filename === e.name})
  // json[index].name === filename ? console.log(filename) : '';
  let color =json[k].color
  $('path').attr('fill', color)
  // console.log($('body').html())
  wroteNew(`result-colored/${filename}`, $('body').html())
}, (error) => {
  throw error
});

// SAve to file
var idd = 0;
const wroteNew = (filename, response) => {
  console.log('====================== BEGIN WROTE', idd += 1)
  let data = response;
  fs.writeFileSync(`./${filename}`, `${data}`);
}
// const $ = cheerio.load()
