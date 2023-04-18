import Forum from "../models/forumModel.js";
import fs from "fs";
import { Op } from "sequelize";

//fungsi get all forum semua role bisa lihat
export const getForum = async (req, res) => {
  try {
    const response = await Forum.findAll({
      //Atribut yang ingin ditampilkan
      attributes: ["id", "uuid", "namaForum", "detail", "icon", "createdAt"],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTableForum = async (req, res) => {
  try {
    // Set Pagination
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Forum.count({
      where: {
        [Op.or]: [{ namaForum: { [Op.iLike]: "%" + search + "%" } }],
      },
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Forum.findAll({
      where: {
        [Op.or]: [{ namaForum: { [Op.iLike]: "%" + search + "%" } }],
      },
      offset: offset,
      limit: limit,
      //Atribut yang ingin ditampilkan
      attributes: ["id", "uuid", "namaForum", "detail", "icon", "createdAt"],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json({
      result: result,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPage: totalPage,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//fungsi get forum by id
export const getForumById = async (req, res) => {
  try {
    const response = await Forum.findOne({
      //Atribut yang ingin ditampilkan
      attributes: ["id", "uuid", "namaForum", "detail", "createdAt", "icon"],
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//fungsi create forum
export const createForum = async (req, res) => {
  const { namaForum, detail } = req.body;
  let iconForum = null;
  if (typeof req.file === "undefined") {
    iconForum = "./public/default_icon.png";
  } else {
    iconForum = req.file.path;
  }
  console.log(iconForum);
  try {
    await Forum.create({
      namaForum: namaForum,
      detail: detail,
      icon: iconForum,
    });

    res.status(201).json({ msg: "Forum Berhasil Dibuat" });
  } catch (error) {
    if (
      error.errors &&
      error.errors.detail &&
      error.errors.detail.kind === "minlength"
    ) {
      res.status(400).json({ msg: "Detail Minimal 15 Huruf" });
    } else {
      res.status(500).json({ msg: "Gagal Membuat Forum" });
    }
  }
};

//fungsi update forum
export const updateForum = async (req, res) => {
  const forum = await Forum.findOne({
    where: {
      id: req.params.id,
    },
  });
  //Validasi jika forum tidak ditemukan
  if (!forum) {
    return res.status(404).json({ msg: "Forum Tidak Ada" });
  }
  const { namaForum, detail } = req.body;
  try {
    //  Cek icon forum
    let icon = "";
    const filepath = `./${forum.icon}`;
    if (!req.file) {
      icon = forum.icon;
    } else {
      icon = req.file.path;
      if (forum.icon !== "./public/default_icon.png") {
        // Cek foto apakah default foto ?
        const isDefaultFoto = forum.icon === "./public/default_icon.png";
        if (!isDefaultFoto) {
          fs.unlinkSync(filepath);
        }
      }
    }
    await Forum.update(
      {
        namaForum: namaForum,
        detail: detail,
        icon,
      },
      {
        where: { id: forum.id },
      }
    );
    //respon status updated
    res.status(200).json({ msg: "Forum berhasil di Update" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//fungsi delete forum
export const deleteForum = async (req, res) => {
  const forum = await Forum.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!forum) {
    return res.status(404).json({ msg: "Forum Tidak Ada" });
  }

  try {
    //Mengahpus data forum berdasarkan ID
    const filepath = `./${forum.icon}`;
    if (forum.icon !== "./public/default_icon.png") {
      // Cek icon apakah icon adalah default icon ?
      const isDefaultIcon = forum.icon === "./public/default_icon.png";
      if (!isDefaultIcon) {
        // Hapus icon jika icon bukan default icon
        fs.unlinkSync(filepath);
      }
    }
    await Forum.destroy({
      where: { uuid: forum.uuid },
    });
    res.status(200).json({ msg: "Data Forum Berhasil Di Hapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
