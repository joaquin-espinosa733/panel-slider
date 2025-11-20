async function cargarVideos() {
    const res = await fetch("https://novedades-three.vercel.app/traer/");
    const videos = await res.json();

    const container = document.getElementById("videos-container");
    container.innerHTML = ""; // limpia por si recargas

    videos.forEach((video) => {
        const vid = document.createElement("video");
        vid.width = 240;
        vid.height = 240;
        vid.controls = true;

        const source = document.createElement("source");
        source.src = video.url;
        source.type = "video/mp4";

        vid.appendChild(source);
        container.appendChild(vid);
    });
}

cargarVideos();