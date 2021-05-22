import formidable from "formidable";
import { rename } from "fs";
import { join } from "path";
import express from "express";
import { selectDbUploadedFiles, insertDbFileInfo } from "./lib/dbService.js";
import { logWrite } from "./lib/logService.js";
import { fileUpload } from "./lib/s3FileUploaderService.js";
await import("dotenv-flow/config.js");

const app = express();

app.use(express.static("browser"));


app.get("/files", (req, res) => {
  selectDbUploadedFiles()
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

  form.parse(req, async (err, fields, files) => {
    if (err) next(err);
    else {
     await insertDbFileInfo({
        fields,
        files: { name: files["my-file"].name, path: files["my-file"].path },
      });

      res.json({ fields, files });
      fileUpload(files["my-file"].path, files["my-file"].name);
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


app.listen(process.env.PORT, () => {
  logWrite(`Server running at http://localhost:${process.env.PORT}`);
  logWrite(JSON.stringify(process.env,null,4));
});
