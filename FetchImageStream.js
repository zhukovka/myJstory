import * as asyncFunctions from './asyncFunctions.js';

export class FetchImageStream {
    constructor () {
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
                await asyncFunctions.asyncImage(`/space-font/${chunk}.webp`, chunk).then(onLoad);
            }
        });
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
