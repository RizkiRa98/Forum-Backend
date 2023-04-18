import { Sequelize } from "sequelize";
//koneksi ke database
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const Forum = db.define(
  "forum",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    namaForum: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [4, 50],
      },
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 150],
      },
    },
    icon: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

export default Forum;
