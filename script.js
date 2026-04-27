// Daniell-Element Simulation
// Die Animation modelliert vereinfacht: Oxidation an der Zink-Anode,
// Elektronenfluss durch den äußeren Stromkreis und Reduktion an der Kupfer-Kathode.

const SVG_NS = "http://www.w3.org/2000/svg";

const state = {
  running: false,
  rafId: null,
  lastSpawn: 0,
  cycleMs: 1700,
  explanationIndex: 0,
  electrons: [],
  zincIons: [],
  copperIons: [],
  bridgeIons: [],
  zincAtoms: [],
  copperDeposit: []
};

const explanations = [
  "Zink gibt Elektronen ab. Dabei entstehen Zn²⁺-Ionen.",
  "Die Elektronen fließen durch das Kabel zur Kupfer-Elektrode.",
  "Der Verbraucher wird durch den Elektronenfluss betrieben.",
  "Cu²⁺-Ionen nehmen Elektronen auf und werden zu Kupfer-Atomen.",
  "Die Ionenbrücke sorgt für Ladungsausgleich zwischen den Halbzellen."
];

const wirePoints = [
  { x: 260, y: 120 },
  { x: 460, y: 120 },
  { x: 520, y: 120 },
  { x: 680, y: 120 },
  { x: 740, y: 120 },
  { x: 940, y: 120 }
];

const bridgePath = [
  { x: 470, y: 270 },
  { x: 540, y: 228 },
  { x: 660, y: 228 },
  { x: 730, y: 270 }
];

const layers = {
  zincAtoms: document.getElementById("zincAtomsLayer"),
  zincIons: document.getElementById("zincIonsLayer"),
  copperIons: document.getElementById("copperIonsLayer"),
  copperDeposit: document.getElementById("copperDepositLayer"),
  bridgeIons: document.getElementById("bridgeIonsLayer"),
  electron: document.getElementById("electronLayer")
};

const explanationText = document.getElementById("explanationText");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const stepBtn = document.getElementById("stepBtn");

