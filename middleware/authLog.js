// import Users from "../models/userModel.js";
// import morgan from "morgan";
// import dayjs from "dayjs";

// module.exports = [
//   async function verifyUser(req, res, next) {
//     if (!req.cookies.refreshToken) {
//       return res
//         .status(401)
//         .json({ msg: "Tidak Bisa Mengubah Data, Anda Belum Login" });
//     //
//     const user = await Users.findOne({
//       where: {
//         refresh_token: req.cookies.refreshToken,
//       },
//     });
//     if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan" });
//     req.userId = user.id;
//     req.roleId = user.roleId;
//     req.userName = user.userName;
//     next();
//   },
//   function logger() {
//     return morgan(
//       (tokens, req, res) => {
//         // Jika method adalah GET maka skip
//         if (req.method === "GET") {
//           return null;
//         }
//         const log = {
//           method: tokens.method(req, res),
//           url: tokens.url(req, res),
//           status: tokens.status(req, res) || res.statusCode,
//           timestamp: dayjs().format("YY/MM/DD HH:mm:ss"),
//           user: req.userName,
//         };
//         // mengembalikan log sebagai string
//         return JSON.stringify(log);
//       },
//       {
//         stream: accessLogStream,
//         format: "json",
//         immediate: true,
//       }
//     );
//   },
// ];
