const fs = require('fs');
const got = require('got');
const axios = require('axios');
const _ = require('lodash');
const he = require('he');
const jsonfile = require('jsonfile');
const {
	chapters: chapters_en
} = require('./qapi/chapters_en.js');
const {
	chapters: chapters_id
} = require('./qapi/chapters_id.js');

const objectToWrite = [{}];

const wroteNew = (id, response) => {
	console.log('====================== BEGIN WROTE')
	let data = response
	jsonfile.writeFileSync(`./fixdb/arraydb/chapter_${id}.json`, data, {spaces: 2});
}

const tooked = (id) => {
	let url = `./fixdb/en/chapter_${id}.json`
	let url2 = `./fixdb/id/chapter_${id}.json`
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
			sajdah: v.sajdah,
			sajdah_number: v.sajdah_number,
			words: []
		}
		v.translation_id = array[1].chapters.verses[k].translation;
		_.each(v.words, (vv, kk) => {
			morphed.words.push({
				position: vv.position,
				line_number: vv.line_number,
				page_number: vv.page_number,
				code: vv.code,
				char_type: vv.char_type,
				text_madani: () => {
					if(vv.text_madani === null) {
						if(vv.char_type === 'end')
						return he.decode(vv.code)
						if(vv.char_type === 'pause')
						return he.decode(vv.code_v3)
					} else {
						return vv.text_madani
					}
				},
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
let totalVerse = 0;
_.each(chapters_en, async (v, k) => {
	let ink = []
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
			'id': chapters_id[k].translated_name.name,
		},
		verses: []
	};

	// EXCEPT surat 77 since last fail
	if (v.chapter_number !== 5123) {
		model.verses = morphling(tooked(v.chapter_number), totalVerse);
		wroteNew(v.chapter_number, model);
	}
	totalVerse += v.verses_count
})