let lang = ['Pусский', ['ru-RU']];
let recognizing = false;
if (('webkitSpeechRecognition' in window)) {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = function () {
        recognizing = true;
    };
    recognition.onerror = function (event) {
        console.error(event.error);
        // if (event.error == 'no-speech') {
        //     ignore_onend = true;
        // }
        // if (event.error == 'audio-capture') {
        //     ignore_onend = true;
        // }
        // if (event.error == 'not-allowed') {
        //     if (event.timeStamp - start_timestamp < 100) {
        //     } else {
        //     }
        //     ignore_onend = true;
        // }
    };
    recognition.onend = function () {
        console.warn('end');
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        if (!final_transcript) {
            return;
        }
    };
    recognition.onresult = function (event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
                // console.log('final', i, event.results[i][0]);
            } else {
                // interim_transcript += event.results[i][0].transcript;
                // console.log('👉interim', i, event.results[i][0]);
            }
        }
    };
}
let final_transcript = '';
let ignore_onend = false;
let start_timestamp = 0;

function startButton (event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = lang[1];
    recognition.start();
    ignore_onend = false;
    start_timestamp = Date.now();
}