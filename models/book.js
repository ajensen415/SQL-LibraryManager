'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
    }
  };

  //Book model including title, author, genre & year.
  Book.init({
    title: { 
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
          notEmpty: {
            msg: 'Please provide a value for "title"',
        },
      },
    },
    author: { 
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
          notEmpty: {
            msg: 'Please provide a value for "author"',
        },
      },
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};