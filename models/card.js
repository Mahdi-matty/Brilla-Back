const { Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Card extends Model { }

Card.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
  }
);
  
module.exports = Card;