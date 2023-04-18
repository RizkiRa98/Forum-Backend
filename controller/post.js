import Post from "../models/postModel.js";
import Users from "../models/userModel.js";
import fs from "fs";
// Import Operator Dari Sequelize
import { Op, Sequelize, where } from "sequelize";
import multer from "multer";
import path from "path";
import Forum from "../models/forumModel.js";
import Like from "../models/likeModel.js";

//fungsi get all post
export const getPost = async (req, res) => {
  try {
    // Last Id dan limit me return string, karna yang dibutuhka string jadi menggunakan parseInt untuk mengubah ke Int
    const last_id = parseInt(req.query.lastId) || 0;
    // Set limit untuk memunculkan data dengan default 10 data
    const limit = parseInt(req.query.limit) || 10;
    // untuk search menggunakan string, jika tidak mengirim search set default nya empty string
    const search = req.query.search_query || "";

    let result = [];

    // Pengkondisian jika last ID nya kurang dari 1 maka tampilkan ID yg awal saja. Dan jika Last ID nya sama dengan Last Id maka post yang di tampilkan mulai dari last Id
    if (last_id < 1) {
      const response = await Post.findAll({
        //Attribut yang ingin ditampilkan
        attributes: [
          "id",
          "uuid",
          "judulPost",
          "isiPost",
          "createdAt",
          "forumId",
          "userId",
          "foto",
        ],
        where: {
          [Op.or]: [{ judulPost: { [Op.iLike]: "%" + search + "%" } }],
        },
        limit: limit,
        include: [
          {
            model: Users,
            attributes: ["id", "userName", "name", "roleId", "gender", "foto"],
          },
          {
            model: Forum,
            attributes: ["id", "namaForum", "detail"],
          },
          {
            model: Like,
            attributes: ["id", "userId"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      result = response;
    } else {
      const response = await Post.findAll({
        //Attribut yang ingin ditampilkan
        attributes: [
          "id",
          "uuid",
          "judulPost",
          "isiPost",
          "createdAt",
          "forumId",
          "userId",
          "foto",
        ],
        where: {
          id: {
            [Op.lt]: last_id,
          },
          [Op.or]: [{ judulPost: { [Op.iLike]: "%" + search + "%" } }],
        },
        limit: limit,
        include: [
          {
            model: Users,
            attributes: ["id", "userName", "name", "roleId", "gender", "foto"],
          },
          {
            model: Forum,
            attributes: ["id", "namaForum", "detail"],
          },
          {
            model: Like,
            attributes: ["id", "userId"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      result = response;
    }
    res.status(200).json({
      result: result,
      lastId: result.length ? result[result.length - 1].id : 0,
      hasMore: result.length >= limit ? true : false,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//fungsi get all post by id forum
export const getPostByForumId = async (req, res) => {
  try {
    // Last Id dan limit me return string, karna yang dibutuhka string jadi menggunakan parseInt untuk mengubah ke Int
    const last_id = parseInt(req.query.lastId) || 0;
    // Set limit untuk memunculkan data dengan default 10 data
    const limit = parseInt(req.query.limit) || 10;
    // untuk search menggunakan string, jika tidak mengirim search set default nya empty string
    const search = req.query.search_query || "";

    let result = [];

    // Pengkondisian jika last ID nya kurang dari 1 maka tampilkan ID yg awal saja. Dan jika Last ID nya sama dengan Last Id maka post yang di tampilkan mulai dari last Id
    if (last_id < 1) {
      const response = await Post.findAll({
        //Attribut yang ingin ditampilkan
        attributes: [
          "id",
          "uuid",
          "judulPost",
          "isiPost",
          "createdAt",
          "forumId",
          "foto",
        ],
        where: {
          forumId: { [Op.eq]: req.params.id },
          [Op.or]: [{ judulPost: { [Op.iLike]: "%" + search + "%" } }],
        },
        limit: limit,
        include: [
          {
            model: Users,
            attributes: ["userName", "name", "roleId", "gender", "foto"],
          },
          {
            model: Forum,
            attributes: ["id", "namaForum", "detail"],
          },
          {
            model: Like,
            attributes: ["id", "userId"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      result = response;
    } else {
      const response = await Post.findAll({
        //Attribut yang ingin ditampilkan
        attributes: [
          "id",
          "uuid",
          "judulPost",
          "isiPost",
          "createdAt",
          "forumId",
          "foto",
        ],
        where: {
          forumId: { [Op.eq]: req.params.id },
          id: {
            [Op.lt]: last_id,
          },
          [Op.or]: [{ judulPost: { [Op.iLike]: "%" + search + "%" } }],
        },
        limit: limit,
        include: [
          {
            model: Users,
            attributes: ["userName", "name", "roleId", "gender", "foto"],
          },
          {
            model: Forum,
            attributes: ["id", "namaForum", "detail"],
          },
          {
            model: Like,
            attributes: ["id", "userId"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      result = response;
    }
    res.status(200).json({
      result: result,
      lastId: result.length ? result[result.length - 1].id : 0,
      hasMore: result.length >= limit ? true : false,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//fungsi get post by Judul
export const getPostById = async (req, res) => {
  try {
    const response = await Post.findOne({
      //Attribut yang ingin ditampilkan
      attributes: [
        "id",
        "uuid",
        "judulPost",
        "isiPost",
        "createdAt",

        "forumId",
        "foto",
      ],
      // cari data berdasarkan judul post sebagai parameter
      where: {
        [Op.and]: [{ forumId: req.params.idForum }, { id: req.params.id }],
      },
      include: [
        {
          model: Users,
          attributes: ["id", "userName", "name", "roleId", "gender", "foto"],
        },
        {
          model: Forum,
          attributes: ["id", "namaForum", "detail"],
        },
        {
          model: Like,
          attributes: ["id", "userId"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//fungsi create post
export const createPost = async (req, res) => {
  const { judulPost, isiPost, forumId } = req.body;
  try {
    let postPhoto = null;
    if (req.file) {
      postPhoto = req.file.path;
    }
    await Post.create({
      judulPost: judulPost,
      isiPost: isiPost,
      forumId: forumId,
      foto: postPhoto,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Post Berhasil Dibuat" });
  } catch (error) {
    res.status(500).json({ msg: "Gagal Membuat Post, Judul Minimal 4 Kata" });
  }
};

//fungsi update post
export const updatePost = async (req, res) => {
  // Mencari post berdasarkan uuid
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!post) {
      res.status(404).json({ msg: "Post Tidak Ada" });
    }

    let foto = "";

    if (!req.file) {
      foto = post.foto;
    } else {
      foto = req.file.path;
      if (fs.existsSync(`./${post.foto}`)) {
        fs.unlinkSync(`./${post.foto}`);
      }
    }

    const { judulPost, isiPost, forumId } = req.body;
    // Jika yang akses data adalah admin
    // Maka munculkan data

    if (req.roleId === "admin") {
      await Post.update(
        { judulPost, isiPost, forumId, foto },
        {
          where: {
            id: post.id,
          },
        }
      );
    } else {
      // Jika yang akses data bukan admin atau bukan user yang post
      // Maka akses ditolak
      // Jika yang akses adalah user yang post, maka tampilkan data
      if (req.userId !== post.userId) {
        return res.status(403).json({
          msg: "Akses Ditolak! Anda Tidak Bisa Update Postingan Ini!",
        });
      }
      await Post.update(
        { judulPost, isiPost, forumId, foto },
        {
          where: {
            [Op.and]: [{ id: post.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Post Berhasil Di Update" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Gagal Update" });
  }
};

//fungsi delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!post) {
      res.status(404).json({ msg: "Post Tidak Ada" });
    }
    // Jika yang akses data adalah admin
    // Maka munculkan data
    if (req.roleId === "admin") {
      const filepath = `./${post.foto}`;
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      await Post.destroy({
        where: {
          id: post.id,
        },
      });
    } else {
      // Jika yang akses data bukan admin atau bukan user yang post
      // Maka akses ditolak
      // Jika yang akses adalah user yang post, maka tampilkan data
      if (req.userId !== post.userId) {
        return res.status(403).json({
          msg: "Akses Ditolak! Anda Tidak Bisa Hapus Postingan Ini!",
        });
      }

      const filepath = `./${post.foto}`;
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      await Post.destroy({
        where: {
          [Op.and]: [{ id: post.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Post Berhasil Di Hapus" });
  } catch (error) {
    res.status(500).json({ msg: msg.message });
  }
};
