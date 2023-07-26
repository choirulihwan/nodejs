//docs
//https://nodejs.org/docs/latest-v16.x/api/readline.html
//https://www.npmjs.com

const fs = require('fs');

//write synchronous
// try {
//     fs.writeFileSync('test.txt', "Hello world synchronous")
// } catch(e) {
//     console.log(e);
// }

//write asynchronous
// data = "Hello world asynchronous";
// fs.writeFile('test.txt', data, (e) => {
//     if (e) throw e;
//     console.log('The file has been saved!');
// });

//read synchronous
// const data = fs.readFileSync('test.txt', 'utf-8');
// console.log(data);

// read async
// fs.readFile('test.txt', 'utf-8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
// });

//readline
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Siapa nama anda? ', (nama) => {
    rl.question('Masukkan no.HP: ', (hp) => {
        
        const contact = {nama, hp};
        const file = fs.readFileSync('data/contacts.json', 'utf-8');
        const contacts = JSON.parse(file);

        contacts.push(contact);

        fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))

        console.log(`Terima kasih ${nama}, sudah menginput ${hp}`);
        
        rl.close();
    });   
    
});

