const apikey = 'NuhCtQDzGl';
const api = 'https://api.fgmods.xyz/api/';
const lol = 'https://api.lolhuman.xyz/api/';
const lolkey = 'GataDios'



function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}
function sendMessage() {
    var prompt = document.getElementById('prompt').value.trim();
    var chatContainer = document.getElementById('chat-container');

    console.log("Texto del usuario:", prompt);

    var userMessageElement = document.createElement('div');
    userMessageElement.classList.add('chat-message', 'user-message');
    userMessageElement.textContent = prompt;
    chatContainer.appendChild(userMessageElement);

    if (containsTikTokUrl(prompt)) {
        var tiktokUrl = extractTikTokUrl(prompt);
        showLoader();
        fetchTikTokData(tiktokUrl, chatContainer);
    } else if (containsFacebookUrl(prompt)) {
        var facebookUrl = extractFacebookUrl(prompt);
        showLoader();
        fetchFacebookData(facebookUrl, chatContainer);
    } else if (containsYouTubeUrl(prompt)) {
        console.log("URL de YouTube detectada:", extractYouTubeUrl(prompt));
        var youtubeUrl = extractYouTubeUrl(prompt);
        showLoader();
        fetchYouTubeData(youtubeUrl, chatContainer);
    } else {
        showLoader();
        fetchOpenAIData(prompt, chatContainer);
    }

    document.getElementById('prompt').value = '';
}

function containsTikTokUrl(text) {
    var tiktokRegex = /https:\/\/vm\.tiktok\.com\/[\w-]+\/?/gi;
    return tiktokRegex.test(text);
}

function extractTikTokUrl(text) {
    var tiktokRegex = /https:\/\/vm\.tiktok\.com\/[\w-]+\/?/gi;
    var matches = text.match(tiktokRegex);
    return matches[0];
}

function containsFacebookUrl(text) {
    var facebookRegex = /https:\/\/www\.facebook\.com\/share\/v\/[a-zA-Z0-9_-]+\/\?[^/]+/gi;
    return facebookRegex.test(text);
}

function extractFacebookUrl(text) {
    var facebookRegex = /https:\/\/www\.facebook\.com\/share\/v\/[a-zA-Z0-9_-]+\/\?[^/]+/gi;
    var matches = text.match(facebookRegex);
    return matches[0];
}

function containsYouTubeUrl(text) {
    var youtubeRegex = /https:\/\/youtu\.be\/[\w-]+/gi;
    var match = youtubeRegex.test(text);
    console.log("Texto:", text);
    console.log("Coincidencia:", match);
    return match;
}

function extractYouTubeUrl(text) {
    var youtubeRegex = /https:\/\/youtu\.be\/[\w-]+/gi;
    var matches = text.match(youtubeRegex);
    console.log("Texto:", text);
    console.log("Coincidencias:", matches);
    return matches ? matches[0] : null; // Devolver el primer match encontrado o null si no hay coincidencias
}

function fetchYouTubeData(url, chatContainer) {
   // fetch(`${lol}ytvideo2?url=${encodeURIComponent(url)}&apikey=${lolkey}`)
    fetch(`${api}downloader/ytmp4?url=${encodeURIComponent(url)}&apikey=${apikey}`)
        .then(response => response.json())
        .then(data => {
            hideLoader();
            console.log('Respuesta de la API de YouTube:', data);
            var videoElement = document.createElement('video');
            videoElement.classList.add('chat-message', 'bot-message');
            videoElement.src = data.result.dl_url;
            videoElement.autoplay = true;
            videoElement.controls = true;
            chatContainer.appendChild(videoElement);

            // Crear elemento de botón para descargar el video
            var downloadButton = document.createElement('button');
            downloadButton.textContent = 'Descargar video';
            downloadButton.classList.add('download-button');
            downloadButton.addEventListener('click', function() {
                downloadVideo(data.result); // Pasar el objeto de video como argumento
            });
            chatContainer.appendChild(downloadButton);

            chatContainer.scrollTop = chatContainer.scrollHeight;
        })
        .catch(error => {
            console.error('Error al obtener el video de YouTube:', error);
            hideLoader();
        });
}

