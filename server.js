'use strict';

//applicaton dependencies
const express = require('express');
const pg = require('pg');
const cors = require('cors');

//aplication setup
const app = express();
//Allows us to not have to change the code based on our Enviroment
//We will stash settings in process.env
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

//database setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

//API Endpoints

// app.get('/new', (request, response) => {};
app.get('/api/v1/books', (req,res)=> res.send('It lives'));
//This will need more once the Database is opperational
app.get('*',(req,res)=> res.redirect(CLIENT_URL));
// app.post('/api/v1/books', (request, response) => {
    client.query(``,[],function(err) {if (err) console.error(err);
    }
);
// app.put('/api/v1/books/:id', function(request, response) {client.query(``,[])
//     .then(() => {client.query(``,[])})
//     .then(() => {response.send('Update complete');})
//     .catch(err => {console.error(err);})
// });
app.delete('/api/v1/books/:id', (request, response) => {
    client.query(
        `DELETE FROM books WHERE book_id=$1;`,
        [request.params.id]
    )
    .then(() => {
        response.send('Delete complete');
    })
    .catch(err => {
        console.error(err)
    });
});
app.delete('/api/v1/books', (request, response) => {
    client.query('DELETE FROM books')
    .then(() => {
        response.send('Delete complete');
    })
    .catch(err => {
        console.error(err)
    });
});
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));