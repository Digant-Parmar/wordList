// Get form, question container, and input elements
const wordTestForm = document.getElementById("wordTestForm");
const questionContainer = document.getElementById("questionContainer");
const numQuestionsInput = document.getElementById("numQuestions");
const generateButton = document.getElementById("generateButton");
const refreshButton = document.getElementById("refreshButton");

let testQuestions = []; // Array to store the test questions

// Function to generate random indices
function generateRandomIndices(max, count) {
    const indices = [];

    while (indices.length < count) {
        const index = Math.floor(Math.random() * max);

        if (!indices.includes(index)) {
            indices.push(index);
        }
    }

    return indices;
}

// Function to generate test questions
function generateTestQuestions(numQuestions) {
    database.ref("words").once("value", (snapshot) => {
        const words = snapshot.val();
        const wordKeys = Object.keys(words);
        testQuestions = [];

        // Generate random question indices
        const questionIndices = generateRandomIndices(wordKeys.length, numQuestions);

        // Create test questions using word and meaning data
        questionIndices.forEach((index) => {
            const wordKey = wordKeys[index];
            const word = words[wordKey].word;
            const meaning = words[wordKey].meaning;

            const options = generateOptions(words, wordKey, 3); // Generate 3 random options

            const question = {
                word: word,
                meaning: meaning,
                options: options,
                answer: meaning, // Store the correct answer
            };

            testQuestions.push(question);
        });

        // Display test questions
        displayTestQuestions();
    });
}

// Function to display test questions
function displayTestQuestions() {
    // Clear existing questions
    questionContainer.innerHTML = "";

    testQuestions.forEach((question, index) => {
                const div = document.createElement("div");
                div.innerHTML = `
      <h3>Question ${index + 1}</h3>
      <p>${question.word}</p>
      <ul>
        ${question.options
          .map(
            (option) =>
              `<li><input type="radio" name="question${index}" value="${option.value}">${option.display}</li>`
          )
          .join("")}
      </ul>
      <div class="answer" style="display: none;">Correct Answer: ${question.answer}</div>
    `;
    div.setAttribute("data-answer", question.answer); // Set the data-answer attribute
    questionContainer.appendChild(div);
  });
}

// Handle form submission
wordTestForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Disable form submission after it is submitted
  wordTestForm.classList.add("submitted");

  // Calculate test results
  const questions = Array.from(questionContainer.children);

  questions.forEach((question) => {
    const options = Array.from(question.getElementsByTagName("input"));

    // Find the correct option
    const correctOption = options.find(
      (option) => option.value === question.getAttribute("data-answer")
    );

    // Highlight the correct option
    if (correctOption) {
      correctOption.parentElement.classList.add("correct");
    }
  });

  // Disable further selection
  questions.forEach((question) => {
    const options = Array.from(question.getElementsByTagName("input"));
    options.forEach((option) => {
      option.disabled = true;
    });
  });
});

// Add event listener to the generate button
generateButton.addEventListener("click", () => {
  const numQuestions = parseInt(numQuestionsInput.value, 10);

  if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 10) {
    alert("Please enter a number between 1 and 10.");
    return;
  }

  generateTestQuestions(numQuestions);
});

// Add event listener to the refresh button
refreshButton.addEventListener("click", () => {
  const numQuestions = parseInt(numQuestionsInput.value, 10);

  if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 10) {
    alert("Please enter a number between 1 and 10.");
    return;
  }

  generateTestQuestions(numQuestions);
});

// Function to generate random options
function generateOptions(words, correctKey, count) {
  const options = [
    { value: words[correctKey].meaning, display: words[correctKey].meaning },
  ];

  while (options.length < count + 1) {
    const randomKey =
      Object.keys(words)[Math.floor(Math.random() * Object.keys(words).length)];

    if (
      !options.some((option) => option.value === words[randomKey].meaning) &&
      randomKey !== correctKey
    ) {
      options.push({
        value: words[randomKey].meaning,
        display: words[randomKey].meaning,
      });
    }
  }

  return shuffleArray(options);
}

// Function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}