function downloadVideo(video) {
    fetch(video.dl_url)
        .then(response => response.blob())
        .then(blob => {
            // Crear un objeto Blob con el contenido del video
            var url = URL.createObjectURL(blob);

            // Crear un enlace temporal para descargar el video
            var a = document.createElement('a');
            a.href = url;
            a.download = `${video.title}.mp4`; // Utilizar el título del video como nombre del archivo
            a.style.display = 'none'; // Ocultar el enlace
            document.body.appendChild(a); // Agregar el enlace al cuerpo del documento
            a.click(); // Simular un clic en el enlace para iniciar la descarga

            // Liberar recursos
            URL.revokeObjectURL(url);
            document.body.removeChild(a); // Eliminar el enlace del cuerpo del documento después de la descarga
        })
        .catch(error => {
            console.error('Error al descargar el video:', error);
        });
}

function fetchTikTokData(url, chatContainer) {
    fetch(`${api}downloader/tiktok?url=${encodeURIComponent(url)}&apikey=${apikey}`)
    .then(response => response.json())
    .then(data => {
        hideLoader();
        var videoElement = document.createElement('video');
        videoElement.classList.add('chat-message', 'bot-message');
        videoElement.src = data.result.play;
        videoElement.autoplay = true;
        videoElement.controls = true;
        chatContainer.appendChild(videoElement);

        var downloadButton = document.createElement('button');
        downloadButton.textContent = 'Descargar video';
        downloadButton.classList.add('download-button');
        downloadButton.addEventListener('click', function() {
            downloadVideott(data.result);
        });
        chatContainer.appendChild(downloadButton);

        chatContainer.scrollTop = chatContainer.scrollHeight;
    })
    .catch(error => {
        console.error('Error al obtener el video de TikTok:', error);
        hideLoader();
    });
}

function downloadVideott(video) {
    fetch(video.play)
    .then(response => response.blob())
    .then(blob => {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = `${video.title}.mp4`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    })
    .catch(error => {
        console.error('Error al descargar el video:', error);
    });
}

function fetchFacebookData(url, chatContainer) {
    fetch(`${api}downloader/fbdl?url=${encodeURIComponent(url)}&apikey=${apikey}`)
    .then(response => response.json())
    .then(data => {
        hideLoader();
        var videoElement = document.createElement('video');
        videoElement.classList.add('chat-message', 'bot-message');
        videoElement.src = data.result.videoUrl;
        videoElement.autoplay = true;
        videoElement.controls = true;
        chatContainer.appendChild(videoElement);

        var downloadButton = document.createElement('button');
        downloadButton.textContent = 'Descargar video';
        downloadButton.classList.add('download-button');
        downloadButton.addEventListener('click', function() {
            downloadVideo(data.result);
        });
        chatContainer.appendChild(downloadButton);

        chatContainer.scrollTop = chatContainer.scrollHeight;
    })
    .catch(error => {
        console.error('Error al obtener el video de Facebook:', error);
        hideLoader();
    });
}

function downloadVideo(video) {
    fetch(video.videoUrl)
    .then(response => response.blob())
    .then(blob => {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = `${video.title}.mp4`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    })
    .catch(error => {
        console.error('Error al descargar el video:', error);
    });
}

function fetchOpenAIData(text, chatContainer) {
    fetch(`${api}info/openai?prompt=none&text=${encodeURIComponent(text)}&apikey=${apikey}`)
    .then(response => response.json())
    .then(data => {
        hideLoader();
        var botMessageElement = document.createElement('div');
        botMessageElement.classList.add('chat-message', 'bot-message');
        botMessageElement.textContent = data.result;
        chatContainer.appendChild(botMessageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    })
    .catch(error => {
        console.error('Error al enviar mensaje:', error);
        hideLoader();
    });
}

function mostrarMarquee() {
    var marquee = document.getElementById('marquee');
    marquee.style.display = 'inline';
    setTimeout(function() {
        marquee.style.display = 'none';
    }, 10000);
}

setTimeout(mostrarMarquee, 5000);