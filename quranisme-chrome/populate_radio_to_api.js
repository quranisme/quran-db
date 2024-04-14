// Quranisme Chrome Purpose
/*
* Jadi sehabis ambil radio language dari Mp3
* untuk Fetch language endpoint dari Mp3Quran
* Lantas digabungkan, gitu loooh
* */

const axios = require('axios');

/*
* URL
* */
const devUrl = 'http://localhost:1337/'
const path = {
    RADIOS: 'radios',
    RADIOS_PUT: (key, value) => `radios/${key}/${value}`,
};

const token = () => {
    return {
        "Authorization": "Bearer"
    }
}
const GET_API = async (path, data) => {
    return new Promise((resolve, reject) => {
        axios.get(devUrl+path, {
            headers: token(),
            timeout: 1135000,
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
const PUT_API = async (path, data) => {
    return new Promise((resolve, reject) => {
        axios.put(devUrl+path, data,{
            headers: token(),
            timeout: 1135000,
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
const POST_API = async (path, data) => {
    let pos;
    return new Promise((resolve, reject) => {
        axios.post(devUrl+path, data, {
            headers: token(),
            timeout: 1135000,
        }).then(res => {
            resolve(res)
        }).catch(res=> {
            reject(res)
        })
    })
    // return pos
}

/**
 * UPDATE RADIO
 */
const UPDATE_RADIO = () => {
    const _ = require('lodash');
    const fs = require('fs')
    const jsonfile = require('jsonfile');
    const joined = [];
    const counter = 0;
    const fullradios = jsonfile.readFileSync('fullradios.json');

    console.log("LENGTH", fullradios.length)

    const chunk = _.chunk(fullradios, 9)
    _.each(chunk, async (v, k) => {
        // console.log('=', k)
        await _.each(v, async (vv, kk) => {
        // console.log('==', k, kk);
        let a = await GET_API(`${path.RADIOS}?radio_id=${vv.radio_id}`);
        if(a.length > 0) {
            await POST_API(`${path.RADIOS()}`, chunk[k][kk])
        }
        // await PUT_API(`${path.RADIOS_PUT("radio_id", parseInt(vv.radio_id))}`, chunk[k][kk])

        // if(!server) {
        //     console.log("Writing", vv.radio_id)
        // }
        })
    })
}
UPDATE_RADIO();

