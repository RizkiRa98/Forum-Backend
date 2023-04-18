import { fileURLToPath } from "url";
import { dirname, join } from "path";
import morgan from "morgan";
import dayjs from "dayjs";
import rfs from "rotating-file-stream";
import { gzip } from "zlib";

// dapatkan direktori dari file saat ini
const __dirname = dirname(fileURLToPath(import.meta.url));

// Buat write stream ke dalam file log/access.log
const accessLogStream = rfs.createStream("./access.log", {
  interval: "1d", //rotate interval setiap 1 hari
  path: join(__dirname, "log"),
  size: "1M", //batasi ukuran file sampai 1MB
  compress: gzip,
  initialRotation: true, //membuat file log pertama dengan bentuk array kosong
});

// Set Up Middleware
const logger = morgan(
  (tokens, req, res) => {
    // Jika method adalah GET maka skip
    if (req.method === "GET" && req.url !== "/login") {
      return null;
    }
    const log = {
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res) || res.statusCode,
      timestamp: dayjs().format("YY/MM/DD HH:mm:ss"),
      user: req.userName,
    };
    // mengembalikan log sebagai string
    return JSON.stringify(log);
  },
  {
    stream: accessLogStream,
    format: "json",
    immediate: true,
  }
);

// middleware untuk mengambil seluruh logs sebagai JSON

export default logger;
