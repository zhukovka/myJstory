import * as asyncFunctions from './asyncFunctions.js';
function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}
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
                await wait(500);
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
        this.el.style.background = '#090E1C';
        image.style.width = '10%';
        this.el.appendChild(image);
    }

    close () {
    }

    abort (err) {
        console.log("Sink error:", err);
    }

}
