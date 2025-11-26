async function cargarVideos() {
    const res = await fetch("https://back-slider.onrender.com/traer");
    const videos = await res.json();

    const container = document.getElementById("videos-container");
    container.innerHTML = "";

    videos.forEach((video) => {
        const card = document.createElement("div");
        card.className = "video-card";

        card.innerHTML = `
            <video width="240" height="240" controls>
                <source src="${video.url}" type="video/mp4">
            </video>

            <div class="actions">
                <button class="btn-delete" data-id="${video._id}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>

                <select class="slide-number" data-id="${video.id}">
                    <option value="1">Posicion 1</option>
                    <option value="2">Posicion 2</option>
                    <option value="3">Posicion 3</option>
                    <option value="4">Posicion 4</option>
                </select>
            </div>
        `;

        container.appendChild(card);
    });

    agregarEventosDelete();
}

function agregarEventosDelete() {
    const botones = document.querySelectorAll(".btn-delete");

    botones.forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            console.log("Borrar video con ID:", id);
            const confirmar = confirm("¿Seguro que deseas eliminar este video?");
            if (!confirmar) return;

            try {
                const res = await fetch(`https://back-slider.onrender.com/borrar/${id}`, {
                    method: "DELETE"
                });

                const data = await res.json();
                console.log("Respuesta:", data);

                // refrescar lista
                cargarVideos();

            } catch (error) {
                console.error("Error eliminando:", error);
                alert("❌ No se pudo borrar el video");
            }
        });
    });
}

cargarVideos();