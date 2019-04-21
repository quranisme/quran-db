const fs = require('fs');
const got = require('got');
const axios = require('axios');
const _ = require('lodash');
const jsonfile = require('jsonfile');
const {
	chapters: chapters_en
} = require('./qapi/chapters_en.js');
const {
	chapters: chapters_id
} = require('./qapi/chapters_id.js');

const objectToWrite = [{}];

const wroteNew = (response) => {
	console.log('====================== BEGIN WROTE')
	let data = {
		chapters: response
	};
	jsonfile.writeFileSync(`./qapi/chapters/chapters.js`, data, {spaces: 2});
}

const tooked = (id) => {
	let url = `./qapi/chapters/en/chapter_en_${id}.json`
	let url2 = `./qapi/chapters/id/chapter_id_${id}.json`
	let response = jsonfile.readFileSync(url);
	let response2 = jsonfile.readFileSync(url2);
	return [response, response2]
}

const morphling = (array, number) => {
	let morphed = {}
	let wrapped = []
	let en = array[0].chapters.verses;
	let id = array[1].chapters.verses;
	_.each(en, (v, k) => {
		number += 1;
		morphed = {
			verse_number: v.verse_number,
			verse_total_number: number,
			verse_key: v.verse_key,
			text_madani: v.text_madani,
			translation_en: v.translation,
			translation_id: id[k].translation,
			page_number: v.page_number,
			juz_number: v.juz_number,
			hizb_number: v.hizb_number,
			rub_number: v.rub_number,
			sajdah: null,
			sajdah_number: null,
			words: []
		}
		v.translation_id = array[1].chapters.verses[k].translation;
		_.each(v.words, (vv, kk) => {
			morphed.words.push({
				position: vv.position,
				line_number: vv.line_number,
				page_number: vv.page_number,
				text_madani: vv.text_madani,
				translation_en: !_.isObject(vv.translation) ? vv.translation : null,
				translation_id: !_.isObject(id[k].words[kk].translation) ? id[k].words[kk].translation : null
			})
			// vv.translation_id = array[1].chapters.verses[k].words[kk].translation
		})
		wrapped.push(morphed)
	})
	// console.log(wrapped);
	return wrapped;
}


//! Main Interation 
let startVerse = 0;
let endVerse = 0;
let model = [];
_.each(chapters_en, async (v, k) => {
	let ink = []
	endVerse += v.verses_count
	model.push({
		chapter_number: v.chapter_number,
		bismillah_pre: v.bismillah_pre,
		revelation_order: v.revelation_order,
		revelation_place: v.revelation_place,
		name_arabic: v.name_arabic,
		name_complex: v.name_complex,
		name_simple: v.name_simple,
		verses_count: v.verses_count,
		verse_from: startVerse === 0 ? 1 : startVerse+1,
		verse_end: endVerse,
		pages: v.pages,
		meaning: {
			'text': v.translated_name.name,
			'en': v.translated_name.name,
			'id': chapters_id[k].translated_name.name,
		},
	});
	startVerse += v.verses_count
	// EXCEPT surat 77 since last fail
	// if (v.chapter_number < 144) {
	// 	model.verses = morphling(tooked(v.chapter_number), totalVerse);
	// 	wroteNew(v.chapter_number, model);
	// }
})

wroteNew(model);
