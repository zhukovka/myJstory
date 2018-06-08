class SpeechStream {

    constructor () {
        if (('webkitSpeechRecognition' in window)) {
            let lang = ['Pусский', ['ru-RU']];
            var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

            this.recognizing = false;
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;
            recognition.onstart = () => {
                this.recognizing = true;
            };
            recognition.onerror = function (event) {
                this.recognizing = false;
                console.error(event.error);
            };
            recognition.onend = () => {
                console.warn('recognition ended');
                this.recognizing = false;
            };
            recognition.lang = lang[1];
            this.recognition = recognition;
        } else {
            throw "SpeechRecognition is not supported";
        }
    }

    get stream () {
        const recognition = this.recognition;
        return new ReadableStream({
            start (controller) {
                controller.enqueue('kuku');
                recognition.onresult = function (event) {
                    const last = event.results.length - 1;
                    let result = event.results[last];
                    if (result.isFinal) {
                        const match = result[0].transcript;
                        controller.enqueue(match);
                    }
                };
            },
            pull (controller) {
                // We don't really need a pull in this example
            },
            cancel () {
                // This is called if the reader cancels,
                // so we should stop generating strings
                recognition.stop();
                console.warn("stream cancelled")
            }
        });
    }


    get words () {
        const reader = this.stream.getReader();
        return {
            next () {
                // Stream reads already resolve with {done, value}, so
                // we can just call read:
                return reader.read();
            },
            return () {
                // Release the lock if the iterator terminates.
                reader.releaseLock();
                return {};
            },
            // for-await calls this on whatever it's passed, so
            // iterators tend to return themselves.
            [Symbol.asyncIterator] () {
                return this;
            }
        }
    }

    start () {
        if (this.recognizing) {
            this.recognition.stop()
        } else {
            this.recognition.start();
        }
    }
}