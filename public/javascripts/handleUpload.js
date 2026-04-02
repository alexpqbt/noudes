const fileInput = document.getElementById("file");
const fileList = document.getElementById("file-list");
const form = document.querySelector("form");
const submitBtn = document.querySelector("button[type='submit']");

let dt = new DataTransfer();

fileInput.addEventListener("change", () => {
  for (let file of fileInput.files) {
    dt.items.add(file);
  }

  fileInput.files = dt.files;

  renderList();
});

function renderList() {
  fileList.innerHTML = "";

  Array.from(dt.files).forEach((file, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${file.name} 
      <button type="button" class="remove-btn" onclick="removeFile(${index})">Remove</button>
    `;
    fileList.appendChild(li);
  });
}

window.removeFile = (index) => {
  const newDt = new DataTransfer();

  for (let i = 0; i < dt.files.length; i++) {
    if (i !== index) {
      newDt.items.add(dt.files[i]);
    }
  }

  dt = newDt;
  fileInput.files = dt.files;

  renderList();
};

form.addEventListener("submit", () => {
  if (dt.files.length === 0) {
    e.preventDefault();
    return;
  }

  submitBtn.ariaDisabled = true;
  submitBtn.textContent = "Uploading...";
})