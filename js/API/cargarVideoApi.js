const fileInput = document.getElementById("fileInput");
const progressContainer = document.getElementById("upload-progress");
const progressBar = document.getElementById("upload-bar");

fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    // mostrar barra
    progressContainer.style.display = "block";
    progressBar.style.width = "0%";
    progressBar.style.background = "#4caf50";

    try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://back-slider.onrender.com/cargar");

        // 📌 progreso en tiempo real
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const porc = (event.loaded / event.total) * 100;
                progressBar.style.width = `${porc}%`;
            }
        };

        // 📌 cuando termina
        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log("Video subido:", xhr.responseText);

                // animación de éxito
                progressBar.style.background = "#4caf50";

                setTimeout(() => {
                    progressContainer.style.display = "none";
                }, 800);

                // ⭐️ LO IMPORTANTE: refrescar la lista
                // ⭐ Llamar a cargarVideos si existe globalmente
                if (typeof cargarVideos === "function") {
                    setTimeout(() => cargarVideos(), 300);
                }



                // limpiar input para poder cargar otro
                fileInput.value = "";
            } else {
                console.error("Error:", xhr.responseText);
                progressBar.style.background = "#c0392b";
            }
        };

        xhr.onerror = () => {
            console.error("Error al subir el archivo");
            progressBar.style.background = "#c0392b";
        };

        xhr.send(formData);

    } catch (err) {
        console.error("Error al subir:", err);
        progressBar.style.background = "#c0392b";
    }
});
