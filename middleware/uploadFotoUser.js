// Import multer
import multer from "multer";
import path from "path";

// Middleware upload image Post
const storageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/Images/user");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadUser = multer({
  storage: storageUser,
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
