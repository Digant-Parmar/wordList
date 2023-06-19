// Add the Firebase products that you want to use
// require("firebase/firestore");


const firebaseConfig = {
    apiKey: "AIzaSyCFxY-zzn8JrvALJqTKj8J8e5a7HgxpJ8U",
    authDomain: "wordlist-d4ad4.firebaseapp.com",
    projectId: "wordlist-d4ad4",
    databaseURL: "https://wordlist-d4ad4-default-rtdb.asia-southeast1.firebasedatabase.app",
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

// Get form and list elements
const wordForm = document.getElementById("wordForm");
const wordList = document.getElementById("wordList");

// Handle form submission
wordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get word and meaning inputs
    const wordInput = document.getElementById("wordInput");
    const meaningInput = document.getElementById("meaningInput");

    // Create a new word entry
    const newWordRef = database.ref("words").push();
    newWordRef.set({
        word: wordInput.value,
        meaning: meaningInput.value,
    });

    // Clear input fields
    wordInput.value = "";
    meaningInput.value = "";
});

// Fetch words from Firebase and display them
database.ref("words").on("value", (snapshot) => {
    wordList.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
        const word = childSnapshot.val().word;
        const meaning = childSnapshot.val().meaning;

        const li = document.createElement("li");
        li.innerText = `${word}: ${meaning}`;

        wordList.appendChild(li);
    });
});