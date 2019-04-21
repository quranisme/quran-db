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

const objectToWrite = [{}];

const took = async (id, offset, limit, lang) => {
	console.log('#ID#', id);
	try {
		// let trans;
		// if(lang === 'en') trans = 21;
		// if(lang === 'id') trans = 33;

		let url = `http://staging.quran.com:3000/api/v3/chapters/${id}/verses?recitation=1&translations=21&language=en&text_type=words&offset=${offset}&limit=${limit}`;
		let url2 = `http://staging.quran.com:3000/api/v3/chapters/${id}/verses?recitation=1&translations=33&language=id&text_type=words&offset=${offset}&limit=${limit}`;
		console.log('## URL' + lang);

		// const response = got(url, {
		// 	json: true
		// });
		// const response2 = got(url2, {
		// 	json: true
		// });
		// return [response, response2];

		if (lang === 'en') {
			const response = await got(url, {
				json: true
			});
			return response.body.verses;
		}
		if (lang === 'id') {
			const response2 = await got(url2, {
				json: true
			});
			return response2.body.verses;
		}
		// console.log('## Took Response', response)
		// await fs.writeFile(`./qapi/verses/chapter_en_${id}.json`, JSON.stringify(response.body.verses), 'utf8', function (err, result) {
		// 	if (err) console.log('error', err);
		// });
	} catch (error) {
		console.log('ERROR', error)
	}
	// const response = await got(`http://staging.quran.com:3000/api/v3/chapters/${i}/info`, { json: true });
};

const tookAsync = async (id, offset, limit) => {
	console.log('#ID#', id, offset, limit);
	try {
		let trans;
		// if(lang === 'en') trans = 21;
		// if(lang === 'id') trans = 33;


		let url = `http://staging.quran.com:3000/api/v3/chapters/${id}/verses?recitation=1&translations=21&language=en&text_type=words&offset=${offset}&limit=${limit}`;
		// let url = ``;
		console.log('## URL' + id, url);
		// console.log('## URL' + id, url);
		// console.log('## OFFSET' + id, offset);
		// console.log('## LIMIT' + id, limit);
		try {
			const response = await axios.get(url);
			// console.log('#### WTF IS THIS', await response.data.verses)
			return response
		} catch (err) {
			console.log('took ERROR', err)
		}
		// console.log('## Took Response', response)
		// await fs.writeFile(`./qapi/verses/chapter_en_${id}.json`, JSON.stringify(response.body.verses), 'utf8', function (err, result) {
		// 	if (err) console.log('error', err);
		// });
	} catch (error) {
		console.log('ERROR', error)
	}
	// const response = await got(`http://staging.quran.com:3000/api/v3/chapters/${i}/info`, { json: true });
};

const wrote = (id, response) => {
	console.log('====================== BEGIN WROTE')
	let data = {
		chapters: response
	}
	jsonfile.writeFile(`./fixdb/id/chapter_${id}.json`, data, {
		spaces: 2
	}, function (err, result) {
		if (err) console.log('error', err);
	});
}

const morph2 = (array) => {
	let wrapped = [];
	let morphed = {};
	let morphedchild = {};
	// console.log(array);
	_.each(array[0], (v, k) => {

		morphed = {
			verse_number: v.verse_number,
			verse_key: v.verse_key,
			text_madani: v.text_madani,
			translation_en: v.translations[0].text,
			translation_id: array[1][k].translations[0].text,
			page_number: v.page_number,
			juz_number: v.juz_number,
			hizb_number: v.hizb_number,
			rub_number: v.rub_number,
			sajdah: null,
			sajdah_number: null,
			words: []
		}
		_.each(v.words, (vv, kk) => {
			morphed.words.push({
				position: vv.position,
				line_number: vv.line_number,
				page_number: vv.page_number,
				text_madani: vv.text_madani,
				translation_en: _.isObject(vv.translation) ? vv.translation.text : null,
				translation_id: _.isObject(array[1][k].words[kk].translation) ? array[1][k].words[kk].translation.text : null
			})
			// array[1]['words']

			// morphed.words.push(vv.text_madani);
		})
		wrapped.push(morphed);
	})
	// _.each(array[1], (idv, idk) => {
	//  wrapped		
	// })
	return wrapped;
}

