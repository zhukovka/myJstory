const speech = new SpeechStream();

document.addEventListener('keydown', (e) => {
    console.log(e);
    switch (e.code) {
        case "Space":
            slide0.innerHTML = '';
            slidesContainer.style.background = '#090E1C';
            speech.start();
            break;
        case "Escape":
            speech.stream.cancel();
            break;
    }
});

import('./FetchImageStream.js')
    .then((module) => {
        const translitter = new Translitter();
        // const folder = `/myJstory/font`;
        const folder = `/font`;
        speech.stream
            .pipeThrough({
                writable: new WritableStream(new TranslitWrite(translitter)),
                readable: new ReadableStream(new TranslitRead(translitter))
            })
            .pipeThrough(new module.FetchImageStream(`${location.origin}${folder}`))
            .pipeTo(new WritableStream(new module.ImageDestination(slide0)));
    });