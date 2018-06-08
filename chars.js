const word = 'stream';
const slide = document.getElementById("slide");
var controller = new AbortController();
var signal = controller.signal;

async function* charsGen (text) {
    // Get a lock on the stream
    const re = /[a-z]/u;
    for (const char of text.toLowerCase()) {
        if (re.test(char)) {
            yield await fetch(`font/${char}.jpg`, {signal})
                .then(r => r.blob())
                .then(blob => {
                    const image = new Image();
                    image.src = URL.createObjectURL(blob);
                    return image;
                });
        }
    }
}

async function imageRender (image, style) {
    image.style.position = 'absolute';
    image.style.left = '100%';
    let width = slide.clientWidth;
    let start;
    let id;
    let time = 5000 * (1 - style.left / width);
    console.log(time);

    return new Promise((resolve, reject) => {
        signal.onabort = (e) => {
            cancelAnimationFrame(id);
            reject(e);
        };

        function step (timestamp) {
            start = start || timestamp;
            let progress = (timestamp - start) / time;
            image.style.left = `${width - progress * (width - style.left)}px`;
            if (progress >= 1) {
                // cancelAnimationFrame(id);
                resolve(image);
                return;
            }
            id = requestAnimationFrame(step);
        }

        slide.appendChild(image);
        step();
    });
}

async function fetchFont () {
    const style = {
        left: 0,
        width: `${100 / word.length}%`
    };

    for await (const char of charsGen(word)) {
        console.time('image');
        char.style.width = style.width;
        await imageRender(char, style);
        style.left = char.getBoundingClientRect().right;
        console.timeEnd('image');
    }
}

fetchFont();