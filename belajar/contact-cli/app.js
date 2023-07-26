//docs
//https://nodejs.org/docs/latest-v16.x/api/readline.html
//https://www.npmjs.com

//mengambil argumen dari commandline (CLI)
const yargs = require('yargs');
const { listContact, detailContact, simpanContact, deleteContact } = require('./contact');

yargs.command({
    command: 'add',
    describe: 'Menambahkan Contact',
    builder: {
        nama: {
            describe: 'Nama lengkap',
            demandOption: true,
            type: 'string'
        },
        email: {
            describe: 'Email',
            demandOption: false,
            type: 'string'
        },
        nohp: {
            describe: 'No. HP',
            demandOption: true,
            type: 'string'
        },
    },
    handler(argv) {
        simpanContact(argv.nama, argv.email, argv.nohp);
    }
}).demandCommand();


yargs.command({
        command: 'list',
        describe: 'Menampilkan contact',        
        handler() {
            listContact();
        }
});

yargs.command({
    command: 'detail',
    describe: 'Menampilkan detail contact',   
    builder: {
        nama: {
            describe: 'Nama lengkap',
            demandOption: true,
            type: 'string'
        },
    },     
    handler(argv) {
        detailContact(argv.nama);
    }
});

yargs.command({
    command: 'delete',
    describe: 'Menghapus contact',   
    builder: {
        nama: {
            describe: 'Nama lengkap',
            demandOption: true,
            type: 'string'
        },
    },     
    handler(argv) {
        deleteContact(argv.nama);
    }
});

yargs.parse()