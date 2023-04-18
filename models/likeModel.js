import { Model, Sequelize } from "sequelize";
//koneksi ke database
import db from "../config/db.js";
//import user model & forum model
import Users from "./userModel.js";
import Post from "./postModel.js";

const { DataTypes } = Sequelize;

const Like = db.define(
  "like",
  {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

// Menghubungkan tabel Like dengan User
Like.belongsTo(Users);
Users.hasMany(Like, { foreignKey: "userId" });

export default Like;
