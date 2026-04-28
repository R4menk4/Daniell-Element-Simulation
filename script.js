const svg = document.getElementById("cellSvg");
const statusText = document.getElementById("animationStatus");
const stepText = document.getElementById("stepText");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");
const explainButton = document.getElementById("explainButton");
const detailSvg = document.querySelector(".detail-svg");
const nextDetailStepButton = document.getElementById("nextDetailStepButton");
const detailStepText = document.getElementById("detailStepText");
const termBank = document.getElementById("termBank");
const checkSelfTestButton = document.getElementById("checkSelfTestButton");
const resetSelfTestButton = document.getElementById("resetSelfTestButton");
const selfCheckResult = document.getElementById("selfCheckResult");

const explanationSteps = [
  "Zink gibt Elektronen ab. Dabei entstehen Zn²⁺-Ionen.",
  "Die Elektronen fließen durch das Kabel zur Kupfer-Elektrode.",
  "Der Verbraucher wird durch den Elektronenfluss betrieben.",
  "Cu²⁺-Ionen nehmen Elektronen auf und werden zu Kupfer-Atomen.",
  "Die Ionenbrücke sorgt für Ladungsausgleich zwischen den Halbzellen."
];

let currentStep = 0;
let isRunning = false;
let currentDetailStep = 0;

const zincDetailExplanationSteps = [
  "An der Oberfläche der Zink-Elektrode befinden sich Zink-Atome.",
  "Ein Zink-Atom gibt zwei Elektronen ab.",
  "Durch die Abgabe der Elektronen entsteht ein positiv geladenes Zn²⁺-Ion.",
  "Das Zn²⁺-Ion löst sich aus der Metalloberfläche und geht in die Lösung über.",
  "Die abgegebenen Elektronen bleiben im Metall und wandern weiter in Richtung Kabel.",
  "Dieser Vorgang heißt Oxidation."
];

const copperDetailExplanationSteps = [
  "An der Oberfläche der Kupfer-Elektrode befinden sich Kupfer-Atome.",
  "In der Lösung befinden sich Cu²⁺-Ionen.",
  "Elektronen kommen über den äußeren Stromkreis an der Kupfer-Elektrode an.",
  "Ein Cu²⁺-Ion nimmt zwei Elektronen auf.",
  "Durch die Aufnahme der Elektronen entsteht ein neutrales Kupfer-Atom.",
  "Das Kupfer-Atom lagert sich an der Kupfer-Elektrode ab.",
  "Dieser Vorgang heißt Reduktion."
];

const detailExplanationSteps =
  document.body.dataset.detailView === "copper"
    ? copperDetailExplanationSteps
    : zincDetailExplanationSteps;

function startSimulation() {
  if (!svg) {
    return;
  }

  isRunning = true;
  svg.classList.add("is-running");
  svg.classList.remove("is-paused");
  setSvgAnimationsPaused(false);
  statusText.textContent = "Läuft";
}

function pauseSimulation() {
  if (!svg || !isRunning) {
    return;
  }

  svg.classList.add("is-paused");
  setSvgAnimationsPaused(true);
  statusText.textContent = "Pausiert";
}

function resetSimulation() {
  if (!svg) {
    return;
  }

  isRunning = false;
  currentStep = 0;
  svg.classList.remove("is-running", "is-paused");
  svg.setCurrentTime(0);
  setSvgAnimationsPaused(true);
  statusText.textContent = "Bereit";
  stepText.textContent = "Klicke auf „Schrittweise Erklärung“, um die Vorgänge nacheinander zu betrachten.";
}

function showNextExplanationStep() {
  if (!stepText) {
    return;
  }

  stepText.textContent = explanationSteps[currentStep];
  currentStep = (currentStep + 1) % explanationSteps.length;
}

// SVG-Animationen lassen sich sauber über pauseAnimations/unpauseAnimations steuern.
function setSvgAnimationsPaused(shouldPause) {
  if (!svg) {
    return;
  }

  if (shouldPause) {
    svg.pauseAnimations();
  } else {
    svg.unpauseAnimations();
  }
}

function showNextDetailExplanationStep() {
  if (!detailStepText) {
    return;
  }

  detailStepText.textContent = detailExplanationSteps[currentDetailStep];
  currentDetailStep = (currentDetailStep + 1) % detailExplanationSteps.length;
}

