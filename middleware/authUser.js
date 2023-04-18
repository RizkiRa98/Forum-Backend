import { refreshToken } from "../controller/refreshToken.js";
import Users from "../models/userModel.js";

//Middleware Verify User untuk meemproteksi data hanya untuk yang sudah login
//Simpan middleware verifyUser di setiap end point yang membutuhkan user untuk login
export const verifyUser = async (req, res, next) => {
  if (!req.cookies.refreshToken) {
    return res
      .status(401)
      .json({ msg: "Tidak Bisa Mengubah Data, Anda Belum Login" });
  }
  const user = await Users.findOne({
    where: {
      refresh_token: req.cookies.refreshToken,
    },
  });
  if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan" });
  req.userId = user.id;
  req.roleId = user.roleId;
  req.email = user.email;
  req.userName = user.userName;
  next();
};

//method agar hanya admin saja yang bisa ubah data
export const adminOnly = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      refresh_token: req.cookies.refreshToken,
    },
  });
  if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan" });
  if (user.roleId !== "admin") {
    return res.status(403).json({ msg: "Akses Ditolak" });
  }
  next();
};
