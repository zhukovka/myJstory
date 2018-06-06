// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function () {
//         navigator.serviceWorker.register('/sw.js').then(function (registration) {
//             // Registration was successful
//             console.log('ServiceWorker registration successful with scope: ', registration.scope);
//         }, function (err) {
//             // registration failed :(
//             console.log('ServiceWorker registration failed: ', err);
//         });
//     });
// }

async function* streamAsyncIterator (stream) {
    // Get a lock on the stream
    const reader = stream.getReader();

    try {
        while (true) {
            // Read from the stream
            const {done, value} = await reader.read();
            // Exit if we're done
            if (done) return;
            // Else yield the chunk
            yield value;
        }
    }
    finally {
        reader.releaseLock();
    }
}

async function example (url) {
    const response = await fetch(url);

    for await (const chunk of streamAsyncIterator(response.body)) {
        // …
        console.log(chunk, 'chunk');
    }
}

// example("image.jpg");
const url = 'https://www.random.org/decimal-fractions/?num=1&dec=10&col=1&format=plain&rnd=new';

async function* seqGen () {
    // Get a lock on the stream
    let words = ['a', 'b', 'c', 'd'];
    let i = 0;
    console.log('before');
    while (i < words.length) {
        // Else yield the chunk
        // console.log(value);
        console.time('await' + i);
        yield await new Promise(resolve => {
            setTimeout(() => resolve(words[i]), 1000)
        });
        console.timeEnd('await' + i);
        i++;
    }
}

// wait ms milliseconds
function wait (ms) {
    return new Promise(r => setTimeout(r, ms));
}

function sendWord (word) {
    return new Promise(resolve => {
        const time = Math.random() * 1000 | 0;
        setTimeout(() => resolve(time + ' sent: ' + word), time)
    })
}

async function logInOrder () {
    // fetch all the URLs in parallel
    // const urls = [2000, 1500, 5000, 300, 1200];
    //
    // const jsonPromises = urls.map(async x => {
    //     // const time = Math.random() * 5000;
    //     return new Promise(resolve => {
    //         setTimeout(() => resolve(x), x)
    //     });
    // });

    // log them in sequence
    for await(const textPromise of seqGen()) {
        console.log('word', textPromise);
        // sendWord(textPromise).then(t=>{
        //     console.log(t);
        // });
    }
    console.log('after loop');
}

// logInOrder();
console.log('after log');

// function clickGen () {
//     const gen = seqGen();
//     return async function (e) {
//         const w = await gen.next();
//         console.log('click', w);
//     }
// }



// function p () {
//     return fetch("words.txt");
// }
//
// p();



