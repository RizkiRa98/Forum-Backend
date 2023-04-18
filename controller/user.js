import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import fs from "fs";
import { Op } from "sequelize";
import Like from "../models/likeModel.js";
import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";
import { execFileSync } from "child_process";
//fungsi get all User
export const getUser = async (req, res) => {
  try {
    const response = await Users.findAll({
      //atribut yang ingin di tampilkan
      attributes: [
        "id",
        "uuid",
        "userName",
        "name",
        "email",
        "roleId",
        "gender",
        "foto",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTabelUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Users.count({
      where: {
        [Op.or]: [{ name: { [Op.iLike]: "%" + search + "%" } }],
        [Op.or]: [{ email: { [Op.iLike]: "%" + search + "%" } }],
        [Op.or]: [{ roleId: { [Op.iLike]: "%" + search + "%" } }],
      },
    });
    const totalPage = Math.ceil(totalRows / limit);
    const response = await Users.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: "%" + search + "%" } },
          { email: { [Op.iLike]: "%" + search + "%" } },
          { roleId: { [Op.iLike]: "%" + search + "%" } },
          { userName: { [Op.iLike]: "%" + search + "%" } },
        ],
      },
      offset: offset,
      limit: limit,
      //atribut yang ingin di tampilkan
      attributes: [
        "id",
        "uuid",
        "userName",
        "name",
        "email",
        "roleId",
        "gender",
        "foto",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      response: response,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPage: totalPage,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//fungsi get User by id
export const getUserById = async (req, res) => {
  try {
    const response = await Users.findOne({
      //atribut yang ingin di tampilkan
      attributes: [
        "uuid",
        "userName",
        "name",
        "email",
        "roleId",
        "gender",
        "foto",
        "createdAt",
      ],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//fungsi create User
export const createUser = async (req, res) => {
  const { userName, name, email, password, confPassword, roleId, gender } =
    req.body;
  // Validasi format email salah
  if (email) {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "Format Email Salah!" });
    }
  }

  // Validai email jika sudah digunakan
  const cekEmail = await Users.findOne({
    where: {
      email: email,
    },
  });
  if (cekEmail) {
    return res.status(400).json({ msg: "Email Sudah Digunakan" });
  }

  //validasi password dan confirm password
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password Tidak Cocok" });

  //jika password dan confirm password sesuai
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  let userPhoto = null;
  if (typeof req.file === "undefined") {
    userPhoto = "./public/default_photo.jpg";
  } else {
    userPhoto = req.file.path;
  }
  try {
    await Users.create({
      userName: userName,
      name: name,
      email: email,
      password: hashPassword,
      roleId: roleId,
      gender: gender,
      foto: userPhoto,
    });
    //respon status created
    res.status(200).json({ msg: "Registrasi Berhasil" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//fungsi update User
export const updateUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  // validasi jika user tidak ditemukan
  if (!user) {
    return res.status(404).json({ msg: "User Tidak Ada" });
  }

  const { userName, name, email, password, confPassword, roleId, gender } =
    req.body;
  // Validai email jika sudah digunakan
  if (email) {
    const cekEmail = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (cekEmail && email != user.email) {
      return res.status(400).json({ msg: "Email Sudah Digunakan" });
    }
  }

  // validasi jika user merubah password atau tidak mengisi field password
  let hashPassword;
  const salt = await bcrypt.genSalt();
  if (typeof password !== "undefined" && password !== null && password !== "") {
    hashPassword = await bcrypt.hash(password, salt);
  } else {
    hashPassword = user.password;
  }
  //validasi password dan confirm password
  if (password !== confPassword)
    res.status(400).json({ msg: "Password dan Confirm Password Tidak Cocok" });

  //update data
  try {
    let foto = "";
    const filepath = `./${user.foto}`;
    if (!req.file) {
      foto = user.foto;
    } else {
      foto = req.file.path;
      if (user.foto !== "./public/default_photo.jpg") {
        // Cek foto apakah default foto ?
        const isDefaultFoto = user.foto === "./public/default_photo.jpg";
        if (!isDefaultFoto) {
          fs.unlinkSync(filepath);
        }
      }
    }
    await Users.update(
      {
        userName: userName,
        name: name,
        email: email,
        password: hashPassword,
        roleId: roleId,
        gender: gender,
        foto,
      },
      {
        where: { uuid: user.uuid },
      }
    );
    //respon status updated
    res.status(200).json({ msg: "Data User Berhasil Di Update" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//fungsi delete User
export const deleteUser = async (req, res) => {
  //delete data
  try {
    // Cek kondisi userId pada Like sama dengan userId yg akan di hapus jika iya maka hapus
    const likeUser = await Like.findOne({
      where: {
        userId: req.params.id,
      },
    });
    if (likeUser) {
      likeUser.destroy();
    }
    // Cek kondisi userId pada Comment sama dengan userId yg akan di hapus jika iya maka hapus
    const commentUser = await Comment.findOne({
      where: {
        userId: req.params.id,
      },
    });
    if (commentUser) {
      commentUser.destroy();
    }
    // Cek kondisi userId pada Post sama dengan userId yg akan di hapus jika iya maka hapus
    const postUser = await Post.findOne({
      where: {
        userId: req.params.id,
      },
    });
    if (postUser) {
      postUser.destroy();
    }

    const user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });
    // validasi jika user tidak ditemukan
    if (!user) {
      return res.status(404).json({ msg: "User Tidak Ada" });
    }
    const filepath = `./${user.foto}`;
    if (user.foto !== "./public/default_photo.jpg") {
      // Cek foto adalah default foto ?
      const isDefaultFoto = user.foto === "./public/default_photo.jpg";
      if (!isDefaultFoto) {
        // Hapus foto jika foto bukan default foto
        // if (execFileSync(filepath)) {
        fs.unlinkSync(filepath);
        // }
      }
    }
    await Users.destroy({
      where: { uuid: user.uuid },
    });
    //respon status deleted
    res.status(200).json({ msg: "Data User Berhasil Dihapus" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};
