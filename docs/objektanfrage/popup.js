"use strict";
const form = document.getElementById("brief-form");
const output = document.getElementById("output");
const status = document.getElementById("status");
const copy = document.getElementById("copy");
const metrics = document.getElementById("metrics");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const draft = window.DealKernTeaser.build(Object.fromEntries(new FormData(form)));
    output.value = draft.text;
    copy.disabled = false;
    status.textContent = "Entwurf erstellt. Bitte prüfen Sie den Text.";
    metrics.hidden = draft.factor == null;
    metrics.textContent = draft.factor == null ? "" : "Kaufpreisfaktor: " + new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(draft.factor) + " · Mietrendite vor Kosten: " + new Intl.NumberFormat("de-DE", { style: "percent", maximumFractionDigits: 2 }).format(draft.grossYield);
  } catch (error) { status.textContent = error.message; }
});
output.addEventListener("input", () => { copy.disabled = !output.value.trim(); });
copy.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(output.value); status.textContent = "Text kopiert."; }
  catch { output.focus(); output.select(); status.textContent = "Bitte kopieren Sie den markierten Text mit Ihrer Tastatur."; }
});
