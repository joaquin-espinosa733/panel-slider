const fileInput = document.getElementById("fileInput");
const progressContainer = document.getElementById("upload-progress");
const progressBar = document.getElementById("upload-bar");

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;

  progressContainer.style.display = "block";
  progressBar.style.width = "0%";
  progressBar.style.background = "#4caf50";

  try {
    // 1️⃣ pedir permiso
    const res = await fetch("https://back-slider.onrender.com/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        title: file.name,
        slider: 1,
      }),
    });

    const { uploadUrl, publicUrl, key, title, slider } = await res.json();

    // 2️⃣ subir a R2
    await uploadToR2(uploadUrl, file);

    // 3️⃣ confirmar
    await fetch("https://back-slider.onrender.com/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        url: publicUrl,
        key,
        slider,
      }),
    });

    progressBar.style.width = "100%";

    setTimeout(() => {
      progressContainer.style.display = "none";
      fileInput.value = "";
      if (typeof cargarVideos === "function") cargarVideos();
    }, 800);

  } catch (err) {
    console.error(err);
    progressBar.style.background = "#c0392b";
  }
});

/* 🧱 FUNCIÓN AUXILIAR – VA AFUERA */
function uploadToR2(uploadUrl, file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const porc = (e.loaded / e.total) * 100;
        progressBar.style.width = `${porc}%`;
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) resolve();
      else reject("Error subiendo a R2");
    };

    xhr.onerror = () => reject("Error de red");

    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}
