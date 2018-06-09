const translit = {
    'а': "a",
    'б': "b",
    'в': "v",
    'г': "g",
    'д': "d",
    'е': "e",
    'ё': "e",
    'ж': "zh",
    'з': "z",
    'и': "i",
    'й': "j",
    'к': "k",
    'л': "l",
    'м': "m",
    'н': "n",
    'о': "o",
    'п': "p",
    'р': "r",
    'с': "s",
    'т': "t",
    'у': "u",
    'ф': "f",
    'х': "h",
    'ц': "ts",
    'ч': "ch",
    'ш': "sh",
    'щ': "shch",
    'ы': "y",
    'ь': "1",
    'э': "e",
    'ю': "yu",
    'я': "ya",
};

class Translitter {
    // onDone = null;

    translit (char) {
        const en = translit[char] || '0';
        for (const symbol of en) {
            this.onDone(symbol)
        }
    }

}

class TranslitWrite {
    constructor (translitter) {
        this.translitter = translitter;
    }

    write (chunk) {
        console.log('write', chunk);
        const re = /[а-яё]/u;

        for (const char of chunk.toLowerCase()) {
            if (re.test(char)) {
                this.translitter.translit(char);
            }
        }
    }
}

class TranslitRead {
    constructor (translitter) {
        this.translitter = translitter;
    }

    start (controller) {
        this.translitter.onDone = (en) => {
            controller.enqueue(en);
        };
    }
}