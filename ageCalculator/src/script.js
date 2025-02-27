// Frequency data from the numbers you provided
const regularNumberFrequencies = {
  1: 67,
  2: 77,
  3: 80,
  4: 70,
  5: 68,
  6: 75,
  7: 82,
  8: 67,
  9: 86,
  10: 75,
  11: 80,
  12: 74,
  13: 64,
  14: 72,
  15: 60,
  16: 75,
  17: 84,
  18: 75,
  19: 74,
  20: 78,
  21: 67,
  22: 70,
  23: 76,
  24: 68,
  25: 72,
  26: 63,
  27: 69,
  28: 71,
  29: 64,
  30: 73,
  31: 64,
  32: 73,
  33: 60,
  34: 65,
  35: 68,
};

const powerballFrequencies = {
  1: 13,
  2: 28,
  3: 21,
  4: 26,
  5: 12,
  6: 23,
  7: 20,
  8: 12,
  9: 19,
  10: 20,
  11: 20,
  12: 10,
  13: 16,
  14: 10,
  15: 21,
  16: 13,
  17: 15,
  18: 18,
  19: 23,
  20: 18,
};

// Function to generate a weighted random number based on frequencies
function getRandomWeighted(frequencies) {
  let totalWeight = Object.values(frequencies).reduce(
    (sum, freq) => sum + freq,
    0
  );
  let random = Math.floor(Math.random() * totalWeight);
  let currentWeight = 0;
  for (let number in frequencies) {
    currentWeight += frequencies[number];
    if (random < currentWeight) {
      return parseInt(number);
    }
  }
}

// Function to generate 10 sets of guesses based on frequency data
function generateFrequencyBasedGuesses() {
  let guesses = [];
  for (let i = 0; i < 10; i++) {
    let regularNumbers = [];
    while (regularNumbers.length < 6) {
      let num = getRandomWeighted(regularNumberFrequencies);
      if (!regularNumbers.includes(num)) {
        regularNumbers.push(num);
      }
    }
    let powerball = getRandomWeighted(powerballFrequencies);
    guesses.push({
      regularNumbers: regularNumbers.sort((a, b) => a - b),
      powerball,
    });
  }
  return guesses;
}

// Function to generate random winning numbers (5 regular + 1 Powerball)
function generateWinningNumbers() {
  let regularNumbers = [];
  while (regularNumbers.length < 5) {
    let num = Math.floor(Math.random() * 69) + 1;
    if (!regularNumbers.includes(num)) {
      regularNumbers.push(num);
    }
  }
  let powerball = Math.floor(Math.random() * 26) + 1;

  regularNumbers.sort((a, b) => a - b);

  return { regularNumbers, powerball };
}

// Function to compare guesses with winning numbers
function compareGuesses(guesses, winningNumbers) {
  let matchResults = guesses.map((guess) => {
    let matchedRegularNumbers = guess.regularNumbers.filter((num) =>
      winningNumbers.regularNumbers.includes(num)
    );
    let matchedPowerball = guess.powerball === winningNumbers.powerball;
    return {
      matchedRegularNumbers: matchedRegularNumbers,
      matchedPowerball: matchedPowerball,
    };
  });

  return matchResults;
}

// Function to display results
function displayResults(matchResults) {
  let resultDiv = document.getElementById("results");
  resultDiv.innerHTML = "<h2>Results:</h2>";
  matchResults.forEach((result, index) => {
    let resultText = `Set ${
      index + 1
    }: Regular Numbers Matched: [${result.matchedRegularNumbers.join(", ")}] 
                        ${
                          result.matchedPowerball
                            ? "Powerball Matched!"
                            : "Powerball Not Matched"
                        }`;
    let p = document.createElement("p");
    p.textContent = resultText;
    resultDiv.appendChild(p);
  });
}

// Function to handle the logic and compare guesses
function generateAndCheck() {
  // Generate the winning numbers
  let winningNumbers = generateWinningNumbers();
  console.log(
    "Winning Numbers: ",
    winningNumbers.regularNumbers,
    "Powerball: ",
    winningNumbers.powerball
  );

  // Generate 10 random guesses based on frequency
  let guesses = generateFrequencyBasedGuesses();
  console.log("Guesses: ", guesses);

  // Compare guesses with winning numbers
  let matchResults = compareGuesses(guesses, winningNumbers);

  // Display results
  displayResults(matchResults);
}
