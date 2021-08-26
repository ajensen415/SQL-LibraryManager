var express = require('express');
var router = express.Router();

const Book = require('../models/').Book;

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

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/books');
});

/* GET all books listing. */
router.get('/books', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll({ order: [['year', 'DESC']] });
  res.render("index", { books });
}));

/* Create a new book form. */
router.get('/books/new', (req, res) => {
  res.render('new-book', {});
});

/* POST new book. */
router.post('/books/new', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
} catch (error) {
  if(error.name === "SequelizeValidationError") { 
      book = await Book.build(req.body);
      res.render('new-book', { book, errors: error.errors });
  } else {
    throw error;
  }
}
}));

/* GET individual book. */
router.get("/books/:id", asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', { book });
  } else {
    const err = new Error();
    err.status = 404;
    next(err);
  }
}));

/* Edit book form. */
router.get('/books/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', { book });      
  } else {
      res.sendStatus(404);
    }
}));

   /* Update book. */
  router.post('/books/:id', asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if(book ) {
        await book.update(req.body);
        res.redirect("/"); 
      } else {
        res.status(404).render('page-not-found');
      }
    } catch (error) {
      if(error.name === "SequelizeValidationError") {
        book  = await Book.build(req.body);
        book.id = req.params.id; 
        res.render('update-book', { error: false })
      } else {
        throw error;
      }
    }
  }));

  /* Delete book form. */
  router.get('/books/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
      res.render("delete-book", { book });
    } else {
      res.sendStatus(404);
    }
  }));
  
  /* Delete individual book. */
  router.post('/books/:id/delete', asyncHandler(async (req ,res) => {
    const book  = await Book.findByPk(req.params.id);
    if(book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  }));


module.exports = router;
