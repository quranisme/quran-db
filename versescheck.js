const fs = require('fs');
const got = require('got');
const axios = require('axios');
const _ = require('lodash');
const jsonfile = require('jsonfile');
const {
	chapters: chapters
} = require('./qapi/chapters_en.js');
const {
	chapters: chapters_id
} = require('./qapi/chapters_id.js');


const tookAsync = async (id) => {
	// console.log('#ID#', id, offset, limit);
	try {
		// let url = `./qapi/chapters/verses/chapter_${id}.json`;
		let url = `./fixdb/verses/chapter_${id}.json`;
		// let url = ``;
		console.log('## URL' + id, url);
		try {
			const response = jsonfile.readFileSync(url)
			// console.log('## RESPONSE' + response);
			// const response = await axios.get(url);
			return response;
			// console.log('#### WTF IS THIS', await response.data.verses)
		} catch (err) {
			console.log('took ERROR', err)
		}
	
	} catch (error) {
		console.log('ERROR', error)
	}
	// const response = await got(`http://staging.quran.com:3000/api/v3/chapters/${i}/info`, { json: true });
};

let check = async () => {
	let wrong = []
	let certainChapter = [5,6,7,10,11,12,14,17,18,21,23,24,29,30,33,34,41,42,44,51,53,54,68,69,74]
	let certainChapterLength = certainChapter.length;
	for(let i = 0; i < certainChapterLength; i++) {
		console.log('ID', certainChapter[i])
		tookAsync(certainChapter[i]).then((res) => {
			// console.log(res.chapters);
			if(res.verses_count === res.verses.length) {
				console.log(`${i}. ${res.name_complex}`)
				console.log(`${i} Passed`)
			} else {
				console.log(`${i}. ${res.name_complex} [FAIL] ${res.verses_count - res.verses.length} VERSES MISSING`)
				wrong.push(i)
				// console.log(`${i}. ${res.name_complex} ${res.verses_count - res.verses.length}`)
				console.log(wrong.join(','));
			}
		})
	}
}
check();
console.log('test');