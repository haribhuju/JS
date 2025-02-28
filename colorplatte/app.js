const redSlider = document.getElementById("red");
const greenSlider = document.getElementById("green");
const blueSlider = document.getElementById("blue");

const redValue = document.getElementById("redValue");
const greenValue = document.getElementById("greenValue");
const blueValue = document.getElementById("blueValue");

const colorPreview = document.getElementById("colorPreview");
const hexValue = document.getElementById("hexValue");

let currentRed = 50;
let currentGreen = 100;
let currentBlue = 150;

function updateColorPreview() {
  const hexColor = rgbToHex(currentRed, currentGreen, currentBlue);
  colorPreview.style.backgroundColor = hexColor;
  hexValue.textContent = hexColor;
}

function numberValueToHex(n) {
  const hex = n.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + numberValueToHex(r) + numberValueToHex(g) + numberValueToHex(b);
}

redSlider.addEventListener("input", () => {
  currentRed = parseInt(redSlider.value);
  redValue.textContent = currentRed;
  updateColorPreview();
});

greenSlider.addEventListener("input", () => {
  currentGreen = parseInt(greenSlider.value);
  greenValue.textContent = currentGreen;
  updateColorPreview();
});

blueSlider.addEventListener("input", () => {
  currentBlue = parseInt(blueSlider.value);
  blueValue.textContent = currentBlue;
  updateColorPreview();
});

updateColorPreview();