function createParticle(layer, x, y, r, color, label) {
  const group = document.createElementNS(SVG_NS, "g");
  const circle = document.createElementNS(SVG_NS, "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", r);
  circle.setAttribute("fill", color);
  circle.setAttribute("stroke", "rgba(0,0,0,0.35)");
  circle.setAttribute("stroke-width", "1.5");

  const text = document.createElementNS(SVG_NS, "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.setAttribute("class", "particle-label");
  text.textContent = label;

  group.append(circle, text);
  layer.appendChild(group);
  return { group, circle, text, x, y };
}

function lerpPoint(path, t) {
  const maxSegment = path.length - 1;
  const clamped = Math.max(0, Math.min(0.9999, t));
  const scaled = clamped * maxSegment;
  const i = Math.floor(scaled);
  const localT = scaled - i;
  const p1 = path[i];
  const p2 = path[i + 1];
  return {
    x: p1.x + (p2.x - p1.x) * localT,
    y: p1.y + (p2.y - p1.y) * localT
  };
}

function seedStaticParticles() {
  for (let i = 0; i < 8; i += 1) {
    const y = 260 + i * 32;
    state.zincAtoms.push(createParticle(layers.zincAtoms, 275 + (i % 2 === 0 ? -10 : 12), y, 13, "#79808d", "Zn"));
  }

  for (let i = 0; i < 8; i += 1) {
    const x = 810 + (i % 4) * 55;
    const y = 355 + Math.floor(i / 4) * 75;
    state.copperIons.push(createParticle(layers.copperIons, x, y, 13, "#1b8fb6", "Cu²⁺"));
  }

  for (let i = 0; i < 5; i += 1) {
    const t = i / 5;
    const p = lerpPoint(bridgePath, t);
    state.bridgeIons.push(createParticle(layers.bridgeIons, p.x, p.y, 10, i % 2 === 0 ? "#6b4f8d" : "#3c64d6", i % 2 === 0 ? "SO₄²⁻" : "K⁺"));
  }
}

function spawnCycle() {
  // 1) Oxidation: Zn-Atom wird zu Zn2+ in Lösung.
  const atom = state.zincAtoms.shift();
  if (atom) {
    atom.group.remove();
  }

  const newIon = createParticle(
    layers.zincIons,
    315,
    360 + Math.random() * 150,
    13,
    "#405ec4",
    "Zn²⁺"
  );
  state.zincIons.push({ ...newIon, drift: 0 });

  // 2) Zwei Elektronen in den äußeren Stromkreis.
  for (let i = 0; i < 2; i += 1) {
    const electron = createParticle(layers.electron, 260, 120, 8, "#111", "e⁻");
    state.electrons.push({ ...electron, t: i * 0.08, speed: 0.16 + Math.random() * 0.03 });
  }

  // 3) Reduktion: ein Cu2+-Ion wird als Cu abgeschieden.
  const cuIon = state.copperIons.shift();
  if (cuIon) {
    cuIon.group.remove();
  }

  const deposit = createParticle(
    layers.copperDeposit,
    875 + Math.random() * 35,
    370 + Math.random() * 140,
    10,
    "#b56a2a",
    "Cu"
  );
  state.copperDeposit.push(deposit);

  // Ergänze Cu2+-Ionen, damit rechts immer ein Vorrat sichtbar bleibt.
  if (state.copperIons.length < 8) {
    const refill = createParticle(
      layers.copperIons,
      820 + Math.random() * 220,
      350 + Math.random() * 170,
      13,
      "#1b8fb6",
      "Cu²⁺"
    );
    state.copperIons.push(refill);
  }

  explanationText.textContent = explanations[0];
}

function updateElectrons(dtMs) {
  const dt = dtMs / 1000;
  state.electrons.forEach((electron) => {
    electron.t += electron.speed * dt;
    const p = lerpPoint(wirePoints, electron.t);
    electron.x = p.x;
    electron.y = p.y;
    electron.circle.setAttribute("cx", p.x);
    electron.circle.setAttribute("cy", p.y);
    electron.text.setAttribute("x", p.x);
    electron.text.setAttribute("y", p.y);
  });

  state.electrons = state.electrons.filter((electron) => {
    const active = electron.t < 1;
    if (!active) {
      electron.group.remove();
    }
    return active;
  });
}

function updateIons(dtMs) {
  const dt = dtMs / 1000;

  state.zincIons.forEach((ion) => {
    ion.drift += dt;
    ion.y += Math.sin(ion.drift * 2.8) * 0.2;
    ion.x += 0.02;
    ion.circle.setAttribute("cx", ion.x);
    ion.circle.setAttribute("cy", ion.y);
    ion.text.setAttribute("x", ion.x);
    ion.text.setAttribute("y", ion.y);
  });

  state.bridgeIons.forEach((ion, idx) => {
    ion.progress = (ion.progress || idx / state.bridgeIons.length) + dt * 0.1;
    const wrapped = ion.progress % 1;
    const p = lerpPoint(bridgePath, wrapped);
    ion.circle.setAttribute("cx", p.x);
    ion.circle.setAttribute("cy", p.y);
    ion.text.setAttribute("x", p.x);
    ion.text.setAttribute("y", p.y);
  });
}

function animateFrame(now) {
  if (!state.running) return;

  if (!state.lastTs) state.lastTs = now;
  const dtMs = now - state.lastTs;
  state.lastTs = now;

  if (!state.lastSpawn || now - state.lastSpawn > state.cycleMs) {
    state.lastSpawn = now;
    spawnCycle();
  }

  updateElectrons(dtMs);
  updateIons(dtMs);

  state.rafId = requestAnimationFrame(animateFrame);
}

function startSimulation() {
  if (state.running) return;
  state.running = true;
  state.lastTs = 0;
  state.rafId = requestAnimationFrame(animateFrame);
}

function pauseSimulation() {
  state.running = false;
  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
}

function clearLayer(layer) {
  while (layer.firstChild) layer.removeChild(layer.firstChild);
}

function resetSimulation() {
  pauseSimulation();
  state.electrons = [];
  state.zincIons = [];
  state.copperIons = [];
  state.bridgeIons = [];
  state.zincAtoms = [];
  state.copperDeposit = [];

  Object.values(layers).forEach(clearLayer);
  seedStaticParticles();

  explanationText.textContent = "Drücke „Start“, um die Reaktion zu beobachten.";
  state.explanationIndex = 0;
}

function showNextExplanation() {
  const text = explanations[state.explanationIndex % explanations.length];
  explanationText.textContent = text;
  state.explanationIndex += 1;
}

startBtn.addEventListener("click", startSimulation);
pauseBtn.addEventListener("click", pauseSimulation);
resetBtn.addEventListener("click", resetSimulation);
stepBtn.addEventListener("click", showNextExplanation);

resetSimulation();