const morph = (array) => {
	let wrapped = [];
	let morphed = {};
	let morphedchild = {};
	// console.log(array);
	_.each(array, (v, k) => {

		morphed = {
			verse_number: v.verse_number,
			verse_key: v.verse_key,
			text_madani: v.text_madani,
			translation: v.translations[0].text,
			page_number: v.page_number,
			juz_number: v.juz_number,
			hizb_number: v.hizb_number,
			rub_number: v.rub_number,
			sajdah: v.sajdah,
			sajdah_number: v.sajdah_number,
			words: []
		}
		_.each(v.words, (vv, kk) => {
			morphed.words.push({
				position: vv.position,
				line_number: vv.line_number,
				page_number: vv.page_number,
				text_madani: vv.text_madani,
				code: vv.code,
				code_v3: vv.code_v3,
				char_type: vv.char_type,
				translation: _.isObject(vv.translation) ? vv.translation.text : null,
			})
			// array[1]['words']

			// morphed.words.push(vv.text_madani);
		})
		wrapped.push(morphed);
	})
	// _.each(array[1], (idv, idk) => {
	//  wrapped		
	// })
	return wrapped;
}

_.each(chapters, async (v, k) => {
	// let certainChapter = [5,6,7,10,11,12,14,17,18,21,23,24,29,30,33,34,41,42,44,51,53,54,68,69,74]
	let certainChapter = [5]
	let go = 50;
	let model = {
			chapter_number: v.chapter_number,
			bismillah_pre: v.bismillah_pre,
			revelation_order: v.revelation_order,
			revelation_place: v.revelation_place,
			name_arabic: v.name_arabic,
			name_complex: v.name_complex,
			name_simple: v.name_simple,
			verses_count: v.verses_count,
			pages: v.pages,
			meaning: {
				'text': v.translated_name.name,
				'en': v.translated_name.name,
				'id': v.translated_name.name,
			},
			verses: []
		};

	if (v.chapter_number !== 144) {
		// IF VERSES dibawah 50
		if (v.verses_count <= 50) {
			// console.log('CHAPTER BELOW 50', v.name_complex);
			let ink = []
			let temp = []
			let isready = false;
			go = 50;
			try {
				// let resen = await took(v.chapter_number, go - 50, go, 'en')
				let resid = await took(v.chapter_number, go - 50, go, 'id')
				// ink.push([...resid]);
				// ink.push([...resid]);
				ink.push(...resid);
				model.verses = await (morph(ink))
				console.log('isREADY')
				wrote(v.chapter_number, model)

		} catch(err) {
			console.log(err);
		}
			// console.log('tests', temp);
			// ink.push(temp[1]);
			// model.verses = (morph(ink))
			// wrote(v.chapter_number, model)
		}

		if (v.verses_count > 50) {
			console.log('CHAPTER ABOVE 50', v.name_complex);
			let ink = [];
			let things;
			let iteration = Math.round(v.verses_count / 50);
			go = 50;
			let tooki;
			for (let i = 1; i <= (iteration+1); i++) {
				console.log('#ITERATION', v.name_complex);
				console.log(`### Verses:${v.verses_count} Dibagi:${iteration+1} `);
				// console.log('#TO', Math.round(v.verses_count / 50));
				// console.log('tooki', tooki);
			
				if (i == iteration) {
					tooki = await took(v.chapter_number, go - 50, go+50, 'id');
					ink.push(...tooki);
					// ink = _.uniqBy(ink, 'verse_key');
					// console.log('INK', ink);
				} else if(i == iteration-1){
					tooki = await took(v.chapter_number, go - 50, go, 'id');
					ink.push(...tooki);
					go += 50
				} else {
					tooki = await took(v.chapter_number, go - 50, go,'id');
					ink.push(...tooki);
					go += 50
				}
			}
			console.log('GO', go);
			took(v.chapter_number, go - 50, go-10, 'id').then((res) => {
				ink.push(...res);
				ink = _.uniqBy(ink, 'verse_key');
				model.verses = (morph(ink));
				if(_.size(ink) > 50) {
					wrote(v.chapter_number, model);
				}
			})
			// console.log('WROTE OUTSIDE', v.name_complex);
		}
	}
});