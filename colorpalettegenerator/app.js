const paletteOne = document.getElementById("paletteOne");
const paletteTwo = document.getElementById("paletteTwo");
const paletteThree = document.getElementById("paletteThree");

const body = document.body;

let currentPaletteOne = "#0e839e";
let currentPaletteTwo = "#0afe33";
let currentPaletteThree = "#005023";

function updatePaletteColors() {
  paletteOne.style.backgroundColor = currentPaletteOne;
  paletteTwo.style.backgroundColor = currentPaletteTwo;
  paletteThree.style.backgroundColor = currentPaletteThree;

  // Update the text content
  paletteOne.children[0].textContent = currentPaletteOne;
  paletteTwo.children[0].textContent = currentPaletteTwo;
  paletteThree.children[0].textContent = currentPaletteThree;

  // Update the background color
  body.style.background = `linear-gradient(to right, ${currentPaletteOne}, ${currentPaletteTwo}, ${currentPaletteThree})`;
}

function generateRandomPalette() {
  const randomColorOne = `#${Math.floor(Math.random() * 16777215).toString(
    16
  )}`;
  const randomColorTwo = `#${Math.floor(Math.random() * 16777215).toString(
    16
  )}`;
  const randomColorThree = `#${Math.floor(Math.random() * 16777215).toString(
    16
  )}`;
  currentPaletteOne = randomColorOne;
  currentPaletteTwo = randomColorTwo;
  currentPaletteThree = randomColorThree;
  updatePaletteColors();
}

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    generateRandomPalette();
  }
});

updatePaletteColors();
