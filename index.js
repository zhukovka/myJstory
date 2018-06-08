let currentSlide = 0;

const slidesContainer = document.getElementById("slidesContainer");
const slides = slidesContainer.querySelectorAll(".slide");

function switchSlide (to) {
    slides[currentSlide].style.display = "none";
    currentSlide = to;
    slides[to].removeAttribute("style");
    slidesContainer.removeAttribute("style");
}

document.addEventListener("keydown", (e) => {
    if (e.target.nodeName === "INPUT") {
        return;
    }
    if (e.code === "ArrowRight") {
        let to = Math.min(currentSlide + 1, slides.length - 1);
        switchSlide(to);
    }
    if (e.code === "ArrowLeft") {
        let to = Math.max(currentSlide - 1, 0);
        switchSlide(to);
    }
    if (e.code === "ArrowUp") {
        switchSlide(currentSlide);
    }
    if (e.code === "Enter") {
        open(next.href, "_self");
    }
});