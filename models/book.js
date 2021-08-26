'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
    }
  };

  //Book model including title, author, genre & year.
  Book.init({
    title: { 
      type: DataTypes.STRING,
      allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Please provide a value for "title"',
        },
      },
    },
    author: { 
      type: DataTypes.STRING,
      allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Please provide a value for "author"',
        },
      },
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};