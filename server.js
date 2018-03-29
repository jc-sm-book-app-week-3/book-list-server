'use strict';

//applicaton dependencies
const express = require('express');
const pg = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
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
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//API Endpoints

app.get('/api/v1/books', (request, response)=>{
  client.query(`SELECT book_id, title, author, img_url, isbn FROM books;`)
    .then(results=>response.send(results.rows))
    .catch(console.error);
});

app.get('/api/v1/books/:book_id',(request,response)=>{
  console.log(request.params.book_id);
  client.query(`SELECT * FROM books WHERE book_id =$1;`,
    [request.params.book_id])
    .then(results => response.send(results.rows));
});
app.post('/api/v1/books', (request, response) => {
  console.log(request.body);
  client.query(`INSERT INTO books(title, author, img_url, isbn, description) VALUES ($1,$2,$3,$4,$5);`,
    [
      request.body.title,
      request.body.author,
      request.body.img_url,
      request.body.isbn,
      request.body.description
    ])
    .then(() => {response.send('Update complete');});
});
app.put('/api/v1/books/:id', function(request, response) {
  client.query(`UPDATE books SET title=$1, author=$2, img_url=$3, isbn=$4, description=$5
  WHERE book_id=$6;`,
  [
    request.body.title,
    request.body.author,
    request.body.img_url,
    request.body.isbn,
    request.body.description,
    request.params.book_id
  ])
    .then(() => {response.send('Update complete');})
    .catch(err => {console.error(err);});
});
app.delete('/api/v1/books/:id', (request, response) => {
  client.query(
    `DELETE FROM books WHERE book_id=$1;`,
    [request.params.book_id])
    .then(() => {
      response.send('Delete complete');
    })
    .catch(err => {
      console.error(err);
    });
});
app.delete('/api/v1/books', (request, response) => {
  client.query('DELETE FROM books')
    .then(() => {
      response.send('Delete complete');
    })
    .catch(err => {
      console.error(err);
    });
});
app.get('*',(req,res)=> res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
