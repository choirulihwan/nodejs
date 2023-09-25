const fs = require('fs');
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
    const file = fs.readFileSync(filePath, 'utf-8');
    const contacts = JSON.parse(file);
    return contacts;
};

const findContact = (nama) => {
    const contacts = loadContact();
    const contact = contacts.find((icontact) => icontact.nama.toLowerCase() === nama.toLowerCase());
    return contact;
}

const addContact = (contact) => {      
    const contacts = loadContact();
    contacts.push(contact);
    saveContacts(contacts);
}

const saveContacts = (contacts) => {
    fs.writeFileSync(filePath, JSON.stringify(contacts));
}

const deleteContact = (nama) => {    
    const contacts = loadContact();
    const newContact = contacts.filter((icontact) => icontact.nama.toLowerCase() !== nama.toLowerCase());
    saveContacts(newContact);
    
};

const updateContact = (contact) => {
    const contacts = loadContact();
    const filtered = contacts.filter((icontact) => icontact.nama.toLowerCase() !== contact.old_nama.toLowerCase());
    delete contact.old_nama;
    filtered.push(contact);
    saveContacts(filtered);
};

module.exports = { loadContact, findContact, addContact, deleteContact, updateContact };