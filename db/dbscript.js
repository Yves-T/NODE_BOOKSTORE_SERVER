// run node dbscript.js to push the data to the db

const db = require('./connection.js');
const books = require('./data_generator.js');

db.books.insert(books, function (err, books) {
    if (err) {
        console.error(new Error(err));
    } else {
        console.log('Added', books.length, 'books!');
    }
    db.close();
});
