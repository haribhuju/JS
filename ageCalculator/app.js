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

// Function to generate random weighted winner numbers
function generateWinner() {
  const numbers = [];
  while (numbers.length < 7) {
    // Changed from 5 to 7
    const num = weightedRandom(regularNumberFrequencies);
    if (!numbers.includes(num)) numbers.push(num);
  }
  const powerball = weightedRandom(powerballFrequencies);
  return { numbers, powerball };
}

// Function to generate random weighted guesses
function generateGuesses() {
  const guesses = [];
  for (let i = 0; i < 10; i++) {
    const guessSet = [];
    while (guessSet.length < 7) {
      // Changed from 5 to 7
      const num = weightedRandom(regularNumberFrequencies);
      if (!guessSet.includes(num)) guessSet.push(num);
    }
    const powerball = weightedRandom(powerballFrequencies);
    guesses.push({ numbers: guessSet, powerball });
  }
  return guesses;
}

// Function to generate weighted random numbers based on frequency
function weightedRandom(frequencyData) {
  const totalWeight = Object.values(frequencyData).reduce((a, b) => a + b, 0);
  const random = Math.floor(Math.random() * totalWeight);
  let cumulativeWeight = 0;
  for (const [num, weight] of Object.entries(frequencyData)) {
    cumulativeWeight += weight;
    if (random < cumulativeWeight) {
      return parseInt(num);
    }
  }
}

// Save prize data (counts, past draws with guesses and prizes) to localStorage
function savePrizeData(prizeCategory, winner, guesses) {
  let prizeData = initializePrizeData();

  // Update prize counts
  prizeData.prizeCounts[prizeCategory] += 1;

  // Save past draw with guesses and prize category
  prizeData.pastDraws.unshift({
    winner: { numbers: winner.numbers, powerball: winner.powerball },
    guesses: guesses.map((guess) => ({
      numbers: guess.numbers,
      powerball: guess.powerball,
      prize: getPrizeCategory(winner, guess),
    })),
  });

  // Limit the number of past draws stored (keeping the latest 5)
  if (prizeData.pastDraws.length > 5) {
    prizeData.pastDraws.pop();
  }

  // Store in localStorage
  localStorage.setItem("prizeData", JSON.stringify(prizeData));
}

// Function to check prize category based on the match
function getPrizeCategory(winner, guess) {
  const matchedNumbers = guess.numbers.filter((num) =>
    winner.numbers.includes(num)
  );
  const powerballMatch = guess.powerball === winner.powerball;

  let prizeCategory = "No Prize"; // Default prize is "No Prize"

  if (matchedNumbers.length === 7 && powerballMatch) {
    prizeCategory = "Jackpot";
  } else if (matchedNumbers.length === 7) {
    prizeCategory = "2nd Prize";
  } else if (matchedNumbers.length === 6 && powerballMatch) {
    prizeCategory = "3rd Prize";
  } else if (matchedNumbers.length === 6) {
    prizeCategory = "4th Prize";
  } else if (matchedNumbers.length === 5 && powerballMatch) {
    prizeCategory = "5th Prize";
  } else if (matchedNumbers.length === 4 && powerballMatch) {
    prizeCategory = "6th Prize";
  } else if (matchedNumbers.length === 5) {
    prizeCategory = "7th Prize";
  } else if (matchedNumbers.length === 3 && powerballMatch) {
    prizeCategory = "8th Prize";
  } else if (matchedNumbers.length === 2 && powerballMatch) {
    prizeCategory = "9th Prize";
  }

  return prizeCategory;
}

// Function to get color feedback for numbers
function getColorFeedback(num, winnerNumbers) {
  return winnerNumbers.includes(num) ? "green" : "red";
}

// Save the lottery data to localStorage
function saveLotteryData(winner, guesses) {
  let lotteryData = JSON.parse(localStorage.getItem("lotteryData")) || [];
  lotteryData.push({ winner, guesses });
  localStorage.setItem("lotteryData", JSON.stringify(lotteryData));
}

// Analyze the stored lottery data
function analyzeLotteryData() {
  const lotteryData = JSON.parse(localStorage.getItem("lotteryData")) || [];
  const analysisResults = document.getElementById("analysisResults");
  const totalDraws = lotteryData.length;
  const numberFrequency = {};

  // Count frequency of each number (regular + powerball)
  lotteryData.forEach((draw) => {
    draw.winner.numbers.forEach((num) => {
      numberFrequency[num] = (numberFrequency[num] || 0) + 1;
    });
    numberFrequency[draw.winner.powerball] =
      (numberFrequency[draw.winner.powerball] || 0) + 1;
  });

  analysisResults.innerHTML = `<h3>Analysis Results</h3>
    <p>Total Draws: ${totalDraws}</p>
    <p>Number Frequency:</p>
    <ul>
      ${Object.entries(numberFrequency)
        .map(([num, freq]) => `<li>Number ${num}: ${freq} times</li>`)
        .join("")}
    </ul>`;
}

