//docs
//https://nodejs.org/docs/latest-v16.x/api/readline.html
//https://www.npmjs.com

const { rejects } = require('assert');
const { resolve } = require('path');

const { tulisPertanyaan } = require('./contact2.js')
const { simpanContact } =  require('./contact.js')

const main = async() => {
    const nama = await tulisPertanyaan('Siapa nama anda? ');
    const email = await tulisPertanyaan('Apa Email anda? ');
    const hp = await tulisPertanyaan('Berapa no.hp anda? ');

    simpanContact(nama, email, hp);
};

main();
