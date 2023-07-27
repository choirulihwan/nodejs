const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'db_belajar';

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.connect((error, client) => {
    if(error) {
        return console.log('Koneksi gagal');
    }

    console.log('berhasil');

});
    
const db = client.db(dbName);

//insert
// db.collection('mahasiswa').insertOne(
//     {
//         nama: "Erna",
//         email: "erna@yahoo.com",
//         hp: "087838858913"
//     },
//     (error, result) => {
//         if (error) {
//             return console.log('Gagal input');
//         }

//         console.log(result);
//     }
// );

// db.collection('mahasiswa').insertMany(
//     [
//         {
//             nama: "M. Davi Abqory",
//             email: "davi@yahoo.com",
//             hp: "087838858913"
//         },

//         {
//             nama: "Mas ibnu",
//             email: "ibnu@yahoo.com",
//             hp: "087838858913"
//         },
//     ],
//     (error, result) => {
//         if (error) {
//             return console.log('Gagal input');
//         }

//         console.log(result);
//     }
// );

// find
// db.collection('mahasiswa').find().toArray((err, result) => {
//     console.log(result);
// });

// db.collection('mahasiswa').find({ _id: ObjectId("64c0d24a09351f0e991b248f") }).toArray((err, result) => {
//     console.log(result);
// });

//update 
// const update = db.collection('mahasiswa').updateOne(
//     {
//         _id: ObjectId("64c0d24a09351f0e991b248f"),
//     },
//     {
//         $set: {
//             nama:'Choirul'
//         }
//     }
// );

// const update = db.collection('mahasiswa').updateMany(
//     {
//         hp: "087838858913",
//     },
//     {
//         $set: {
//             hp:'087839806882'
//         }
//     }
// );


// update.then(result => {
//     console.log(result)
// }).catch(error => {
//     console.log(error)
// });


//delete
// db.collection('mahasiswa').deleteOne(
//     {
//         _id: ObjectId("64c1cca0b5c0680c0c339da2")
//     }
// ).then(result => {
//     console.log(result);
// }).catch(error => {
//     console.log(error)
// });

db.collection('mahasiswa').deleteMany(
    {
        hp: "087839806882"
    }
).then(result => {
    console.log(result);
}).catch(error => {
    console.log(error)
});