// Initialize prize data with past guesses and draws from localStorage or set defaults
function initializePrizeData() {
  let prizeData = JSON.parse(localStorage.getItem("prizeData"));
  if (!prizeData) {
    prizeData = {
      prizeCounts: {
        Jackpot: 0,
        "2nd Prize": 0,
        "3rd Prize": 0,
        "4th Prize": 0,
        "5th Prize": 0,
        "6th Prize": 0,
        "7th Prize": 0,
        "8th Prize": 0,
        "9th Prize": 0,
        "No Prize": 0,
      },
      pastDraws: [], // Store array of past draws with guesses and prize categories
    };
  }
  return prizeData;
}

// Update prize counts in localStorage
function updatePrizeCounts(prizeCategory) {
  let prizeCounts = initializePrizeCounts();
  prizeCounts[prizeCategory] += 1;
  localStorage.setItem("prizeCounts", JSON.stringify(prizeCounts));
}

// Display prize counts
function displayPrizeCounts() {
  const prizeData = initializePrizeData();
  const prizeCountDisplay = document.getElementById("prizeCountDisplay");
  prizeCountDisplay.innerHTML = `<h3>Prize Counts:</h3>
      <ul>
        ${Object.entries(prizeData.prizeCounts)
          .map(([prize, count]) => `<li>${prize}: ${count} times</li>`)
          .join("")}
      </ul>`;
}
// Display the results and generate a new draw
document.getElementById("generateLottery").addEventListener("click", () => {
  const winner = generateWinner();
  const guesses = generateGuesses();

  // Save lottery data to localStorage
  savePrizeData(getPrizeCategory(winner, guesses[0]), winner, guesses);

  // Display lottery result
  const lotteryResult = document.getElementById("lotteryResult");
  lotteryResult.innerHTML = `<h3>Winning Numbers: ${winner.numbers.join(
    ", "
  )} + Powerball ${winner.powerball}</h3>`;

  // Display guesses and check for jackpot
  const comparisonResults = document.getElementById("comparisonResults");
  comparisonResults.innerHTML = "";
  guesses.forEach((guess, index) => {
    const prizeCategory = getPrizeCategory(winner, guess);

    const numberFeedback = guess.numbers
      .map((num) => {
        const color = getColorFeedback(num, winner.numbers);
        return `<span style="color: ${color};">${num}</span>`;
      })
      .join(", ");

    const powerballColor =
      winner.powerball === guess.powerball ? "green" : "red";
    const powerballFeedback = `<span style="color: ${powerballColor};">${guess.powerball}</span>`;

    comparisonResults.innerHTML += `
        <div class="guess-set">
          <p>Guess Set ${
            index + 1
          }: ${numberFeedback} + Powerball ${powerballFeedback} - <strong>${prizeCategory}</strong></p>
        </div>
      `;
  });

  // Analyze and display the stored data
  analyzeLotteryData();

  // Display updated prize counts and past winning draws
  displayPrizeCounts();
  displayPastWinningDraws();
});

// Display past winning draws, guesses, and prize categories
function displayPastWinningDraws() {
  const prizeData = initializePrizeData();
  const pastDrawsDisplay = document.getElementById("pastDrawsDisplay");

  pastDrawsDisplay.innerHTML = `<h3>Past Winning Draws:</h3>
      <ul>
        ${prizeData.pastDraws
          .map((draw, index) => {
            return `
            <li>
              <h4>Draw ${
                index + 1
              }: Winning Numbers: ${draw.winner.numbers.join(
              ", "
            )} + Powerball ${draw.winner.powerball}</h4>
              <ul>
                ${draw.guesses
                  .map((guess, guessIndex) => {
                    const numberFeedback = guess.numbers
                      .map((num) => {
                        const color = getColorFeedback(
                          num,
                          draw.winner.numbers
                        );
                        return `<span style="color: ${color};">${num}</span>`;
                      })
                      .join(", ");

                    const powerballColor =
                      draw.winner.powerball === guess.powerball
                        ? "green"
                        : "red";
                    const powerballFeedback = `<span style="color: ${powerballColor};">${guess.powerball}</span>`;

                    return `
                    <li>
                      Guess Set ${
                        guessIndex + 1
                      }: ${numberFeedback} + Powerball ${powerballFeedback} - <strong>${
                      guess.prize
                    }</strong>
                    </li>
                  `;
                  })
                  .join("")}
              </ul>
            </li>
          `;
          })
          .join("")}
      </ul>`;
}

// Clear session data and reset UI
document.getElementById("clearSession").addEventListener("click", () => {
  localStorage.removeItem("lotteryData");
  localStorage.removeItem("prizeData");
  document.getElementById("lotteryResult").innerHTML = "";
  document.getElementById("comparisonResults").innerHTML = "";
  document.getElementById("pastDrawsDisplay").innerHTML = "";
  document.getElementById("analysisResults").innerHTML = "";
  displayPrizeCounts(); // Show prize counts after clearing session
  displayPastWinningDraws(); // Show past winning draws after clearing session
});

// Load the analysis, prize counts, and past winning draws on page load
window.onload = function () {
  analyzeLotteryData();
  displayPrizeCounts();
  displayPastWinningDraws();
};
