const mongoose = require('mongoose');

//create collection
const Contact = mongoose.model('Contact', {
    nama: 
    {
        type: String,
        required: true,
    },
    email:{
        type: String,        
    },
    hp: {
        type: String,
        required: true,
    }
});

//insert document
// const contact1 = new contact({
//     nama: 'Daffa Abid Aqila',
//     hp: '087839806882',
//     email: 'daffa@gmail.com'
// });

// contact1.save().then(contact => console.log(contact));

module.exports = Contact;