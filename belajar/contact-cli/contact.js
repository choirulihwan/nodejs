const fs = require('fs');
const chalk = require('chalk');
const validator = require('validator');

const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

const filePath = `${dirPath}/contacts.json`;
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
}



const loadContact = () => {
    const file = fs.readFileSync('data/contacts.json', 'utf-8');
    const contacts = JSON.parse(file);
    return contacts;
};

const simpanContact = (nama, email, hp) => {
    const contact = { nama, email, hp };
    
    const contacts = loadContact();

    const duplikat = contacts.find((icontact) => icontact.nama === nama);
    if(duplikat) {
        console.log(chalk.red.inverse.bold(`${nama} sudah terdaftar, gunakan yang lain`));
        return false;
    }

    if(email) {
        if(!validator.isEmail(email)) {
            console.log(chalk.red.inverse.bold(`${email} tidak valid`));
            return false;
        }
    }

    if(!validator.isMobilePhone(hp, 'id-ID')) {
        console.log(chalk.red.inverse.bold(`${hp} tidak valid`));
        return false;
    }

    contacts.push(contact);

    fs.writeFileSync(filePath, JSON.stringify(contacts))

    console.log(`Terima kasih ${nama}`);
    
    // rl.close();

};

const listContact = () => {
    const contacts = loadContact();
    console.log(chalk.cyan.inverse.bold('Daftar kontak: '));
    contacts.forEach((contact, i) => {
        console.log(`${i+1}. ${contact.nama} - ${contact.hp}`);
    });
};

const detailContact = (nama) => {
    console.log(chalk.cyan.inverse.bold(`Detail ${nama}: `));
    const contacts = loadContact();
    const contact = contacts.find((icontact) => icontact.nama.toLowerCase() === nama.toLowerCase());
    if(!contact) {
        console.log(chalk.red.inverse.bold(`${nama} tidak ditemukan `));
        return false;
    }

    console.log(chalk.blue.inverse.bold(contact.nama));
    console.log(chalk.blue.inverse.bold(contact.hp));
    if (contact.email) {
        console.log(chalk.blue.inverse.bold(contact.email));
    }    
};

const deleteContact = (nama) => {
    console.log(chalk.cyan.inverse.bold(`Hapus ${nama}: `));
    const contacts = loadContact();
    const newContact = contacts.filter((icontact) => icontact.nama.toLowerCase() !== nama.toLowerCase());
    if(contacts.length == newContact.length) {
        console.log(chalk.red.inverse.bold(`${nama} tidak ditemukan `));
        return false;
    }

    fs.writeFileSync(filePath, JSON.stringify(newContact))

    console.log(`${nama} Berhasil dihapus`);

    
};

module.exports = { listContact, detailContact, simpanContact, deleteContact };