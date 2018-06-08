// create empty string in which to store result
let result = "";
let interval;

// function to generate random character string
function randomChars () {
    let string = "";
    let choices = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

    for (let i = 0; i < 8; i++) {
        string += choices.charAt(Math.floor(Math.random() * choices.length));
    }
    return string;
}

//
// button.addEventListener('click', function() {
//     clearInterval(interval);
//     controller.close();
// })
// readStream();

function readStream () {
    const reader = stream.getReader();
    let charsReceived = 0;

    // read() returns a promise that resolves
    // when a value has been received
    reader.read().then(function processText ({done, value}) {
        // Result objects contain two properties:
        // done  - true if the stream has already given you all its data.
        // value - some data. Always undefined when done is true.
        if (done) {
            console.log("Stream complete");

            return;
        }

        charsReceived += value.length;
        const chunk = value;
        console.log(chunk);

        // Read some more, and call this function again
        return reader.read();
    });
    setTimeout(() => {
        reader.releaseLock();
        stream.cancel();
    }, 15000);

}

function streamAsyncIterator (stream) {
    // Get a lock on the stream:
    const reader = stream.getReader();

    return {
        next () {
            // Stream reads already resolve with {done, value}, so
            // we can just call read:
            return reader.read();
        },
        return () {
            // Release the lock if the iterator terminates.
            reader.releaseLock();
            stream.cancel();
            return {};
        },
        // for-await calls this on whatever it's passed, so
        // iterators tend to return themselves.
        [Symbol.asyncIterator] () {
            return this;
        }
    };
}

async function f () {
    let i = 0;
    const stream = new ReadableStream({
        start (controller) {
            interval = setInterval(() => {
                let string = randomChars();

                // Add the string to the stream
                controller.enqueue(string);
                // console.log(string)
            }, 1000);
        },
        pull (controller) {
            // We don't really need a pull in this example
        },
        cancel () {
            // This is called if the reader cancels,
            // so we should stop generating strings
            clearInterval(interval);
            console.warn("stream cancelled")
        }
    });
    for await (const w of streamAsyncIterator(stream)) {
        console.log('iterator', w);
        if (i > 10) {
            return;
        }
        i++;
    }
}

// f();
