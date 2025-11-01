// script.js
// Simple flashcard viewer: loads data/flashcards.json and shows one card.
// Click the card to toggle question/answer. Next button moves forward.

const DATA_PATH = 'data/flashcards.json'; // <- file path to your JSON
let flashcards = [];
let index = 0;
let showingAnswer = false;

const cardEl = document.getElementById('card');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const nextBtn = document.getElementById('nextBtn');
const counterEl = document.getElementById('counter');

function setCounter() {
  counterEl.textContent = `${flashcards.length ? index + 1 : 0} / ${flashcards.length}`;
}

function showCardAt(i) {
  if (!flashcards.length) return;
  index = (i + flashcards.length) % flashcards.length;
  const item = flashcards[index];
  questionEl.textContent = item.question || 'No question';
  answerEl.textContent = item.answer || 'No answer';
  // ensure front shown
  showingAnswer = false;
  cardEl.classList.remove('is-flipped');
  cardEl.setAttribute('aria-pressed', 'false');
  setCounter();
}

// Toggle flip
function toggleFlip() {
  showingAnswer = !showingAnswer;
  cardEl.classList.toggle('is-flipped', showingAnswer);
  cardEl.setAttribute('aria-pressed', showingAnswer ? 'true' : 'false');
}

// Next card
function goNext() {
  showCardAt(index + 1);
}

// keyboard accessibility: Space or Enter flips, N for next
function onKey(e) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    toggleFlip();
  } else if (e.key.toLowerCase() === 'n') {
    goNext();
  }
}

// Preload large JSON safely
async function loadData() {
  try {
    const res = await fetch(DATA_PATH);
    if (!res.ok) throw new Error('Failed to load JSON: ' + res.status);
    // parse JSON
    flashcards = await res.json();
    // verify array
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      questionEl.textContent = 'No flashcards found in JSON.';
      answerEl.textContent = '';
      setCounter();
      return;
    }
    // show first card
    showCardAt(0);
  } catch (err) {
    console.error(err);
    questionEl.textContent = 'Error loading flashcards.';
    answerEl.textContent = err.message || '';
    setCounter();
  }
}

// events
cardEl.addEventListener('click', toggleFlip);
cardEl.addEventListener('keydown', onKey);
nextBtn.addEventListener('click', goNext);
document.addEventListener('keydown', (e) => {
  // allow 'n' for next even if focus is elsewhere
  if (e.key.toLowerCase() === 'n' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
    goNext();
  }
});

// initialize
loadData();
