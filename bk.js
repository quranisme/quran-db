const fs = require('fs');
const got = require('got');
const _ = require('lodash');
const jsonfile = require('jsonfile');
const {
	chapters
} = require('./qapi/chapters_en.js');


const objectToWrite = [{}];

const took = (id, offset, limit) => {
	console.log ('#ID#', id);
		try {
			let url = `http://staging.quran.com:3000/api/v3/chapters/${id}/verses?recitation=1&translations=34&language=id&text_type=words&offset=${offset}&limit=${limit}`;
			// console.log('## URL' + id, url);
			const response = got(url, {
				json: true
			});
			if(response){
				return response
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
	console.log ('#ID#', id);
		try {
			let url = `http://staging.quran.com:3000/api/v3/chapters/${id}/verses?recitation=1&translations=21&language=en&text_type=words&offset=${offset}&limit=${limit}`;
			// console.log('## URL' + id, url);
			console.log('## URL' + id, url);
			console.log('## OFFSET' + id, offset);
			console.log('## LIMIT' + id, limit);
			const response = await got(url, {
				json: true
			});
			return response.body.verses
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
	// jsonfile.writeFile(`./qapi/verses/chapter_en_${id}.json`, response, 'utf8', function (err, result) {
	// 	if (err) console.log('error', err);
	// });
	let test = {verses: response}
	jsonfile.writeFile(`./qapi/verses/en/chapter_en_${id}.json`, test, function (err, result) {
		if (err) console.log('error', err);
	});
	// jsonfile.writeFileSync(`./qapi/verses/chapter_en_${id}.json`, response);
}



_.each(chapters, async (v, k) => {
	let go = 50;
	let model = [
		{
			name: v.name_arabic,
			name: v.name_complex,
			words: [] 
		},
		{}
	]

	// IF VERSES dibawah 50
	if(v.verses_count < 50) {
		// console.log('CHAPTER BELOW 50', v.name_complex);
		let ink = []
		go = 50;
		took(v.chapter_number, go-50, go).then((v1, k1) => {
			ink.push(v1.body.verses)
			wrote(v.chapter_number, ...ink)
		});
	} 
	
	if(v.verses_count > 50) {
		console.log('CHAPTER ABOVE 50', v.name_complex);
		let ink = [];
		let things; 
		let iteration = Math.round(v.verses_count/50);
		go = 50;
		for (let i = 1; i <= iteration; i++) {
			console.log('#ITERATION', v.name_complex);
			console.log('#TO', Math.round(v.verses_count/50));
			if(i == iteration) {
				console.log('LAST PUSH ITERATION', v.name_complex);
				console.log('LAST PUSH LENGTH', ink.length);
				ink.push(...await tookAsync(v.chapter_number, go-50, v.verses_count));
				ink = _.uniqBy(ink, 'verse_key');
				// wrote(v.chapter_number, ...ink)
			} else {
				// things = await tookAsync(v.chapter_number, go-50, go);
				ink.push(...await tookAsync(v.chapter_number, go-50, go));
			}
			go += 50
			// console.log(things)
			// tookAsync(v.chapter_number, go-50, v.verses_count).then((vv, kk) => {
				// console.log('!-#TOOK LAGI', _.size(vv.body.verses));
				// ink.push(vv.body.verses);
			// });
			// go += 50;
		}
		// if(_.size(ink) > 50) {
			console.log('WROTE OUTSIDE', v.name_complex);
			wrote(v.chapter_number, ink);
		// }
	}

	// took(v.chapter_number, go-50, go).then((v1, k1) => {
	// 	ink.push(v1.body.verses);
	// 	if(v.verses_count < 50)	{
	// 		wrote(v.chapter_number, ...ink);
	// 	} else if(v.verses_count > 50) {
	// 		go += 50;
	// 		ink.push(v1.body.verses);
	// 		for (let i = 1; i < Math.round(v.verses_count / 50); i++) {
	// 			console.log('#ITERATION', i);
	// 			console.log('#TO', Math.round(v.verses_count/50));
	// 			took(v.chapter_number, go-50, v.verses_count).then((vv, kk) => {
	// 				console.log('!-#TOOK LAGI', _.size(vv.body.verses));
	// 				ink.push(vv.body.verses);
	// 				if(i === Math.round(v.verses_count/50)) {
	// 					wrote(v.chapter_number, ...ink)
	// 				}
	// 			});
	// 			go += 50;
	// 		}
	// 		// wrote(v.chapter_number, ...ink)
	// 	}
	// 	// if(v.verses_count > 50) {
	// 	// 	took(v.chapter_number, go-50, go);
	// 	// }
	// })



	// if (v.verses_count < 50) {
	// 	took(v.chapter_number, go-50, go).then((v1, k1) => {
	// 		ink.push(v1.body.verses);
	// 		// console.log('INK INK INK', ink)
	// 	})
	//  	// ink = await took(k, go-50, go);
	// 	 wrote(v.chapter_number, ink);	
	// } else {
	// 	 for (let i = 1; i < Math.round(v.verses_count / 50); i++) {
	// 		if(i == 1){
	// 			// ink = await took(k, go-50, go);
	// 			// console.log('#First Iteration', i);
	// 			took(v.chapter_number, go-50, go).then((v1, k1) => {
	// 				console.log('testest',v1.body.verses)
	// 					ink = v1.body.verses;
	// 					wrote(k, ink);
	// 					// console.log('INK INK INK', ink)
	// 				})
	// 				// console.log('#First Ink', await ink);
	// 				go += 50;
	// 			} else {
	// 				// ink.push(took(k, go-50, go));
			
	// 			// console.log('#Beetween Iteration', i);
	// 			// ink.push(await took(k, go-50, go));
	// 			// console.log('#Between Ink', await ink);
	// 			// go += 50;
	// 		}
			
	// 		if(i == Math.round(v.verses_count/50)) {
	// 			// console.log('#Last Iteration', i);
	// 			// ink.push(await took(k, go-50, v.verses.count));
	// 			// console.log('#Last Ink', await ink);
	// 			took(v.chapter_number, go-50, v.verses_count).then((v1, k1) => {
	// 				ink.push(v1.body.verses);
	// 				// console.log('INK INK INK', ink)
	// 			})
	// 			break;
	// 		} else {
	// 			took(v.chapter_number, go-50, go).then((v1, k1) => {
	// 				ink.push(v1.body.verses);
	// 				// console.log('INK INK INK', ink)
	// 			})
	// 			// console.log('#First Ink', await ink);
	// 			go += 50;
	// 		}
	// 	}
	// 	wrote(v.chapter_number, ink);
	// }
	// wrote(v.chapter_number, ink);
});

// for(let i = 1; i < chapters)

// GETTING CHAPTER
// (async () => {
// 	try {
// 		const response = await got(`http://staging.quran.com:3000/api/v3/chapters?language=id`, {json: false});
// 		await fs.writeFile('./qapi/verseschapters_id.json', JSON.stringify(response.body), 'utf8', function (err, res) {
// 			if (err) console.log('wtf', err)
// 		});;
// 	} catch(error) {
// 		console.log(error)
// 	}
// })();


// for (let i = 1; i <= Math.round(verseLength / 50); i++) {
// 	console.log('DISPATCH ITERATION', i);
// 	if (i === 1) {
// 		dispatch('initFetchPuzzle', {
// 			limit: l,
// 			offset: l - 50,
// 			push: true
// 		});
// 		l += 50;
// 	} else {
// 		dispatch('initFetchPuzzle', {
// 			limit: l,
// 			offset: l - 50,
// 			push: true
// 		});
// 		l += 50;
// 		console.log('limit AFter dspatch', l);
// 	}

// 	if (i === Math.round(verseLength / 50)) {
// 		dispatch('initFetchPuzzle', {
// 			limit: verseLength,
// 			offset: l - 50,
// 			push: true
// 		});
// 		break;
// 	}
// }

// const took = async (id, offset, limit) => {
// 	for (let i = 1; i <= 1; i++) {
// 		try {
// 			const response = await got(`http://staging.quran.com:3000/api/v3/chapters/${id}/verses?recitation=1&translations=21&language=en&text_type=words&offset=${offset}&limit=${limit}`, {
// 				json: false
// 			});
// 			await fs.writeFile(`./qapi/verses/chapter_en_${id}.json`, JSON.stringify(response.body), 'utf8', function (err, result) {
// 				if (err) console.log('error', err);
// 			});
// 		} catch (error) {
// 			console.log(error)
// 		}
// 		// const response = await got(`http://staging.quran.com:3000/api/v3/chapters/${i}/info`, { json: true });
// 	}
// };

// (async () => {
// 		const response = await got('http://api.alquran.cloud/surah', { json: true });
// 		// let rawdata = fs.readFileSync(response.body);  
// 		fs.writeFile('./db/surahlist.json', JSON.stringify(response.body), 'utf8' , function(err, result) {
// 			if(err) console.log('error', err);
// 		  });
// })();
//WORKING GOOD
// (async () => {
// 	  for (let i = 1; i <= 2; i++) {
// 		// got.stream(`http://api.alquran.cloud/surah/${i}/editions/ar.alafasy,quran-uthmani,id.indonesian,en.sahih`, {json:false})
// 		// .pipe(fs.createWriteStream(`./db/surah_${i}.json`, 'utf8'));
// 		// const response = await got(`http://api.alquran.cloud/surah/${i}/editions/ar.alafasy,quran-uthmani,id.indonesian,en.sahih`, { json: true });
// 		try {
// 			// const response = await got(`http://api.alquran.cloud/juz/${i}/ar.alafasy`, { json: true });
// 			const response = await got(`http://staging.quran.com:3000/api/v3/chapters/1/verses?recitation=1&translations=21&language=en&text_type=words&offset=0&limit=50`, { json: false });
// 			await fs.writeFile(`./jsdb/chapter_${i}.js`, `export default ${response.body}`, 'utf8' , function(err, result) {
// 				if(err) console.log('error', err);
// 			  });;  
// 		} catch (error) {
// 			console.log(error)
// 		}
// 		// const response = await got(`http://staging.quran.com:3000/api/v3/chapters/${i}/info`, { json: true });

// 	  }
// })();

// got.stream('http://api.alquran.cloud/surah').pipe(fs.createWriteStream('./db/surahlist.json'));
// for (let i = 1; i <= 10; i++) {
// 	got.stream(`http://api.alquran.cloud/surah/${i}/editions/ar.alafasy,quran-uthmani,id.indonesian,en.sahih`, {json:true}).pipe(fs.createWriteStream(`./db/surah_${i}.json`));
// }


// fs.createReadStream('inde.html').pipe(got.stream.post('sindresorhus.com'));