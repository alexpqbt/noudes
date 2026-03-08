const files = document.getElementById("files");

files.addEventListener("click", (e) => {
  if (e.target && e.target.nodeName === "BUTTON") {
    const downloadBtn = e.target;
    const filename = downloadBtn.dataset.file;
    window.location.href = `${window.location.href}/${filename}/download`;
  }
});
