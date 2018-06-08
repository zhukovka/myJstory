const code2 = document.getElementById('code2');
const iteratorInput = document.getElementById('iteratorInput');
const generatorInput = document.getElementById('generatorInput');
const asyncIteratorInput = document.getElementById('asyncIteratorInput');
const asyncGeneratorInput = document.getElementById('asyncGeneratorInput');

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}

let asyncImage = async function (url) {
    const response = await fetch(url);
    const blob = await response.blob();
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    return img;
};

if (code2) {
    code2.addEventListener('click', async e => {
        const img = await asyncImage('../images/spaceman.webp');
        slide2.innerHTML = '';
        slide2.appendChild(img);
    });
}

let promiseImage = function (url) {
    return fetch(url)
        .then(r => r.blob())
        .then(b => {
            const img = new Image();
            img.src = URL.createObjectURL(b);
            return img;
        }).catch(e => console.log('no image'));
};

function iteratorFont (word) {
    const re = /[a-z]|[0-9]/u;
    let i = 0;
    return {
        next () {
            let char = word[i++];
            let c = char && re.test(char.toLowerCase()) ? char : '0';
            return {
                value: promiseImage(`../space-font/${c}.webp`),
                done: !char
            };
        },
        [Symbol.iterator] () {
            return this;
        }
    }
}

function asyncIteratorFont (word) {
    const re = /[a-z]/u;
    let i = 0;
    return {
        async next () {
            let char = word[i++];
            let c = char && re.test(char.toLowerCase()) ? char : '0';
            return {
                value: await asyncImage(`../space-font/${c}.webp`),
                done: !char
            };
        },
        [Symbol.asyncIterator] () {
            return this;
        }
    }
}

async function asyncIteratorChars (word, slide, iterable) {
    slide.innerHTML = '';
    slidesContainer.style.background = '#090E1C';
    let width = `calc(100vw / ${word.length})`;
    for await (const img of iterable) {
        img.style.width = width;
        slide.appendChild(img);
    }
}

function* generatorFont (word) {
    const re = /[a-z]/u;
    for (const char of word.toLowerCase()) {
        if (re.test(char)) {
            yield promiseImage(`../space-font/${char}.webp`);
        }
    }
}

async function* asyncGeneratorFont (word) {
    const re = /[a-z]/u;
    for (const char of word.toLowerCase()) {
        if (re.test(char)) {
            await wait(500);
            yield await asyncImage(`../space-font/${char}.webp`);
        }
    }
}

function iteratorChars (word, slide, iterable) {
    slide.innerHTML = '';
    slidesContainer.style.background = '#090E1C';
    let width = `calc(100vw / ${word.length})`;
    for (const image of iterable) {
        image.then(img => {
            img.style.width = width;
            slide.appendChild(img);
        });
    }
}

if (iteratorInput) {
    iteratorInput.addEventListener('keydown', (e) => {
        if (e.code === "Enter") {
            iteratorChars(e.target.value, slide3, iteratorFont(e.target.value));
        }
    });
}

if (asyncIteratorInput) {
    asyncIteratorInput.addEventListener('keydown', (e) => {
        if (e.code === "Enter") {
            let word = e.target.value;
            asyncIteratorChars(word, slide5, asyncIteratorFont(word));
        }
    });
}

if (generatorInput) {
    generatorInput.addEventListener('keydown', (e) => {
        if (e.code === "Enter") {
            let word = e.target.value;
            iteratorChars(word, slide4, generatorFont(word));
        }
    });
}
if (asyncGeneratorInput) {
    asyncGeneratorInput.addEventListener('keydown', (e) => {
        if (e.code === "Enter") {
            let word = e.target.value;
            asyncIteratorChars(word, slide6, asyncGeneratorFont(word));
        }
    });
}
