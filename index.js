import formidable from "formidable";
import { rename } from "fs";
import { join } from "path";
import express from "express";
import { readUploadedFiles, writeFileUpload } from "./db.js";
import { logWrite } from "./log-module.js";

const app = express();

app.use(express.static("web"));

app.get("/", (req, res) => {
  res.end("Hello World");
});

app.get("/files", (req, res) => {
  readUploadedFiles()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.send("hata");
    });
});

app.post("/upload", (req, res, next) => {
  const form = formidable({
    multiples: true,
    maxFileSize: 10 * 1024 * 1024 * 1024, // 10GB
  });

  form.parse(req, (err, fields, files) => {
    if (err) next(err);
    else {
      writeFileUpload({
        fields,
        files: { name: files["my-file"].name, path: files["my-file"].path },
      });

      res.json({ fields, files });

      rename(
        files["my-file"].path,
        join(process.cwd(), "uploaded", files["my-file"].name),
        renameErr => {
          if (renameErr) console.error(renameErr);
          else logWrite("uploaded");
        }
      );
    }
  });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logWrite(`Server running at http://localhost:${port}`);
  logWrite(JSON.stringify(process.env));
});
