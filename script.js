const svg = document.getElementById("cellSvg");
const statusText = document.getElementById("animationStatus");
const stepText = document.getElementById("stepText");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");
const explainButton = document.getElementById("explainButton");

const explanationSteps = [
  "Zink gibt Elektronen ab. Dabei entstehen Zn²⁺-Ionen.",
  "Die Elektronen fließen durch das Kabel zur Kupfer-Elektrode.",
  "Der Verbraucher wird durch den Elektronenfluss betrieben.",
  "Cu²⁺-Ionen nehmen Elektronen auf und werden zu Kupfer-Atomen.",
  "Die Ionenbrücke sorgt für Ladungsausgleich zwischen den Halbzellen."
];

let currentStep = 0;
let isRunning = false;

function startSimulation() {
  isRunning = true;
  svg.classList.add("is-running");
  svg.classList.remove("is-paused");
  setSvgAnimationsPaused(false);
  statusText.textContent = "Läuft";
}

function pauseSimulation() {
  if (!isRunning) {
    return;
  }

  svg.classList.add("is-paused");
  setSvgAnimationsPaused(true);
  statusText.textContent = "Pausiert";
}

function resetSimulation() {
  isRunning = false;
  currentStep = 0;
  svg.classList.remove("is-running", "is-paused");
  svg.setCurrentTime(0);
  setSvgAnimationsPaused(true);
  statusText.textContent = "Bereit";
  stepText.textContent = "Klicke auf „Schrittweise Erklärung“, um die Vorgänge nacheinander zu betrachten.";
}

function showNextExplanationStep() {
  stepText.textContent = explanationSteps[currentStep];
  currentStep = (currentStep + 1) % explanationSteps.length;
}

// SVG-Animationen lassen sich sauber über pauseAnimations/unpauseAnimations steuern.
function setSvgAnimationsPaused(shouldPause) {
  if (shouldPause) {
    svg.pauseAnimations();
  } else {
    svg.unpauseAnimations();
  }
}

startButton.addEventListener("click", startSimulation);
pauseButton.addEventListener("click", pauseSimulation);
resetButton.addEventListener("click", resetSimulation);
explainButton.addEventListener("click", showNextExplanationStep);

resetSimulation();
