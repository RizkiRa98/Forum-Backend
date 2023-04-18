// Import models
import Like from "../models/likeModel.js";

export const createLike = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    const like = await Like.findOne({ where: { postId, userId } });

    if (like) {
      await like.destroy();
      res.status(200).json({ msg: "Berhasil Melepaskan Like" });
    } else {
      await Like.create({ postId, userId });
      res.status(201).json({ msg: "Berhasil Melakukan Like" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