if (startButton) startButton.addEventListener("click", startSimulation);
if (pauseButton) pauseButton.addEventListener("click", pauseSimulation);
if (resetButton) resetButton.addEventListener("click", resetSimulation);
if (explainButton) explainButton.addEventListener("click", showNextExplanationStep);
if (nextDetailStepButton) nextDetailStepButton.addEventListener("click", showNextDetailExplanationStep);

if (svg) {
  resetSimulation();
}

function initializeSelfCheck() {
  if (!termBank) {
    return;
  }

  const dropZones = Array.from(document.querySelectorAll(".drop-zone"));
  const termChips = Array.from(document.querySelectorAll(".term-chip"));

  termChips.forEach((chip) => {
    chip.addEventListener("dragstart", handleTermDragStart);
    chip.addEventListener("dragend", handleTermDragEnd);
  });

  dropZones.forEach((zone) => {
    zone.addEventListener("dragover", handleZoneDragOver);
    zone.addEventListener("dragleave", handleZoneDragLeave);
    zone.addEventListener("drop", handleZoneDrop);
  });

  if (checkSelfTestButton) {
    checkSelfTestButton.addEventListener("click", checkSelfTestAnswers);
  }

  if (resetSelfTestButton) {
    resetSelfTestButton.addEventListener("click", resetSelfTest);
  }
}

function handleTermDragStart(event) {
  event.dataTransfer.setData("text/plain", event.currentTarget.dataset.term);
  event.dataTransfer.effectAllowed = "move";
  event.currentTarget.classList.add("is-dragging");
}

function handleTermDragEnd(event) {
  event.currentTarget.classList.remove("is-dragging");
}

function handleZoneDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add("is-over");
}

function handleZoneDragLeave(event) {
  event.currentTarget.classList.remove("is-over");
}

function handleZoneDrop(event) {
  event.preventDefault();

  const zone = event.currentTarget;
  const term = event.dataTransfer.getData("text/plain");
  const draggedChip = document.querySelector(`.term-chip[data-term="${CSS.escape(term)}"]`);

  if (!draggedChip) {
    return;
  }

  const sourceZone = draggedChip.closest(".drop-zone");
  const existingChip = zone.querySelector(".term-chip");
  if (existingChip && existingChip !== draggedChip) {
    termBank.appendChild(existingChip);
  }

  zone.appendChild(draggedChip);
  if (sourceZone && sourceZone !== zone && !sourceZone.querySelector(".term-chip")) {
    sourceZone.classList.remove("has-term");
    clearZoneFeedback(sourceZone);
  }
  clearZoneFeedback(zone);
  zone.classList.add("has-term");
  zone.classList.remove("is-over");
}

function checkSelfTestAnswers() {
  const dropZones = Array.from(document.querySelectorAll(".drop-zone"));
  let correctCount = 0;

  dropZones.forEach((zone) => {
    clearZoneFeedback(zone);
    const chip = zone.querySelector(".term-chip");

    if (!chip) {
      return;
    }

    if (chip.dataset.term === zone.dataset.answer) {
      zone.classList.add("is-correct");
      correctCount += 1;
    } else {
      zone.classList.add("is-wrong");
    }
  });

  if (selfCheckResult) {
    selfCheckResult.textContent = `Du hast ${correctCount} von ${dropZones.length} Begriffen richtig zugeordnet.`;
  }
}

function resetSelfTest() {
  const dropZones = Array.from(document.querySelectorAll(".drop-zone"));
  const termChips = Array.from(document.querySelectorAll(".term-chip"));

  termChips
    .sort((a, b) => Number(a.dataset.originalOrder) - Number(b.dataset.originalOrder))
    .forEach((chip) => termBank.appendChild(chip));

  dropZones.forEach((zone) => {
    zone.classList.remove("has-term", "is-correct", "is-wrong", "is-over");
  });

  if (selfCheckResult) {
    selfCheckResult.textContent = "Ziehe die Begriffe in die leeren Felder.";
  }
}

function clearZoneFeedback(zone) {
  zone.classList.remove("is-correct", "is-wrong");
}

if (termBank) {
  Array.from(document.querySelectorAll(".term-chip")).forEach((chip, index) => {
    chip.dataset.originalOrder = String(index);
  });
  initializeSelfCheck();
}
