import express from "express";
import formidable from "formidable";
import { rename } from "fs";
import { join } from "path";

const app = express();

app.use(express.static("web"));

app.get("/", (req, res) => {
  res.end("Hello World");
});

app.post("/upload", (req, res, next) => {
  const form = formidable({
    multiples: true,
    maxFileSize: 10 * 1024 * 1024 * 1024, // 10GB
  });
  form.parse(req, (err, fields, files) => {
    if (err) next(err);
    else {
      res.json({ fields, files });

      rename(
        files["my-file"].path,
        join(process.cwd(), "uploaded", files["my-file"].name),
        renameErr => {
          if (renameErr) console.error(renameErr);
          else console.log("uploaded.");
        }
      );
    }
  });
});

app.listen(1453, () => {
  console.log("Server running at http://localhost:1453");
});
