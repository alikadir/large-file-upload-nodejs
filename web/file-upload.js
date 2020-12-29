function getElements() {
  return {
    inputFile: document.getElementsByName("my-file")[0],
    inputSubject: document.getElementsByName("subject")[0],
    codeOutput: document.getElementById("output"),
  };
}

function upload() {
  const elements = getElements();

  const file = elements.inputFile.files[0];
  const subject = elements.inputSubject.value;

  const formData = new FormData();
  formData.append("my-file", file);
  formData.append("subject", subject);

  fetch("/upload", { method: "POST", body: formData })
    .then(data => data.json())
    .then(data => {
      elements.codeOutput.innerText = JSON.stringify(data);
    })
    .catch(err => {
      elements.codeOutput.innerText = err;
    });
}

function uploadWithProgress() {
  const elements = getElements();

  const file = elements.inputFile.files[0];
  const subject = elements.inputSubject.value;

  const formData = new FormData();
  formData.append("my-file", file);
  formData.append("subject", subject);

  let request = new XMLHttpRequest();
  request.open("POST", "/upload");

  request.upload.addEventListener("progress", function (e) {
    elements.codeOutput.innerText = (e.loaded / e.total) * 100;
  });

  request.addEventListener("load", function (e) {
    elements.codeOutput.innerText = request.response;
  });

  request.send(formData);
}
