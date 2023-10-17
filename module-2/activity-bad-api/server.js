const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/bad-bookstore', { useNewUrlParser: true, useUnifiedTopology: true });

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  summary: String,
  price: Number,
  // other necessary fields
});

const Book = mongoose.model('Book', BookSchema);


// CREATE
app.post('/books', (req, res) => {
  const book = new Book(req.body);
  book.save(); 
  res.status(201).send(book);
});

// READ
app.get('/books', (req, res) => {
  Book.find({}).exec((err, books) => { 
    if (err) throw err; 
    res.send(books);
  });
});

// UPDATE
app.put('/books/:id', (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body).exec((err, book) => {
    if (err) throw err; 
    if (!book) return res.status(404).send();
    res.send(book);
  });
});

// DELETE
app.delete('/books/:id', (req, res) => {
  Book.findByIdAndDelete(req.params.id).exec((err, book) => {
    if (err) throw err; 
    if (!book) return res.status(404).send();
    res.status(204).send();
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
