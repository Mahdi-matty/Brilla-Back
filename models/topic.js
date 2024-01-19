const { Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Topic extends Model { }

Topic.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
},{
    sequelize, 
});

module.exports = Topic;