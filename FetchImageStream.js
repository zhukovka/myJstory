import * as asyncFunctions from './asyncFunctions.js';

function wait (ms) {
    return new Promise(r => setTimeout(r, ms));
}

const queuingStrategy = new CountQueuingStrategy({highWaterMark: 1});

export class FetchImageStream {
    constructor (folder) {
        let onLoad;
        this.readable = new ReadableStream({
            start (controller) {
                onLoad = (img) => {
                    controller.enqueue(img);
                }
            }
        });
        this.writable = new WritableStream({
            async write (chunk) {
                console.log('fetch', chunk);
                await wait(500);
                await asyncFunctions.asyncImage(`${folder}/${chunk}.webp`, chunk).then(onLoad);
            }
        }, queuingStrategy);
    }

}

export class ImageDestination {
    constructor (el) {
        this.el = el;
    }

    write (image) {

        image.style.width = '10%';
        this.el.appendChild(image);
    }

    close () {
    }

    abort (err) {
        console.log("Sink error:", err);
    }

}
