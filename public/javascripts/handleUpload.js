const fileInput = document.getElementById("file");
const fileList = document.getElementById("file-list");

fileInput.addEventListener("change", () => {
  fileList.innerHTML = "";

  Array.from(fileInput.files).forEach((file) => {
    const li = document.createElement("li");
    li.textContent = file.name;
    fileList.appendChild(li);
  });
});
