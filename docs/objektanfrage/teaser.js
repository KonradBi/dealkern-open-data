(function (root) {
  "use strict";
  const labels = { Wohnen: "Wohnimmobilie", Büro: "Büroimmobilie", Logistik: "Logistikimmobilie", Grundstück: "Grundstück", Hotel: "Hotel", Gewerbe: "Gewerbeimmobilie" };
  const clean = (value) => String(value ?? "").replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
  const positive = (value, label, optional) => {
    if (optional && (value === "" || value == null)) return null;
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) throw new Error(label + " muss größer als null sein.");
    return n;
  };
  const euro = (n) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  function build(input) {
    const city = clean(input.city);
    if (!city) throw new Error("Bitte geben Sie einen Ort ein.");
    if (city.length > 100) throw new Error("Bitte kürzen Sie den Ort auf höchstens 100 Zeichen.");
    if (!Object.hasOwn(labels, input.kind)) throw new Error("Bitte wählen Sie eine Objektart.");
    const kind = labels[input.kind];
    const article = input.kind === "Grundstück" || input.kind === "Hotel" ? "ein" : "eine";
    const price = positive(input.price, "Der Kaufpreis", false);
    const area = positive(input.area, "Die Fläche", true);
    const rent = input.rent === "" || input.rent == null ? null : Number(input.rent);
    if (rent != null && (!Number.isFinite(rent) || rent < 0)) throw new Error("Die Jahresnettokaltmiete darf nicht negativ sein.");
    const lines = ["Betreff: " + kind + " in " + city + " | " + euro(price), "", "Guten Tag,", "", "ich möchte Ihnen " + article + " " + kind + " in " + city + " zum Kauf anbieten.", "", "Kaufpreis: " + euro(price)];
    if (area) lines.push("Fläche: " + new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(area) + " m²");
    if (rent != null) lines.push("Jahresnettokaltmiete: " + euro(rent));
    lines.push("", "Passt ein solches Objekt grundsätzlich zu Ihrem aktuellen Ankaufsprofil? Bei Interesse sende ich Ihnen gern weitere Informationen.", "", "Viele Grüße", "[Ihr Name und Ihre Firma]");
    return { text: lines.join("\n"), factor: rent > 0 ? price / rent : null, grossYield: rent > 0 ? rent / price : null };
  }
  root.DealKernTeaser = { build };
  if (typeof module !== "undefined") module.exports = { build };
})(typeof window === "undefined" ? globalThis : window);
