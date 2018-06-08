const speech = new SpeechStream();

document.addEventListener('keydown', (e) => {
    console.log(e);
    switch (e.code) {
        case "Space":
            speech.start();
            break;
        case "Escape":
            speech.stream.cancel();
            break;
    }
});

import('./FetchImageStream.js')
    .then((module) => {
        const queuingStrategy = new CountQueuingStrategy({highWaterMark: 1});
        const translitter = new Translitter();
        speech.stream
            .pipeThrough({
                writable: new WritableStream(new TranslitWrite(translitter)),
                readable: new ReadableStream(new TranslitRead(translitter))
            })
            .pipeThrough(new module.FetchImageStream())
            .pipeTo(new WritableStream(new module.ImageDestination(slide0)));
    });