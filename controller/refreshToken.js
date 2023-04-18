import Users from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(401);
    }
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.sendStatus(403);
        }
        const uuid = user[0].uuid;
        const userId = user[0].id;
        const userName = user[0].userName;
        const name = user[0].name;
        const email = user[0].email;
        const foto = user[0].foto;
        const roleId = user[0].roleId;
        const gender = user[0].gender;

        const accessToken = jwt.sign(
          { uuid, userId, userName, name, email, foto, roleId, gender },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
