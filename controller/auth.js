import { request } from "express";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Membuat fungsi login
export const login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });

    const match = await bcrypt.compare(req.body.password, user[0].password);
    //Jika password dan confirm password tidak cocok
    if (!match) {
      return res.status(400).json({ msg: "Email atau Password Salah!" });
    }
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;

    // set exp access token
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    // set exp refresh token
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    // update refresh token pada tabel user
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    // cookie untuk di bagia frontend
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    return res.status(404).json({ msg: "Email atau Password Salah!" });
  }
};

// Get User By Token
export const userLogin = async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);
    const users = await Users.findOne({
      attributes: [
        "uuid",
        "userName",
        "name",
        "email",
        "roleId",
        "foto",
        "gender",
      ],
      where: {
        email: email,
      },
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

// membuat fungsi logout
export const logout = async (req, res) => {
  const email = req.body.email;

  console.log(email);
  if (!email) {
    return res.status(204).json({ msg: "Email atau Password Salah!" });
  }
  // console.log(req.body);
  const user = await Users.findAll({
    where: {
      email: email,
    },
  });
  if (!user) {
    return res.status(404).json({ msg: "Email atau Password Salah!" });
  }

  await Users.update(
    {
      refresh_token: null,
    },
    {
      where: {
        email: email,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.status(200).json({ msg: "Logout Berhasil" });
  // req.cookies.destroy((err) => {
  //   if (err) {
  //     return res.status(400).json({ msg: "Logout Gagal" });
  //   }
  //   res.status(200).json({ msg: "Logout Berhasil" });
  // });
};
