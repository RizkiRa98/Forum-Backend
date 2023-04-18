import { Sequelize } from "sequelize";
//koneksi ke database
import db from "../config/db.js";
//import user model & forum model
import Users from "./userModel.js";
import Post from "./postModel.js";

const { DataTypes } = Sequelize;

const Comment = db.define(
  "comment",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    isiComment: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  { freezeTableName: true }
);

//menghubungkan tabel post dan comment
Post.hasMany(Comment);
Comment.belongsTo(Post, { foreignKey: "postId" });
//Menghubungkan tabel comment dan user
Users.hasMany(Comment);
Comment.belongsTo(Users, { foreignKey: "userId" });

export default Comment;
