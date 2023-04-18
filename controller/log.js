import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

// dapatkan direktori dari file saat ini
const __dirname = dirname(fileURLToPath(import.meta.url));

export const getLogger = (req, res) => {
  try {
    const logPath = path.join(__dirname, "../logs/log/access.log");
    const logs = fs.readFileSync(logPath, "utf-8");
    const logsData = logs.split(`\n`);
    const currentPage = req.query.page || 1;
    const dataPerPage = 10; //limit data per page
    const startIndex = (currentPage - 1) * dataPerPage;
    const endIndex = startIndex + dataPerPage;
    const result = logsData
      .map((d) => {
        if (d) {
          const logObj = JSON.parse(d);
          return logObj;
        } else {
          return {};
        }
      })
      .filter((d) => Object.keys(d).length !== 0)
      .reverse() // reverse data array dari yang terbaru
      .slice(startIndex, endIndex); //Urutkan logs berdasarkan pembuatan data terbaru

    res.json({
      logs: result,
      currentPage,
      totalPage: Math.ceil(logsData.length / dataPerPage),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
