export let asyncImage = async function (url, alt) {
    const response = await fetch(url);
    const blob = await response.blob();
    const img = new Image();
    img.alt = alt;
    img.src = URL.createObjectURL(blob);
    return img;
};

