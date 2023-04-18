// Import multer
import multer from "multer";
import path from "path";

// Middleware upload image Post
const storagePost = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Images/post");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadPost = multer({
  storage: storagePost,
  limits: { fileSize: "10000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimType && extname) {
      return cb(null, true);
    }
    cb("Gunakan format file yang benar!");
  },
}).single("foto");
