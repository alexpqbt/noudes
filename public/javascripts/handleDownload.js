const downloadBtn = document.getElementById("download-btn");

downloadBtn.addEventListener("click", async (e) => {
  const downloadURL = `${window.location.href}/download`;
  window.location.href = downloadURL;
});
