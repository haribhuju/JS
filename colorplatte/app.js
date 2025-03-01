//declare the variables
const redSlider = document.getElementById("red");
const greenSlider = document.getElementById("green");
const blueSlider = document.getElementById("blue");

const redValue = document.getElementById("redValue");
const greenValue = document.getElementById("greenValue");
const blueValue = document.getElementById("blueValue");

const colorPreview = document.getElementById("colorPreview");
const hexValue = document.getElementById("hexValue");

const paletteName = document.getElementById("paletteName");
const saveButton = document.getElementById("saveButton");
const savedPalettes = document.getElementById("savedPalettes");

let currentRed = 50;
let currentGreen = 100;
let currentBlue = 150;

//core functions

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

//event listeners

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

saveButton.addEventListener("click", () => {
  const name =
    paletteName.value.trim() || `Color #${getSavedPalettes().length + 1}`;
  const color = {
    name: name,
    red: currentRed,
    green: currentGreen,
    blue: currentBlue,
    hex: rgbToHex(currentRed, currentGreen, currentBlue),
    timestamp: Date.now(),
  };
  savePalette(color);
  paletteName.value = "";
  renderSavedPalettes();
});

//local storage

//get
function getSavedPalettes() {
  const paletteJSON = localStorage.getItem("colorPalettes");
  return paletteJSON ? JSON.parse(paletteJSON) : [];
}

//save
function savePalette(colorObj) {
  const palettes = getSavedPalettes();
  palettes.push(colorObj);
  localStorage.setItem("colorPalettes", JSON.stringify(palettes));
}

//delete
function deletePalette(timestamp) {
  const palettes = getSavedPalettes();
  const updatedPalettes = palettes.filter((p) => p.timestamp !== timestamp);
  localStorage.setItem("colorPalettes", JSON.stringify(updatedPalettes));
  renderSavedPalettes();
}

//edit

//render
function renderSavedPalettes() {
  const palettes = getSavedPalettes();
  if (palettes.length === 0) {
    savedPalettes.innerHTML =
      '<p class="empty-message">No palettes saved yet. Use the sliders to create and save colors!</p>';
    return;
  }

  savedPalettes.innerHTML = " ";

  //have to create the palette to show in the webpages

  palettes.forEach((palette) => {
    const paletteItem = document.createElement("div");
    paletteItem.className = "palette-item";

    const paletteColor = document.createElement("div");
    paletteColor.className = "palette-color";
    paletteColor.style.backgroundColor = palette.hex;

    const colorValue = document.createElement("div");
    colorValue.className = "color-value";
    colorValue.textContent = palette.hex;

    const paletteFooter = document.createElement("div");
    paletteFooter.className = "palette-footer";

    const paletteName = document.createElement("div");
    paletteName.className = "palette-name";
    paletteName.textContent = palette.name;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = " Delete";

    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      deletePalette(palette.timestamp);
    });

    paletteItem.appendChild(paletteColor);
    paletteItem.appendChild(paletteFooter);

    paletteColor.appendChild(colorValue);

    paletteFooter.appendChild(paletteName);
    paletteFooter.appendChild(deleteButton);

    paletteItem.addEventListener("click", () => {
      currentRed = palette.red;
      currentGreen = palette.green;
      currentBlue = palette.blue;

      redSlider.value = currentRed;
      greenSlider.value = currentGreen;
      blueSlider.value = currentBlue;

      updateColorPreview();
    });

    savedPalettes.appendChild(paletteItem);
  });
}

//call the function
updateColorPreview();
renderSavedPalettes();
