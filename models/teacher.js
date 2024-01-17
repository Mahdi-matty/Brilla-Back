const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/connection');

class Teacher extends Model { }

Teacher.init(
  {
    teachername: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    hooks: {
      beforeCreate: newUserData => {
        newUserData.password = bcrypt.hashSync(newUserData.password, 10);
        return newUserData;
      },
    },
    sequelize,
  }
);

module.exports = Teacher;