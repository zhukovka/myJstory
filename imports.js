document.addEventListener('keydown', async (event) => {
    try {
        const module = await fetch('slide.html').then(r => r.text());
        // The module exports a function named
        document.getElementById("slide").innerHTML = module;
        console.log(module);
    } catch (error) {
        console.log(error);
    }
});