let flashcards = [];
let currentCard = null;
let showingAnswer = false;

const cardContent = document.getElementById('card-content');
const statusText = document.getElementById('status');

// Load flashcards
fetch('data/flashcards.json')
  .then(res => res.json())
  .then(data => {
    flashcards = data;
    showRandomCard();
  })
  .catch(err => console.error("Error loading flashcards:", err));

// Show a random flashcard
function showRandomCard() {
  if (flashcards.length === 0) return;
  const randomIndex = Math.floor(Math.random() * flashcards.length);
  currentCard = flashcards[randomIndex];
  showingAnswer = false;
  cardContent.textContent = currentCard.question;
  updateStatus();
}

// Flip between question and answer
function flipCard() {
  if (!currentCard) return;
  showingAnswer = !showingAnswer;
  cardContent.textContent = showingAnswer
    ? currentCard.answer
    : currentCard.question;
}

// Update status (like progress or card count)
function updateStatus() {
  statusText.textContent = `Total Cards: ${flashcards.length}`;
}

// Event listeners
document.getElementById('flip-btn').addEventListener('click', flipCard);
document.getElementById('next-btn').addEventListener('click', showRandomCard);
