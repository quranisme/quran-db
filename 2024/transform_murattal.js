const jsonfile = require('jsonfile');
const _ = require('lodash');

const { reciters, servers, suwar, tags, qiraat } = require('./input_murattal/murattal_reciters').default


for (const reciter of reciters) {
    const { en, ar, recitations } = reciter
}