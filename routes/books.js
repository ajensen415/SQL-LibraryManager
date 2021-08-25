const express = require('express');
const router = express.Router();

//Importing Book model
const Book = require('../models/').Book;

//Handler function to wrap each route.
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [["year", "DESC"]] });
    res.render("index", { books, title: "Books" });
  }));
  
  /* Create a new book form. */
  router.get('/new', (req, res) => {
    //res.render('"articles/new", { article: {}, title: "New Article" }');
    res.render('new-book');
  });
  
  /* POST new book. */
  router.post('/', asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if(error.name === "SequelizeValidationError") { // checking the error
        book = await Book.build(req.body);
        res.render('new-book', { error: true });
      } 
    }
  }));
  
  /* Edit book form. */
  router.get('/:id/edit', asyncHandler(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
      res.render("edit-book", { book });      
    } else {
      res.sendStatus(404);
    }
  }));
  
  /* GET individual book. */
  router.get('/:id', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
      res.render("display-book", { 
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year,
        id: book.id,
       });  
    } else {
      res.sendStatus(404);
    }
  }));
  
  /* Update book. */
  router.post('/:id/edit', asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if(book ) {
        await book.update(req.body);
        res.redirect("/books"); 
      } else {
        res.sendStatus(404).render('page-not-found');
      }
    } catch (error) {
      if(error.name === "SequelizeValidationError") {
        book  = await Book.build(req.body);
        book.id = req.params.id; // make sure correct book gets updated
        res.render("edit-book", { error: true })
      } else {
        throw error;
      }
    }
  }));
  
  /* Delete book form. */
  router.get('/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book ) {
      res.render("delete-book", { book });
    } else {
      res.sendStatus(404);
    }
  }));
  
  /* Delete individual book. */
  router.post('/:id/delete', asyncHandler(async (req ,res) => {
    const book  = await Book.findByPk(req.params.id);
    if(book ) {
      await book.destroy();
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  }));
  

module.exports = router;