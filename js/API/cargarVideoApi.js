const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file); // <-- este nombre lo usás en tu backend

    try {
        const res = await fetch("https://back-slider.onrender.com/cargar", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log("Respuesta del servidor:", data);
    } catch (err) {
        console.error("Error al subir:", err);
    }
});